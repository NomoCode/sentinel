
CREATE TABLE IF NOT EXISTS authorized (
    id SERIAL, --> Case ID For the authorization, will be used for audit logs
    discord_id TEXT, --> The Discord ID for the authorized user since we use this stuff for Discord
    moderator_id TEXT, --> The game attached moderator id, which might be null
    authorized_by_id TEXT, --> The ID of the person who authorized this user
    security_level SMALLINT, --> The security level of the person, level 1 is moderator, level 2 is advisor, level 3 is manager
    authorized_at TIMESTAMP --> The time this person was authorized
);
