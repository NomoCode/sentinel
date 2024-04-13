
import * as pg from "pg";
import * as fs from "fs";
import * as utils from "util";
import { config } from "../..";

import { KeyspaceNotif } from "../events/KeyspaceNotifs";
import { write_to_logs } from "../cache/Logger";
import { AuthorizedRecord, createAuthorizedUser, getAuthorizedUserByDiscordId } from "../database/Authorized";

/**
 * Create all new tables inside the "sql" directory
 * @param pool - pg.Pool
 */
export async function postgres(pool: pg.Pool): Promise<boolean> {

    fs.readdir("./sql", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(err);

        filenames.forEach(async (filename: string) => {
            fs.readFile(`./sql/${filename}`, async (err: any, content: any) => {
                if (err) return console.error(err);

                try {
                    await pool.query(content.toString());
                    // console.info(`[TABLE CREATED] ${filename}`)
                    write_to_logs('service', `${filename} database table has been created.`, true);
                } catch(e) {

                    write_to_logs('errors', `${filename} database table has an error: \n${e}`, true)

                }

            });
        });

    });

    return true;
    

}

/**
 * sets up keyspace event notifications, i.e expired keys
 * @param redis - redisClient
 */
export async function redis(redis): Promise<void> {

    redis.get = utils.promisify(redis.get).bind(redis);
    redis.set = utils.promisify(redis.set).bind(redis);
    redis.keys = utils.promisify(redis.keys).bind(redis);
    // redis.smembers = utils.promisify(redis.smembers);
    redis.send_command(
        'config',
        ['set', 'notify-keyspace-events', 'Ex'],
        KeyspaceNotif
    );

    // console.info("[REDIS] Created keyspace event notifications, and promisified methods.")
    write_to_logs('service', 'Redis connection has been established.', true);

}

/**
 * Get the database credentials for a database that is in the configuration.
 * redis
 * postgresql
 * @param database string
 * @returns string | object
 */
export function getDatabaseCredentials(database: string) {

    let credentials;
    const arg: string = process.argv[2];

    if (!config.database) return write_to_logs("errors", `Database doesn't exist for: ${database}`);
    if (!config.database[database]) return write_to_logs("errors", `Database doesn't exist for: ${database}`);

    switch (database) {

        case "postgresql":

            switch (arg) {

                case "prod":
                    credentials = config.database[database].prod;
                    break;
                case "dev":
                    credentials = config.database[database].dev;
                    break;

            }
            break;

        case "redis":

            switch (arg) {
                case "prod":
                    credentials = config.database[database].prod;
                    break;
                case "dev":
                    credentials = config.database[database].dev;
                    break;
            }
    }

    if (credentials.url) {
        credentials = {
            url: credentials.url
        };
    }

    return credentials;

}

