
CREATE TABLE IF NOT EXISTS punishments (

    id SERIAL PRIMARY KEY,
    game_username TEXT, --> Game username is the username used in the game, for fetch purposes (not the most accurate depiction of a ban / punishment)
    game_account_id TEXT, --> A possible account id that is associated with this punishment, good for warnings / tempbans
    game_moderator_id TEXT, --> The moderator associated with this punishment, can be any type of identification suited for it
    conn_ip_address TEXT, --> The IP address associated with the client connection, this will be a hashed string automatically
    conn_unique_cookie TEXT, --> The Cookie that is cached on their client side, can be used for browser fingerprinting and better bans
    punishment_type TEXT, --> The type of punishment, for this example it would be warn, tempban, ban
    metadata JSONB, --> Other metadata that the developer would like to specify, ie client_id, inventory, etc
    duration TEXT,
    region TEXT,
    reason TEXT, --> The reason for the punishment, good for case support
    active BOOLEAN,
    updated_at TIMESTAMP, --> If someone edits this punishment, this will update to the timestamp of action
    created_at TIMESTAMP --> The timestamp when someone created this punishment

);

ALTER TABLE punishments
ADD COLUMN IF NOT EXISTS active BOOLEAN;
