
import express from "express";
import * as fs from "fs";
import { config } from "../../index";
import { write_to_logs } from "../cache/Logger";

/**
 * Loads static exports from the "routes" folder
 * @param app express.Application
 */

export function RouteLoader(app: express.Application): void {

    fs.readdir("./dist/routes", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(`[ROUTE INIT] ${err}`);

        filenames.forEach(async (filename: string) => {
            
            if (!filename.endsWith(".js")) return;
            const filename_without_suffix = filename.split(".js")[0];
            const route_string: string = `/api/${filename_without_suffix}`;

            try {
                const default_export: any = await (await import(`../../routes/${filename}`)).default;

                app.use(route_string, default_export.router);

                // If it can have an alternate route name, so if there is a website version of the API With extra protection
                if (default_export.alternative) {

                    // Create the route name
                    const alternate_route_name: string = `/api/${default_export.alternative}/${filename_without_suffix}`;

                    // Create the middleware for this route
                    app.use(alternate_route_name, default_export.router);
                    write_to_logs('service', `${route_string} has been loaded. (ALT: /${alternate_route_name})`, true);
                
                } else {

                    write_to_logs('service', `${route_string} has been loaded.`, true);
                
                }
            } catch(e) {
                write_to_logs('errors', `${route_string} has failed: \n ${e}`, true)
            }

        });
    })

}
