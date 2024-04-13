
// Web server dependencies
import express from "express";

// Database helpers
import * as Authorized from "../utils/database/Authorized";

// Create the router instance
const router: express.Router = new express.Router();

/**
 * Get all the authorized users in the database, it may be a lot but it's most likely not. No need to paginate.
 */
router.get("/", async (req: express.Response, res: express.Response) => {

    // Get all the authorized users 
    const authorized_users: Authorized.AuthorizedRecord[] = await Authorized.getAuthorizedUsers();

    return res.json(authorized_users);

});

// See if a user is authorized in the database
router.get("/valid/:discord_id", async (req: express.Request, res: express.Response) => {

    // Get the discord id from the params
    const discord_id: string = req.params.discord_id;

    // Get the authorized user from the database
    const user: Authorized.AuthorizedRecord = await Authorized.getAuthorizedUserByDiscordId(discord_id);

    // If they're not found then we just return authorized false
    if (!user) return res.json({
        authorized: false
    });

    // Return the authorized data as well
    return res.json({
        authorized: true,
        user: user
    });

});

export = {
    router: router,
    alternative: "dashboard"
}