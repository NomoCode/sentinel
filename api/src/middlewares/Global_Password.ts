
// Webserver dependencies
import express from "express";

// Configuration dependencies and helper functions
import { config } from "..";

/**
 * See if the requests have a global password or if the global password header is enabled
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 */
export default async function Global_Password(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

    // Check to see if the global password configuration is set
    if (!config.security.password.enabled) return next();

    // Need to see if this is going to collide with the end to end authentication

    // Get the array of header key/values
    const headers = req.headers;

    // Check to see if the header configuration is defined in the configuration
    if (!config.security.password.header) return res.json({
        error: true,
        message: `No security header set in the configuration file, disable password security if this is not needed.`
    });

    const needed_header: string = config.security.password.header;

    // Check to see if the needed header is in the headers
    if (!headers[needed_header]) return res.json({
        error: true,
        message: `Missing security header: ${needed_header}, containing the authorization key.`
    });

    // Check to see if the header matches the one defined in the configuration file
    const needed_header_value: string = headers[needed_header];

    if (needed_header_value !== config.security.password.string) return res.json({
        error: true,
        message: `Authorization key header does not match the authorization key defined in the config file.`
    })

    next();

}
