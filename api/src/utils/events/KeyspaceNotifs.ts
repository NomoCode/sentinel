
import axios from "axios";
import Redis from "ioredis";
import { getDatabaseCredentials } from "../loaders/DatabaseLoader";

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
            
            const identifier: string = msg.split(":")[0];

            switch(identifier) {
                default:
                    break;
            }

        })
    });

}
