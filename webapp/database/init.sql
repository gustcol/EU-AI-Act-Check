-- EU AI Act Compliance Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en',
    role VARCHAR(50) DEFAULT 'assessor',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- AI Systems table
CREATE TABLE IF NOT EXISTS ai_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    intended_purpose TEXT NOT NULL,
    deployment_context TEXT,
    ai_techniques JSONB,
    risk_level VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    preliminary_classification VARCHAR(50) NOT NULL,
    final_classification VARCHAR(50),
    justification TEXT,
    responses JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Checklist Items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    phase VARCHAR(255) NOT NULL,
    item_text TEXT NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    completed_by UUID REFERENCES users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    evidence_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password Reset Tokens table
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_systems_user_id ON ai_systems(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_systems_status ON ai_systems(status);
CREATE INDEX IF NOT EXISTS idx_ai_systems_risk_level ON ai_systems(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_system_id ON risk_assessments(system_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_status ON risk_assessments(status);
CREATE INDEX IF NOT EXISTS idx_checklist_items_system_id ON checklist_items(system_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_phase ON checklist_items(phase);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_systems_updated_at ON ai_systems;
CREATE TRIGGER update_ai_systems_updated_at
    BEFORE UPDATE ON ai_systems
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_risk_assessments_updated_at ON risk_assessments;
CREATE TRIGGER update_risk_assessments_updated_at
    BEFORE UPDATE ON risk_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION)
INSERT INTO users (id, email, password_hash, name, role, language)
VALUES (
    uuid_generate_v4(),
    'admin@euaiact.local',
    '$2a$12$0zbLd2SoWIbkok2tr34S9.ZrHu.Bf2C/AoW9FE8x9AO14hTMSRvXG', -- admin123
    'System Administrator',
    'admin',
    'en'
) ON CONFLICT (email) DO NOTHING;

-- Insert test user (password: TestPassword123 - FOR TESTING ONLY)
INSERT INTO users (id, email, password_hash, name, role, organization, language)
VALUES (
    uuid_generate_v4(),
    'test@example.com',
    '$2a$12$A4OmodHsvo11Sv9cxOHTFOHKK.oAsecXH4XErjH99V.Xk3SFikspm', -- TestPassword123
    'Test User',
    'admin',
    'Test Organization',
    'en'
) ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO euaiact_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO euaiact_user;
