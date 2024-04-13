
import crypto from "crypto";
import * as moment from "moment";

import { postgres, punishmentRoadmap, redis } from "../..";
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
    active: boolean,
    updated_at: Date,
    created_at: Date

}

/**
 * Convert a string of time to certain seconds
 * @param text string - the text of the time 
 * @returns seconds
 */
export function getTextTimeToSeconds(text) {
    let totalSeconds = 0;
    const timeRegex = /(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|days?|d|months?|mo)/gi;
    let match;

    while ((match = timeRegex.exec(text)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        switch (unit) {
            case 'day':
            case 'd':
            case 'days':
                totalSeconds += moment.duration(value, 'days').asSeconds();
                break;
            case 'hour':
            case 'h':
            case 'hours':
                totalSeconds += moment.duration(value, 'hours').asSeconds();
                break;
            case 'minute':
            case 'm':
            case 'minutes':
                totalSeconds += moment.duration(value, 'minutes').asSeconds();
                break;
            case 'second':
            case 'seconds':
            case 'sec':
            case 's':
            case 'secs':
                totalSeconds += value;
                break;
            default:
                break;
        }
    }

    return totalSeconds;
}

/**
 * 
 * @param punishment_type string
 * @param elapsed_duration string
 * @returns 
 */
export async function getChartDetailsFromElapsedDurationForPunishmentType(punishment_type: string, elapsed_duration?: string): Promise<any> {


    // Query the database
    let results: any;

    if (elapsed_duration) {
        const query = `
        SELECT 
            DATE(created_at) AS day,
            COUNT(*) AS punishment_count
        FROM 
            punishments
        WHERE 
            punishment_type = $1 AND
            created_at >= NOW() - $2::interval
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
        `;
        
        results = await postgres.query(query, [punishment_type, elapsed_duration]);
    } else {
        const query = `
        SELECT 
            DATE(created_at) AS day,
            COUNT(*) AS punishment_count
        FROM 
            punishments
        WHERE 
            punishment_type = $1
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            DATE(created_at);
        `;
        
        results = await postgres.query(query, [punishment_type]);
        // console.log(results);
    }
    
    const chartData = {};
    
    results.rows.forEach(row => {
        const day = row.day.toISOString().split('T')[0]; // Extracting date without time
        chartData[day] = row.punishment_count;
    });

    return chartData;

}

/**
 * Get the amount of punishments that have been added to record since a certain duration
 * @param punishment_type string
 * @param elapsed_duration string
 * @returns 
 */
export async function getPunishmentsFromElapsedDuration(punishment_type: string, elapsed_duration: string): Promise<Array<PunishmentRecord>> {

    // Query the postgresql database
    const query: string = `
        SELECT id FROM punishments WHERE punishment_type=$1 AND created_at >= NOW() - $2::interval
    `;
    const rows: Array<PunishmentRecord> = (await postgres.query(query, [punishment_type, elapsed_duration])).rows;

    return rows;

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
        SELECT * FROM punishments WHERE active=$1 ORDER BY id DESC;
    `;
    const records: Array<PunishmentRecord> = (await postgres.query(query, [true])).rows;

    return records;

}

/**
 * Get all the punishments that belogn to a certain type
 * @param punishment_type string
 * @returns PunishmentRecord[]
 */
export async function getPunishmentsFromType(punishment_type: string, ip_address?: string, active?: boolean): Promise<PunishmentRecord[]> {

    let records: Array<PunishmentRecord> = [];

    // query the database
    if (!ip_address && !active) {
        const query: string = `
            SELECT * FROM punishments WHERE punishment_type=$1
        `;
        records = (await postgres.query(query, [punishment_type])).rows;
    } else {
        const query: string = `
            SELECT * FROM punishments WHERE punishment_type=$1 AND conn_ip_address=$2 AND active=$3
        `;

        records = (await postgres.query(query, [punishment_type, ip_address, true])).rows;
    }

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
            active,
            updated_at,
            created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
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
        true,
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

    // We need to go through the offense roadmap
    const matchedPunishmentType: any = punishmentRoadmap.punishments.filter((roadmap: any) => { return roadmap.type.toLowerCase() === record.punishment_type.toLowerCase() });
    
    // No punishment match found
    if (matchedPunishmentType.length === 0) return lastRecord.id;

    // No roadmap for this punishment
    if (!matchedPunishmentType[0].roadmap) return lastRecord.id

    const roadmap: any = matchedPunishmentType[0].roadmap;
    const punishmentRecords: Array<PunishmentRecord> = await getPunishmentsFromType(record.punishment_type, record.conn_ip_address, true);

    // Get the offense actions that match the amount of punishments they have
    const matchedOffensePunishments: any = roadmap.filter((offense: any) => { return offense.offense === punishmentRecords.length });

    // No offenses matched, we just return the recordId
    if (matchedOffensePunishments.length === 0) return lastRecord.id;

    // We apply the punishment
    await createPunishmentRecord({
        game_username: record.game_username,
        game_account_id: record.game_account_id,
        game_moderator_id: record.game_moderator_id,
        conn_ip_address: record.conn_ip_address,
        conn_unique_cookie: record.conn_unique_cookie,
        punishment_type: matchedOffensePunishments[0]['action'],
        metadata: {},
        duration: matchedOffensePunishments[0]['duration'],
        region: record.region,
        reason: "Automatic punishment for reaching offense threshold.",
        active: true,
        updated_at: null,
        created_at: new Date()
    } as any)

    // If there is a duration we need to create the timer for it
    if (matchedOffensePunishments[0]['duration']) {        
        const seconds: number = getTextTimeToSeconds(matchedOffensePunishments[0]['duration']);

        // We can't expire after 0 seconds, Redis gives an error message
        if (seconds === 0) { write_to_logs("errors", `Duration set was converted to 0 seconds, please make sure the query is correct.`); return lastRecord.id };
        
        const offenseThresholdRecordId: any = await getLastRecordForIpAddress(record.conn_ip_address);

        // Create the redis expire key
        await redis.set(
            `expired-punishment:${offenseThresholdRecordId.id}`,
            JSON.stringify(0),
            "EX",
            seconds
        );

        write_to_logs("actions", `Expiring punishment record ${offenseThresholdRecordId.id} after ${seconds} seconds (${matchedOffensePunishments[0]['duration']}).`);
    }

    return lastRecord.id;

}

export async function deletePunishmentFromRecordId(record_id: string): Promise<void> {

    // Query the postgresql database
    const query: string = `
        UPDATE punishments SET active=$2 WHERE id=$1
    `;
    await postgres.query(query, [record_id, false]);

}
