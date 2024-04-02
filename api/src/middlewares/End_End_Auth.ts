
// Webserver dependencies
import express from "express";

// Configuration dependencies and helper functions
import { config } from "..";

/**
 * See if the end_end_auth is set
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 */
export default async function End_End_Auth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

    // Check to see if the end_end_auth settings are enabled
    if (!config.security.end_end_auth.enabled) return next();

    // Get the headers objects
    const headers = req.headers;
    const global_password_header_value: string = headers[config.security.password.header];

    // See if the global password is provided for this, if it is then we go to the next
    if (global_password_header_value) return next();

    // Get the path of the request
    const originalUrl: string = req.originalUrl;

    // Go through each whitelisted endpoint to see if it is in the url
    const foundEndpoints: Array<string> = config.security.end_end_auth.endpoints.some(str => originalUrl.includes(str));

    if (!foundEndpoints) return next(); // No endpoints found, meaning this is not a protected path

    // Get the authorization header provided in configuration
    const end_end_header: string = config.security.end_end_auth.header;

    if (!end_end_header) return res.json({
        error: true,
        message: `Missing end to end auth header, disable end to end auth if this isn't needed.`
    })

    // TODO: Supabase validation 

    // Get the value of the end to end auth header
    // const end_end_header_value: string = headers[end_end_header];

    // See if they're a valid user

    next();

}
