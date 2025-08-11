const pool = require('../config/database');
const logger = require('../utils/logger');
// Note: csv-writer not installed, will implement basic CSV creation
const XLSX = require('xlsx');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get total members
        const [totalResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM members'
        );
        
        // Get new members this month
        const [newThisMonthResult] = await pool.execute(
            `SELECT COUNT(*) as count FROM members 
             WHERE MONTH(join_date) = MONTH(CURRENT_DATE()) 
             AND YEAR(join_date) = YEAR(CURRENT_DATE())`
        );
        
        // Get members by status
        const [statusResult] = await pool.execute(
            `SELECT member_status, COUNT(*) as count 
             FROM members 
             GROUP BY member_status`
        );
        
        // Get recent members
        const [recentMembers] = await pool.execute(
            `SELECT id, first_name, last_name, email, phone, join_date, member_status 
             FROM members 
             ORDER BY created_at DESC 
             LIMIT 10`
        );
        
        // Get consent statistics
        const [consentStats] = await pool.execute(
            `SELECT 
                SUM(photo_consent) as photo_consent_count,
                SUM(social_media_consent) as social_media_consent_count,
                SUM(email_consent) as email_consent_count,
                COUNT(*) as total
             FROM members`
        );
        
        // Format status counts
        const statusCounts = {
            new_member: 0,
            active: 0,
            inactive: 0
        };
        
        statusResult.forEach(row => {
            statusCounts[row.member_status] = row.count;
        });
        
        res.json({
            success: true,
            stats: {
                totalMembers: totalResult[0].total,
                newThisMonth: newThisMonthResult[0].count,
                activeMembers: statusCounts.active,
                inactiveMembers: statusCounts.inactive,
                newMembers: statusCounts.new_member,
                consentRates: {
                    photo: Math.round((consentStats[0].photo_consent_count / consentStats[0].total) * 100),
                    socialMedia: Math.round((consentStats[0].social_media_consent_count / consentStats[0].total) * 100),
                    email: Math.round((consentStats[0].email_consent_count / consentStats[0].total) * 100)
                }
            },
            recentMembers: recentMembers
        });
    } catch (error) {
        logger.error('Error fetching dashboard stats:', error);
        next(error);
    }
};

// Get analytics data
exports.getAnalytics = async (req, res, next) => {
    try {
        const range = req.query.range || '30days';
        let dateFilter = '';
        
        switch(range) {
            case '7days':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
                break;
            case '30days':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
                break;
            case '90days':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 90 DAY)';
                break;
            case 'year':
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
                break;
            default:
                dateFilter = 'DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        }
        
        // Growth over time
        const [growthData] = await pool.execute(
            `SELECT 
                DATE(join_date) as date,
                COUNT(*) as new_members
             FROM members
             WHERE join_date >= ${dateFilter}
             GROUP BY DATE(join_date)
             ORDER BY date`
        );
        
        // Age distribution
        const [ageData] = await pool.execute(
            `SELECT 
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) < 18 THEN 'Under 18'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 36 AND 45 THEN '36-45'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 46 AND 55 THEN '46-55'
                    WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 56 AND 65 THEN '56-65'
                    ELSE 'Over 65'
                END as age_group,
                COUNT(*) as count
             FROM members
             GROUP BY age_group
             ORDER BY age_group`
        );
        
        // Referral sources
        const [referralData] = await pool.execute(
            `SELECT 
                COALESCE(referral_source, 'Not specified') as source,
                COUNT(*) as count
             FROM members
             GROUP BY referral_source
             ORDER BY count DESC`
        );
        
        // Marital status distribution
        const [maritalData] = await pool.execute(
            `SELECT 
                COALESCE(marital_status, 'Not specified') as status,
                COUNT(*) as count
             FROM members
             GROUP BY marital_status`
        );
        
        // Family statistics
        const [familyStats] = await pool.execute(
            `SELECT 
                AVG(child_count) as avg_children,
                MAX(child_count) as max_children,
                SUM(CASE WHEN child_count > 0 THEN 1 ELSE 0 END) as families_with_children
             FROM (
                SELECT 
                    m.id,
                    COUNT(c.id) as child_count
                FROM members m
                LEFT JOIN children c ON m.id = c.parent_id
                GROUP BY m.id
             ) as family_data`
        );
        
        res.json({
            success: true,
            analytics: {
                growthChart: {
                    labels: growthData.map(d => d.date),
                    data: growthData.map(d => d.new_members)
                },
                ageDistribution: {
                    labels: ageData.map(d => d.age_group),
                    data: ageData.map(d => d.count)
                },
                referralSources: {
                    labels: referralData.map(d => d.source),
                    data: referralData.map(d => d.count)
                },
                maritalStatus: {
                    labels: maritalData.map(d => d.status),
                    data: maritalData.map(d => d.count)
                },
                familyStatistics: {
                    averageChildren: parseFloat(familyStats[0].avg_children).toFixed(2),
                    maxChildren: familyStats[0].max_children,
                    familiesWithChildren: familyStats[0].families_with_children
                }
            }
        });
    } catch (error) {
        logger.error('Error fetching analytics:', error);
        next(error);
    }
};

// Export members to CSV
exports.exportToCSV = async (req, res, next) => {
    try {
        const status = req.query.status || 'all';
        
        let query = `
            SELECT 
                m.first_name,
                m.last_name,
                m.email,
                m.phone,
                m.street_address,
                m.city,
                m.state,
                m.zip_code,
                m.date_of_birth,
                m.join_date,
                m.baptism_date,
                m.member_status,
                m.marital_status,
                m.spouse_name,
                m.photo_consent,
                m.social_media_consent,
                m.email_consent,
                m.referral_source,
                COUNT(c.id) as children_count
            FROM members m
            LEFT JOIN children c ON m.id = c.parent_id
        `;
        
        const params = [];
        if (status !== 'all') {
            query += ' WHERE m.member_status = ?';
            params.push(status);
        }
        
        query += ' GROUP BY m.id ORDER BY m.last_name, m.first_name';
        
        const [members] = await pool.execute(query, params);
        
        // Create CSV manually (simple implementation)
        const headers = [
            'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City', 'State', 
            'ZIP Code', 'Date of Birth', 'Join Date', 'Baptism Date', 'Status',
            'Marital Status', 'Spouse Name', 'Number of Children', 'Photo Consent',
            'Social Media Consent', 'Email Consent', 'Referral Source'
        ];
        
        let csvData = headers.join(',') + '\n';
        
        members.forEach(member => {
            const row = [
                member.first_name || '',
                member.last_name || '',
                member.email || '',
                member.phone || '',
                member.street_address || '',
                member.city || '',
                member.state || '',
                member.zip_code || '',
                member.date_of_birth || '',
                member.join_date || '',
                member.baptism_date || '',
                member.member_status || '',
                member.marital_status || '',
                member.spouse_name || '',
                member.children_count || 0,
                member.photo_consent ? 'Yes' : 'No',
                member.social_media_consent ? 'Yes' : 'No',
                member.email_consent ? 'Yes' : 'No',
                member.referral_source || ''
            ];
            csvData += row.map(field => `"${field}"`).join(',') + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=bgp-members-${Date.now()}.csv`);
        res.send(csvData);
        
        // Log export
        await pool.execute(
            `INSERT INTO activity_logs (user_id, action, entity_type, details, ip_address) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                req.user.id,
                'data_export',
                'members',
                JSON.stringify({ format: 'csv', count: members.length }),
                req.ip
            ]
        );
    } catch (error) {
        logger.error('Error exporting to CSV:', error);
        next(error);
    }
};

// Export members to Excel
exports.exportToExcel = async (req, res, next) => {
    try {
        const status = req.query.status || 'all';
        
        let query = `
            SELECT 
                m.*,
                COUNT(c.id) as children_count
            FROM members m
            LEFT JOIN children c ON m.id = c.parent_id
        `;
        
        const params = [];
        if (status !== 'all') {
            query += ' WHERE m.member_status = ?';
            params.push(status);
        }
        
        query += ' GROUP BY m.id ORDER BY m.last_name, m.first_name';
        
        const [members] = await pool.execute(query, params);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Members sheet
        const membersWs = XLSX.utils.json_to_sheet(members);
        XLSX.utils.book_append_sheet(wb, membersWs, 'Members');
        
        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=bgp-members-${Date.now()}.xlsx`);
        res.send(buffer);
        
        // Log export
        await pool.execute(
            `INSERT INTO activity_logs (user_id, action, entity_type, details, ip_address) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                req.user.id,
                'data_export',
                'members',
                JSON.stringify({ format: 'excel', count: members.length }),
                req.ip
            ]
        );
    } catch (error) {
        logger.error('Error exporting to Excel:', error);
        next(error);
    }
};

// Get activity logs
exports.getActivityLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;
        
        const [logs] = await pool.execute(
            `SELECT 
                al.*,
                u.username,
                u.full_name
             FROM activity_logs al
             LEFT JOIN users u ON al.user_id = u.id
             ORDER BY al.created_at DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM activity_logs'
        );
        
        res.json({
            success: true,
            logs: logs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(countResult[0].total / limit),
                totalLogs: countResult[0].total,
                limit: limit
            }
        });
    } catch (error) {
        logger.error('Error fetching activity logs:', error);
        next(error);
    }
};

// Bulk update member status
exports.bulkUpdateStatus = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { memberIds, status } = req.body;
        
        if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Member IDs array is required'
            });
        }
        
        if (!['new_member', 'active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }
        
        // Update members
        const placeholders = memberIds.map(() => '?').join(',');
        await connection.execute(
            `UPDATE members SET member_status = ? WHERE id IN (${placeholders})`,
            [status, ...memberIds]
        );
        
        // Log bulk update
        await connection.execute(
            `INSERT INTO activity_logs (user_id, action, entity_type, details, ip_address) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                req.user.id,
                'bulk_status_update',
                'members',
                JSON.stringify({ memberIds, newStatus: status }),
                req.ip
            ]
        );
        
        await connection.commit();
        
        res.json({
            success: true,
            message: `Successfully updated ${memberIds.length} members to ${status} status`
        });
    } catch (error) {
        await connection.rollback();
        logger.error('Error in bulk update:', error);
        next(error);
    } finally {
        connection.release();
    }
};