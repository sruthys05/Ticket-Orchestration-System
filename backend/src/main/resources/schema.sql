-- ============================================
-- Ticket Management System - Database Schema
-- ============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'EMPLOYEE',
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    employee_email VARCHAR(100) NOT NULL,
    created_date DATETIME NOT NULL,
    updated_date DATETIME,
    resolution TEXT,
    assigned_to VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_category ON tickets(category);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_department ON tickets(department);
CREATE INDEX idx_tickets_created_date ON tickets(created_date DESC);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, role) 
VALUES ('admin', 'admin123', 'admin@company.com', 'System Administrator', 'ADMIN')
ON DUPLICATE KEY UPDATE username = username;

-- Insert sample employee user (password: employee123)
INSERT INTO users (username, password, email, full_name, role) 
VALUES ('john', 'employee123', 'john@company.com', 'John Smith', 'EMPLOYEE')
ON DUPLICATE KEY UPDATE username = username;

-- ============================================
-- Sample Tickets Data (Optional)
-- ============================================

-- Open tickets
INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, created_date, updated_date) 
VALUES 
(
    'Email server down',
    'Unable to send or receive emails since 9 AM. Outlook shows connection error.',
    'Software',
    'Critical',
    'Open',
    'IT',
    'John Smith',
    'john@company.com',
    DATE_SUB(NOW(), INTERVAL 3 HOUR),
    DATE_SUB(NOW(), INTERVAL 3 HOUR)
);

INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, created_date, updated_date) 
VALUES 
(
    'New laptop setup',
    'Need to configure new Dell laptop for new employee. Install VS Code, Docker, and corporate tools.',
    'Hardware',
    'Medium',
    'Open',
    'Engineering',
    'Mike Chen',
    'mike@company.com',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    DATE_SUB(NOW(), INTERVAL 1 DAY)
);

INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, created_date, updated_date) 
VALUES 
(
    'VPN connection issues',
    'Cannot connect to VPN from home office. Works fine on office network. Error: Connection timeout.',
    'Network',
    'High',
    'Open',
    'Finance',
    'Alice Johnson',
    'alice@company.com',
    DATE_SUB(NOW(), INTERVAL 5 HOUR),
    DATE_SUB(NOW(), INTERVAL 5 HOUR)
);

-- In Progress tickets
INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, assigned_to, created_date, updated_date) 
VALUES 
(
    'Printer not working',
    'Floor 3 printer showing error 0x610000. Paper jam cleared but still not working.',
    'Hardware',
    'Medium',
    'In Progress',
    'Operations',
    'David Lee',
    'david@company.com',
    'IT Support Team',
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    DATE_SUB(NOW(), INTERVAL 1 DAY)
);

INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, assigned_to, created_date, updated_date) 
VALUES 
(
    'Database access request',
    'Need read-only access to production database for quarterly reporting. Database: prod_db_01.',
    'Access',
    'High',
    'In Progress',
    'Analytics',
    'Emily Davis',
    'emily@company.com',
    'DBA Team',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    DATE_SUB(NOW(), INTERVAL 4 HOUR)
);

-- Resolved tickets
INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, assigned_to, resolution, created_date, updated_date) 
VALUES 
(
    'Slack integration broken',
    'GitHub notifications not posting to #dev channel. Was working yesterday.',
    'Software',
    'Low',
    'Resolved',
    'Engineering',
    'Sarah Wilson',
    'sarah@company.com',
    'DevOps Team',
    'Re-authenticated Slack-GitHub integration. Webhook URL was expired, regenerated and updated.',
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    DATE_SUB(NOW(), INTERVAL 1 DAY)
);

INSERT INTO tickets (title, description, category, priority, status, department, employee_name, employee_email, assigned_to, resolution, created_date, updated_date) 
VALUES 
(
    'Keyboard replacement',
    'Mechanical keyboard has faulty Enter key. Requesting replacement.',
    'Hardware',
    'Low',
    'Resolved',
    'HR',
    'Tom Brown',
    'tom@company.com',
    'IT Support Team',
    'Replaced with new Logitech keyboard. Old keyboard sent for RMA.',
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    DATE_SUB(NOW(), INTERVAL 2 DAY)
);

-- ============================================
-- End of Schema
-- ============================================