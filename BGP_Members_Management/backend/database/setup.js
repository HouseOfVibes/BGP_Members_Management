const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('Starting database setup...\n');
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'bgp_members_db';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' ready`);
    
    // Use the database
    await connection.execute(`USE ${dbName}`);
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema_simple.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log('✅ Database schema created/updated');
    
    // Check if admin exists
    const [admins] = await connection.execute(
      'SELECT id FROM members WHERE role = ? LIMIT 1',
      ['admin']
    );
    
    if (admins.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(`
        INSERT INTO members (
          first_name, last_name, email, password, phone,
          address, city, state, zip_code, 
          membership_type, status, role, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        'Admin',
        'User',
        'admin@bgpnc.com',
        hashedPassword,
        '555-0100',
        '123 Admin St',
        'Charlotte',
        'NC',
        '28201',
        'lifetime',
        'active',
        'admin'
      ]);
      
      console.log('\n✅ Admin user created:');
      console.log('   Email: admin@bgpnc.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change the password after first login!\n');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Create some sample members for testing
    const [sampleMembers] = await connection.execute(
      'SELECT COUNT(*) as count FROM members WHERE role = ?',
      ['member']
    );
    
    if (sampleMembers[0].count === 0) {
      console.log('Creating sample members for testing...');
      
      const sampleData = [
        ['John', 'Smith', 'john.smith@example.com', '555-0101', '456 Oak St', 'Charlotte', 'NC', '28202', 'annual', 'active'],
        ['Sarah', 'Johnson', 'sarah.j@example.com', '555-0102', '789 Pine Ave', 'Charlotte', 'NC', '28203', 'annual', 'active'],
        ['Michael', 'Brown', 'mbrown@example.com', '555-0103', '321 Elm Dr', 'Charlotte', 'NC', '28204', 'lifetime', 'active'],
        ['Emily', 'Davis', 'emily.d@example.com', '555-0104', '654 Maple Ln', 'Charlotte', 'NC', '28205', 'annual', 'pending'],
        ['David', 'Wilson', 'dwilson@example.com', '555-0105', '987 Cedar Blvd', 'Charlotte', 'NC', '28206', 'annual', 'inactive']
      ];
      
      for (const member of sampleData) {
        const hashedPassword = await bcrypt.hash('member123', 10);
        await connection.execute(`
          INSERT INTO members (
            first_name, last_name, email, password, phone,
            address, city, state, zip_code,
            membership_type, status, role, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [...member.slice(0, 8), member[8], member[9], 'member']);
      }
      
      console.log('Sample members created');
    }
    
    console.log('\nDatabase setup complete!');
    console.log('\nYou can now start the application:');
    console.log('  npm run dev (from the root directory)');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();