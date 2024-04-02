
import { config } from "../.."
import { write_to_logs } from "./Logger";


/**
 * Get the supabase credentials based on dev or prod env
 * @returns supabase credentials
 */
export function getSupabaseCredentials() {

    const arg: string = process.argv[2];
    let creds: any = {};

    switch(arg) {

        case "dev":
            creds = config.supabase[arg];
            break;
        case "prod":
            creds = config.supabase[arg];
            break;
    }

    return creds;

}
