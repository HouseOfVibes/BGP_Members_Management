const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    logger.warn('⚠️  Supabase credentials not configured');
    console.warn('⚠️  SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables');
    console.warn('   The application will run in development mode with mock data');
}

// Create Supabase client with service role key (bypasses RLS for admin operations)
const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseServiceKey || 'dummy-key', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Test connection
if (supabaseUrl && supabaseServiceKey) {
    supabase
        .from('members')
        .select('count', { count: 'exact', head: true })
        .then(({ error }) => {
            if (error) {
                logger.error('❌ Supabase connection failed:', error.message);
                console.error('⚠️  Supabase not available - some features will not work.');
                console.error('   Please check your SUPABASE_URL and SUPABASE_SERVICE_KEY.');
            } else {
                logger.info('✅ Supabase connected successfully');
            }
        })
        .catch(err => {
            logger.error('❌ Supabase connection error:', err);
            console.error('⚠️  Supabase not available - some features will not work.');
        });
}

module.exports = supabase;
