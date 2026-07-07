/*
================================================================================
AuthorOS — User security soft delete column (021)
Depends on: 020_enterprise_foundation
================================================================================
*/

ALTER TABLE user_security
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN user_security.deleted_at IS 'Soft delete timestamp; mirrors profiles.deleted_at for access control metadata';

CREATE INDEX IF NOT EXISTS idx_user_security_active ON user_security(user_id) WHERE deleted_at IS NULL;
