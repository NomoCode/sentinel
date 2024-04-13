import { config, postgres } from "../..";
import { write_to_logs } from "../cache/Logger";

export type AuthorizedRecord = {

    id: number,
    discord_id: string,
    moderator_id: string,
    authorized_by_id: string,
    security_level: number,
    authorized_at: Date

}

export type SecurityLevels = {
    level_1: 1,
    level_2: 2,
    level_3: 3
}

export async function loadAllAuthorizedUsersInConfig(): Promise<void> {
    // Create the specified authorized users in the config
    
    // Check to see if it is enabled
    if (!config.security.authorized_user.enabled) return write_to_logs("service", `Authorized user creation is disabled.`);

    // See if the metadata is specified
    if (!config.security.authorized_user.metadata) return write_to_logs("errors", `Authorized user creation is enabled but no metadata was specified`);

    // Get the metadata and see if the authorized user is already created
    const metadata: AuthorizedRecord = config.security.authorized_user.metadata;

    // Get the user
    const user: AuthorizedRecord = await getAuthorizedUserByDiscordId(metadata.discord_id);

    if (user) return write_to_logs("service", `Authorized user in security config has already been created, aborted creation.`);

    // Create the user since there isn't one already defined
    await createAuthorizedUser(metadata);
    
    write_to_logs(`actions`, `Created authorized user with a security level of ${metadata.security_level}: ${metadata.discord_id}`);
}

/**
 * Get all the authorized users in the database
 * @returns AuthorizedRecord[]
 */
export async function getAuthorizedUsers(): Promise<AuthorizedRecord[]> {

    // Query the postgresql database
    const query: string = `
        SELECT * FROM authorized;
    `;
    const rows: AuthorizedRecord[] = (await postgres.query(query)).rows;

    return rows;

}

/**
 * Get the authorized user by discord ID, giving access to the portal
 * @param discord_id string
 * @returns AuthorizedRecord || null
 */
export async function getAuthorizedUserByDiscordId(discord_id: string): Promise<AuthorizedRecord | null> {

    // Query the postgresql database
    const query: string = `
        SELECT * FROM authorized WHERE discord_id=$1
    `;
    const rows: AuthorizedRecord[] = (await postgres.query(query, [discord_id])).rows;

    // Check to see if there is a user in it
    if (rows.length == 0) return null

    return rows[0];
}

/**
 * Create the authorized user for the specified body
 * @param user AuthorizedRecord
 */
export async function createAuthorizedUser(user: AuthorizedRecord): Promise<void> {

    // Query the postgresql database
    const query: string = `
        INSERT INTO authorized (
            discord_id,
            moderator_id,
            authorized_by_id,
            security_level,
            authorized_at
        ) VALUES (
            $1, $2, $3, $4, $5
        )
    `;
    await postgres.query(query, [
        user.discord_id,
        user.moderator_id,
        user.authorized_by_id,
        user.security_level,
        new Date()
    ]);

}