// Helper utility functions

/**
 * Calculate age from date of birth
 * @param {Date|string} dateOfBirth 
 * @returns {number} Age in years
 */
exports.calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

/**
 * Format phone number
 * @param {string} phone 
 * @returns {string} Formatted phone number
 */
exports.formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }
    
    return phone; // Return original if can't format
};

/**
 * Generate random password
 * @param {number} length 
 * @returns {string} Random password
 */
exports.generatePassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
};

/**
 * Sanitize string for SQL queries
 * @param {string} str 
 * @returns {string} Sanitized string
 */
exports.sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    return str
        .replace(/'/g, "''")  // Escape single quotes
        .trim();
};

/**
 * Check if email is valid
 * @param {string} email 
 * @returns {boolean}
 */
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if phone number is valid (US format)
 * @param {string} phone 
 * @returns {boolean}
 */
exports.isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[1]?[\s\-\.]?\(?([0-9]{3})\)?[\s\-\.]?([0-9]{3})[\s\-\.]?([0-9]{4})$/;
    return phoneRegex.test(phone);
};

/**
 * Paginate array
 * @param {Array} array 
 * @param {number} page 
 * @param {number} limit 
 * @returns {Object}
 */
exports.paginate = (array, page, limit) => {
    const offset = (page - 1) * limit;
    const paginatedItems = array.slice(offset, offset + limit);
    const totalPages = Math.ceil(array.length / limit);
    
    return {
        data: paginatedItems,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: array.length,
            limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
};

/**
 * Generate unique filename with timestamp
 * @param {string} originalName 
 * @returns {string}
 */
exports.generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${random}.${extension}`;
};

/**
 * Convert object to query string
 * @param {Object} obj 
 * @returns {string}
 */
exports.objectToQueryString = (obj) => {
    return Object.keys(obj)
        .filter(key => obj[key] !== undefined && obj[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
};

/**
 * Deep clone object
 * @param {Object} obj 
 * @returns {Object}
 */
exports.deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if string is empty or whitespace
 * @param {string} str 
 * @returns {boolean}
 */
exports.isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

/**
 * Capitalize first letter of each word
 * @param {string} str 
 * @returns {string}
 */
exports.titleCase = (str) => {
    return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Format date for display
 * @param {Date|string} date 
 * @param {string} format 
 * @returns {string}
 */
exports.formatDate = (date, format = 'MM/DD/YYYY') => {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }
    
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        default:
            return d.toLocaleDateString();
    }
};

/**
 * Get time ago string
 * @param {Date|string} date 
 * @returns {string}
 */
exports.timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};