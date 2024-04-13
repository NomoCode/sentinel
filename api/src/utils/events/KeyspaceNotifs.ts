
import axios from "axios";
import Redis from "ioredis";


import { getDatabaseCredentials } from "../loaders/DatabaseLoader";
import * as Punishments from "../database/Punishments";
import { write_to_logs } from "../cache/Logger";


type Provider = {

    name: string,
    expire_token: number,
    store_unique_by_id: boolean

}

/**
 * Look for any events that have a key space notation for redis
 * @param e - string 
 * @param r - string
 */
export function KeyspaceNotif(e: any, r: any): void {

    const sub_client: Redis = new Redis(getDatabaseCredentials("redis"));
    const expired_key: string = `__keyevent@0__:expired`;

    sub_client.subscribe(expired_key, () => {
        sub_client.on('message', async (channel: string, msg: string | any) => {
            
            const split_identifier: Array<string> = msg.split(":");
            const identifier: string = split_identifier[0];

            switch(identifier) {
                case "expired-punishment":

                    // Get the record id from the punishment list
                    const recordId: string = split_identifier[1];

                    // Delete the recordId from the database
                    await Punishments.deletePunishmentFromRecordId(recordId);

                    // Log it to the console
                    write_to_logs("actions", `Deleted expired punishment record ${recordId} from the database.`);

                    break;
                default:
                    break;
            }

        })
    });

}
