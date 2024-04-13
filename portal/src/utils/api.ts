
import axios from "axios";

export function getAPIUrl(): string | undefined {

    return process.env.NEXT_PUBLIC_API_URL;

}
