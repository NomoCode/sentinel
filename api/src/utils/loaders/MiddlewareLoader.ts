
import express from "express";
import * as fs from "fs";
import { config } from "../../index";
import { write_to_logs } from "../cache/Logger";

/**
 * Loads static exports from the "middlewares" folder
 * @param app express.Application
 */

export function MiddlewareLoader(app: express.Application): void {

    fs.readdir("./dist/middlewares", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(`[ROUTE INIT] ${err}`);

        filenames.forEach(async (filename: string) => {
            
            if (!filename.endsWith(".js")) return;
            const filename_without_suffix = filename.split(".js")[0];

            try {
                const default_export: any = await (await import(`../../middlewares/${filename}`)).default;

                app.use(default_export);

                write_to_logs('service', `${filename_without_suffix} middleware has been loaded successfully.`, true);
            } catch(e) {
                write_to_logs('errors', `${filename_without_suffix} middleware load has failed: \n ${e}`, true)
            }

        });
    })

}
