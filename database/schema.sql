-- ============================================================
-- SCHEMA: Weaponized AI E-Learning Platform
-- PostgreSQL 14+
-- ============================================================
-- Drop existing tables (safe re-run)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS content_blocks CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS users CASCADE;
-- ─── SECTIONS ────────────────────────────────────────────────
CREATE TABLE sections (
    id           SERIAL PRIMARY KEY,
    judul_bagian VARCHAR(255) NOT NULL,
    urutan       INTEGER NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT sections_urutan_unique UNIQUE (urutan)
);
-- ─── CONTENT BLOCKS ──────────────────────────────────────────
CREATE TABLE content_blocks (
    id            SERIAL PRIMARY KEY,
    section_id    INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    judul_sub     VARCHAR(255) NOT NULL,
    konten        TEXT NOT NULL,
    urutan        INTEGER NOT NULL,
    search_vector TSVECTOR,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT content_blocks_section_urutan_unique UNIQUE (section_id, urutan)
);
-- GIN index for fast full-text search
CREATE INDEX idx_content_blocks_search ON content_blocks USING GIN(search_vector);
CREATE INDEX idx_content_blocks_section_id ON content_blocks(section_id);
-- Function to keep search_vector up to date
CREATE OR REPLACE FUNCTION update_content_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector(
        'english',
        COALESCE(NEW.judul_sub, '') || ' ' || COALESCE(NEW.konten, '')
    );
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger: auto-update search_vector on INSERT or UPDATE
CREATE TRIGGER trg_content_search_vector
BEFORE INSERT OR UPDATE ON content_blocks
FOR EACH ROW EXECUTE FUNCTION update_content_search_vector();
-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    nama       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,  -- bcrypt hash
    role       VARCHAR(20) NOT NULL DEFAULT 'pembelajar',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'pembelajar'))
);
CREATE INDEX idx_users_email ON users(email);
-- ─── CHAT SESSIONS ───────────────────────────────────────────
CREATE TABLE chat_sessions (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
-- ─── CHAT MESSAGES ───────────────────────────────────────────
CREATE TABLE chat_messages (
    id                     SERIAL PRIMARY KEY,
    session_id             INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    pesan                  TEXT NOT NULL,
    role                   VARCHAR(10) NOT NULL,
    referenced_content_ids JSONB DEFAULT '[]'::jsonb,
    timestamp              TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chat_messages_role_check CHECK (role IN ('user', 'ai'))
);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_referenced_ids ON chat_messages USING GIN(referenced_content_ids);
-- ─── COMMENTS ────────────────────────────────────────────────
COMMENT ON TABLE sections IS 'Top-level learning sections (5 main parts)';
COMMENT ON TABLE content_blocks IS 'Learning content blocks with FTS support';
COMMENT ON COLUMN content_blocks.search_vector IS 'Auto-generated tsvector from judul_sub + konten for PostgreSQL FTS';
COMMENT ON TABLE users IS 'Platform users: admin and pembelajar roles';
COMMENT ON TABLE chat_sessions IS 'Chat sessions, nullable user_id allows anonymous use';
COMMENT ON TABLE chat_messages IS 'Individual messages; referenced_content_ids stores IDs of retrieved context blocks';
