
// Communicate with the api
import axios from "axios";
import { getAPIUrl } from "./api";

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

export async function getValidAuthorizedUser(discord_id: string, uuid: string): Promise<AuthorizedRecord> {

    // Request the api
    const { data } = await axios.get(
        `${getAPIUrl()}/api/dashboard/authorized/valid/${discord_id}`,
        {
            headers: {
                "Authorization": uuid
            }
        }
    );

    return data;

}
