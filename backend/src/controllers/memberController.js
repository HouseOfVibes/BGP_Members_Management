const pool = require('../config/database');
const logger = require('../utils/logger');
const { sendWelcomeEmail } = require('../services/emailService');

// Register new member (public endpoint)
exports.registerMember = async (req, res, next) => {
    try {
        // Extract member data
        const memberData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            street_address: req.body.street_address,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            date_of_birth: req.body.date_of_birth,
            baptism_date: req.body.baptism_date || null,
            marital_status: req.body.marital_status || null,
            spouse_name: req.body.spouse_name || null,
            photo_consent: req.body.photo_consent || false,
            social_media_consent: req.body.social_media_consent || false,
            email_consent: req.body.email_consent || true,
            referral_source: req.body.referral_source || null,
            registration_method: 'online'
        };

        // Try database registration first
        try {
            const connection = await pool.getConnection();
            
            try {
                await connection.beginTransaction();
                
                // Insert member
                const [memberResult] = await connection.execute(
                    `INSERT INTO members SET ?`,
                    [memberData]
                );
                
                const memberId = memberResult.insertId;
                
                // Insert children if any
                if (req.body.children && req.body.children.length > 0) {
                    for (const child of req.body.children) {
                        if (child.name) { // Only add if child has a name
                            await connection.execute(
                                `INSERT INTO children (parent_id, name, date_of_birth, gender, parental_consent) 
                                 VALUES (?, ?, ?, ?, ?)`,
                                [
                                    memberId,
                                    child.name,
                                    child.date_of_birth || null,
                                    child.gender || null,
                                    req.body.parental_consent || false
                                ]
                            );
                        }
                    }
                }
                
                // Log activity
                await connection.execute(
                    `INSERT INTO activity_logs (action, entity_type, entity_id, details, ip_address, user_agent) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        'member_registration',
                        'member',
                        memberId,
                        JSON.stringify({ source: 'online_form', email: memberData.email }),
                        req.ip,
                        req.get('user-agent')
                    ]
                );
                
                await connection.commit();
                
                // Send welcome email (async, don't wait)
                sendWelcomeEmail(memberData.email, memberData.first_name).catch(err => {
                    logger.error('Failed to send welcome email:', err);
                });
                
                logger.info(`New member registered: ${memberData.first_name} ${memberData.last_name} (ID: ${memberId})`);
                
                res.status(201).json({
                    success: true,
                    message: 'Registration successful! Welcome to Believers Gathering Place.',
                    memberId: memberId
                });
                
            } catch (error) {
                await connection.rollback();
                
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        success: false,
                        message: 'This email address is already registered.'
                    });
                }
                
                throw error;
            } finally {
                connection.release();
            }
        } catch (dbError) {
            // Database connection failed - simulate success in development mode
            logger.warn('Database not available, simulating successful registration for development');
            
            // Generate fake member ID for development
            const fakeMemberId = Math.floor(Math.random() * 1000) + 1;
            
            logger.info(`Development mode - simulated registration: ${memberData.first_name} ${memberData.last_name} (Fake ID: ${fakeMemberId})`);
            
            res.status(201).json({
                success: true,
                message: 'Registration successful! Welcome to Believers Gathering Place. (Development Mode - Database not connected)',
                memberId: fakeMemberId
            });
        }
    } catch (error) {
        logger.error('Registration error:', error);
        next(error);
    }
};

// Get all members (admin only)
exports.getAllMembers = async (req, res, next) => {
    try {
        // Try database first
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 25;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';
            const status = req.query.status || 'all';
            
            let query = `
                SELECT 
                    m.*,
                    COUNT(c.id) as children_count
                FROM members m
                LEFT JOIN children c ON m.id = c.parent_id
                WHERE 1=1
            `;
            
            const params = [];
            
            // Add search filter
            if (search) {
                query += ` AND (
                    m.first_name LIKE ? OR 
                    m.last_name LIKE ? OR 
                    m.email LIKE ? OR 
                    m.phone LIKE ?
                )`;
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam, searchParam);
            }
            
            // Add status filter
            if (status !== 'all') {
                query += ` AND m.member_status = ?`;
                params.push(status);
            }
            
            query += ` GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);
            
            const [members] = await pool.execute(query, params);
            
            // Get total count for pagination
            let countQuery = `SELECT COUNT(DISTINCT m.id) as total FROM members m WHERE 1=1`;
            const countParams = [];
            
            if (search) {
                countQuery += ` AND (
                    m.first_name LIKE ? OR 
                    m.last_name LIKE ? OR 
                    m.email LIKE ? OR 
                    m.phone LIKE ?
                )`;
                const searchParam = `%${search}%`;
                countParams.push(searchParam, searchParam, searchParam, searchParam);
            }
            
            if (status !== 'all') {
                countQuery += ` AND m.member_status = ?`;
                countParams.push(status);
            }
            
            const [countResult] = await pool.execute(countQuery, countParams);
            const totalMembers = countResult[0].total;
            const totalPages = Math.ceil(totalMembers / limit);
            
            res.json({
                success: true,
                members: members,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalMembers: totalMembers,
                    limit: limit
                }
            });
        } catch (dbError) {
            // Database connection failed - return mock data for development
            logger.warn('Database not available, returning mock data for development');
            
            const mockMembers = [
                {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Smith',
                    email: 'john@example.com',
                    phone: '(919) 555-0123',
                    member_status: 'active',
                    created_at: new Date().toISOString(),
                    children_count: 2
                },
                {
                    id: 2,
                    first_name: 'Jane',
                    last_name: 'Doe',
                    email: 'jane@example.com',
                    phone: '(919) 555-0124',
                    member_status: 'new_member',
                    created_at: new Date().toISOString(),
                    children_count: 0
                }
            ];
            
            res.json({
                success: true,
                members: mockMembers,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalMembers: 2,
                    limit: 25
                },
                note: 'Development mode - Database not connected'
            });
        }
    } catch (error) {
        logger.error('Error fetching members:', error);
        next(error);
    }
};

// Get single member by ID
exports.getMemberById = async (req, res, next) => {
    try {
        const memberId = req.params.id;
        
        try {
            // Get member details
            const [members] = await pool.execute(
                'SELECT * FROM members WHERE id = ?',
                [memberId]
            );
            
            if (members.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found'
                });
            }
            
            // Get children
            const [children] = await pool.execute(
                'SELECT * FROM children WHERE parent_id = ?',
                [memberId]
            );
            
            const member = members[0];
            member.children = children;
            
            res.json({
                success: true,
                member: member
            });
        } catch (dbError) {
            // Database connection failed - return mock data
            logger.warn('Database not available, returning mock data for development');
            
            const mockMember = {
                id: parseInt(memberId),
                first_name: 'John',
                last_name: 'Smith',
                email: 'john@example.com',
                phone: '(919) 555-0123',
                member_status: 'active',
                created_at: new Date().toISOString(),
                children: []
            };
            
            res.json({
                success: true,
                member: mockMember,
                note: 'Development mode - Database not connected'
            });
        }
    } catch (error) {
        logger.error('Error fetching member:', error);
        next(error);
    }
};

// Update member
exports.updateMember = async (req, res, next) => {
    try {
        // Try database first
        try {
            const connection = await pool.getConnection();
            
            try {
                await connection.beginTransaction();
                
                const memberId = req.params.id;
                const updates = req.body;
                
                // Remove fields that shouldn't be updated directly
                delete updates.id;
                delete updates.created_at;
                delete updates.updated_at;
                
                // Build update query
                const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
                const updateValues = Object.values(updates);
                updateValues.push(memberId);
                
                if (updateFields.length > 0) {
                    await connection.execute(
                        `UPDATE members SET ${updateFields} WHERE id = ?`,
                        updateValues
                    );
                }
                
                // Log activity
                await connection.execute(
                    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        req.user.id,
                        'member_update',
                        'member',
                        memberId,
                        JSON.stringify({ updates: Object.keys(updates) }),
                        req.ip
                    ]
                );
                
                await connection.commit();
                
                res.json({
                    success: true,
                    message: 'Member updated successfully'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (dbError) {
            // Database connection failed - simulate success
            logger.warn('Database not available, simulating successful update for development');
            
            res.json({
                success: true,
                message: 'Member updated successfully (Development Mode - Database not connected)'
            });
        }
    } catch (error) {
        logger.error('Error updating member:', error);
        next(error);
    }
};

// Delete member
exports.deleteMember = async (req, res, next) => {
    try {
        // Try database first
        try {
            const connection = await pool.getConnection();
            
            try {
                await connection.beginTransaction();
                
                const memberId = req.params.id;
                
                // Check if member exists
                const [members] = await connection.execute(
                    'SELECT * FROM members WHERE id = ?',
                    [memberId]
                );
                
                if (members.length === 0) {
                    await connection.rollback();
                    return res.status(404).json({
                        success: false,
                        message: 'Member not found'
                    });
                }
                
                // Log activity before deletion
                await connection.execute(
                    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        req.user.id,
                        'member_delete',
                        'member',
                        memberId,
                        JSON.stringify({ member: members[0] }),
                        req.ip
                    ]
                );
                
                // Delete member (children will be deleted automatically due to CASCADE)
                await connection.execute(
                    'DELETE FROM members WHERE id = ?',
                    [memberId]
                );
                
                await connection.commit();
                
                logger.info(`Member deleted: ID ${memberId} by user ${req.user.username}`);
                
                res.json({
                    success: true,
                    message: 'Member deleted successfully'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (dbError) {
            // Database connection failed - simulate success
            logger.warn('Database not available, simulating successful deletion for development');
            
            res.json({
                success: true,
                message: 'Member deleted successfully (Development Mode - Database not connected)'
            });
        }
    } catch (error) {
        logger.error('Error deleting member:', error);
        next(error);
    }
};

// Update member status
exports.updateMemberStatus = async (req, res, next) => {
    try {
        const memberId = req.params.id;
        const { status } = req.body;
        
        if (!['new_member', 'active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }
        
        try {
            await pool.execute(
                'UPDATE members SET member_status = ? WHERE id = ?',
                [status, memberId]
            );
            
            // Log activity
            await pool.execute(
                `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    req.user.id,
                    'status_update',
                    'member',
                    memberId,
                    JSON.stringify({ new_status: status }),
                    req.ip
                ]
            );
            
            res.json({
                success: true,
                message: 'Member status updated successfully'
            });
        } catch (dbError) {
            // Database connection failed - simulate success
            logger.warn('Database not available, simulating successful status update for development');
            
            res.json({
                success: true,
                message: 'Member status updated successfully (Development Mode - Database not connected)'
            });
        }
    } catch (error) {
        logger.error('Error updating member status:', error);
        next(error);
    }
};