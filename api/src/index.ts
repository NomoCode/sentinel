
// Dependencies for running basic web server
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";

// Database dependencies, for global variables / constants
import Redis from "ioredis";
import * as pg from "pg";

// Helpers for loading 
import { ConfigLoader } from "./utils/loaders/ConfigLoader";
import * as DatabaseLoader from "./utils/loaders/DatabaseLoader"
import { RouteLoader } from "./utils/loaders/RouteLoader";
import { write_to_logs } from "./utils/cache/Logger";
import { MiddlewareLoader } from "./utils/loaders/MiddlewareLoader";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseCredentials } from "./utils/cache/Process";

// Web server instance
const app: express = express();

// Global variables / loaders
export const config: any = ConfigLoader("config.yaml");
export const redis: Redis = new Redis(DatabaseLoader.getDatabaseCredentials('redis'));
export const postgres: pg.Pool = new pg.Pool(DatabaseLoader.getDatabaseCredentials('postgresql'));
export const supabase: any = createClient((getSupabaseCredentials()).url, (getSupabaseCredentials()).secret_service, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
});

// Trust issue prevention
app.set("trust proxy");
app.use(cors(config.server.cors));

// Body limits for global routes
// TODO: Add config for certain routes to have increased bandwidth

app.use(express.json({ limit: config.server.bandwidth_limit }));
app.use(express.urlencoded({ limit: config.server.bandwidth_limit, extended: true }));
app.use(bodyparser.json({ limit: config.server.bandwidth_limit }));

// Load all the middlewares from the "./middlewares" directory
MiddlewareLoader(app);

// Load all routes dynamically from the "./routes" directory, hosting all exported express Router objects
RouteLoader(app);

// Determine the port and host based on enviornment type: prod, dev, stage
const port: number = config.server[process.argv[2]].port;
const host: string = config.server[process.argv[2]].host;

// Listen on those defined values
app.listen(port, host, async () => {

    // Run the postgresql database wrapper NODE PG
    await DatabaseLoader.postgres(postgres);

    // Run the redis database wrapper with IOREDIS
    await DatabaseLoader.redis(redis);

    // Notify that the server is up and running
    write_to_logs(
        "connections",
        `Running on ${host}:${port} server.`
    );

});
