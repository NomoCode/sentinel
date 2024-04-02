
// Webserver dependencies
import express from "express";

// Router that is performed / allowed by express
const router: express.Router = new express.Router();

// GET Request for whenever you need to know the status of the moderation API
router.get('/', async (req: express.Request, res: express.Response) => {

    res.json({
        alive: true
    });

});

// Can have another "alternative" name for web purposes, which will be monitored by end to end protection
// Which will be detected automatically in the headers of the requests, all located in "config/config.yaml"
export = {
    router: router,
    alternative: "dashboard"
}
