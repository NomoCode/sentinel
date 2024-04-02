
import crypto from "crypto";

import { postgres } from "../..";
import { write_to_logs } from "../cache/Logger";

export type PunishmentRecord = {

    id: number,
    game_username: string,
    game_account_id: string,
    game_moderator_id: string,
    conn_ip_address: string,
    conn_unique_cookie: string,
    punishment_type: string,
    metadata: object,
    duration: string,
    region: string,
    reason: string,
    updated_at: Date,
    created_at: Date

}

/**
 * Generates a SHA256 hash for an IP address.
 * @param ipAddress The IP address to hash.
 * @returns The SHA256 hash of the IP address.
 */
export function hashIpAddress(ipAddress: string): string {
    // Create a hash object using the SHA256 algorithm
    const hash = crypto.createHash('sha256');

    // Update the hash object with the IP address
    hash.update(ipAddress);

    // Generate the hexadecimal digest of the hash and return it
    return hash.digest('hex');
}

/**
 * Get all the punishment records
 * @returns PunishmentRecord[]
 */
export async function getAllPunishmentRecords(): Promise<PunishmentRecord[]> {

    // Query the postgresql database
    const query: string = `
        SELECT * FROM punishments
    `;
    const records: Array<PunishmentRecord> = (await postgres.query(query)).rows;

    return records;

}

/**
 * See if a user is currently banned
 * @param ip_address hashed ip address
 * @returns boolean
 */
export async function isBanned(ip_address: string): Promise<boolean> {

    // Query the postgresql database
    // Order descending so we can get their latest punishment
    const query: string = `
        SELECT id FROM punishments
        WHERE conn_ip_address = $1 AND punishment_type=$2
        ORDER BY created_at DESC;
    `;
    const rows: PunishmentRecord[] = (await postgres.query(query, [ip_address, "ban"])).rows;

    // If there is a current row then we just need to return true
    if (rows.length > 0) return true;

    return false;

}

/**
 * 
 * @param ip_address hashed string for ip address
 * @returns PunishmentRecord
 */
export async function getLastRecordForIpAddress(ip_address: string): Promise<PunishmentRecord> {

    // Query the postgresql database
    // Order descending so we can get their latest punishment
    const query: string = `
        SELECT id FROM punishments
        WHERE conn_ip_address = $1
        ORDER BY created_at DESC;
    `;
    const rows: PunishmentRecord[] = (await postgres.query(query, [ip_address])).rows;

    return rows[0];

}

/**
 * Create a punishment record in the database, it will return the punishment ID as the response object
 * @param record PunishmentRecord
 * @returns number - Punishment ID
 */
export async function createPunishmentRecord(record: PunishmentRecord): Promise<number> {

    // Query the postgresql database
    const query: string = `
    
        INSERT INTO punishments (
            game_username,
            game_account_id,
            game_moderator_id,
            conn_ip_address,
            conn_unique_cookie,
            punishment_type,
            metadata,
            duration,
            region,
            reason,
            updated_at,
            created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        );
    `
    await postgres.query(query, [
        record.game_username,
        record.game_account_id,
        record.game_moderator_id,
        record.conn_ip_address,
        record.conn_unique_cookie,
        record.punishment_type,
        record.metadata,
        record.duration,
        record.region,
        record.reason,
        null,
        new Date()
    ]);

    // Get the created query, just gotta query again
    const lastRecord: PunishmentRecord = await getLastRecordForIpAddress(record.conn_ip_address);

    // Meaning the record did not get created
    if (!lastRecord) { 
        write_to_logs("errors", `Punishment record was not created for ${record.conn_ip_address}`);
        return 0
    }

    return lastRecord.id;

}

export async function deletePunishmentFromRecordId(record_id: string): Promise<void> {

    // Query the postgresql database
    const query: string = `
        DELETE FROM punishments WHERE id=$1
    `;
    await postgres.query(query, [record_id]);

}
