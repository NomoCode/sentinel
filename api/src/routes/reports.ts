
// Web server dependencies
import express from "express";

import { PunishmentRecord } from "../utils/database/Punishments";
import * as Punishments from "../utils/database/Punishments";
import { postgres, redis } from "..";
import { write_to_logs } from "../utils/cache/Logger";
import { ReportRecord } from "../utils/database/Reports";

const router: express.Router = new express.Router();

/**
 * Get all the punishments through the API, we will add pagination to it as well
 */
router.get("/", async (req: express.Request, res: express.Response) => {

    // Get all the punishment records from the database
    // const records: ReportRecord[] = await Punishments.getAllPunishmentRecords();

    // return res.json(records);

});

/**
 * Filter through all of the reports with query requirements they have defined
 */
router.post("/filter", async (req: express.Request, res: express.Response) => {

    // Get the body of the request
    const filters: PunishmentRecord = req.body;

    // Form the parent query
    let parentQuery: string = `
        SELECT * FROM reports WHERE 1=1
    `
    let parentParams: Array<any> = [];

    // Go through each key
    const filterKeys: Array<string> = Object.keys(filters);

    for (let i: number = 0; i < filterKeys.length; i++) {

        // Get the filter key and value
        const key: string = filterKeys[i];
        const value: any = filters[key]

        parentQuery += ` AND ${key} ILIKE '%' || $${i + 1} || '%'`;
        parentParams.push(value);

    }

    // Run the formatted query
    const rows: Array<ReportRecord> = (await postgres.query(parentQuery, [...parentParams])).rows;

    return res.json(rows);

})

/**
 * Create a punishment record in the database
 */
router.post("/", async (req: express.Request, res: express.Response) => {

    // Create the body instance to get all the data
    const body: ReportRecord = req.body;

    // We need to hash the ip address on our end
    if (body.suspect_ip) body.suspect_ip = Punishments.hashIpAddress(body.suspect_ip);

    // Create the record
    // const recordId: number = await Punishments.createPunishmentRecord(body);

    // // Send the error message if the recordId is 0
    // if (recordId === 0) {
    //     return res.json({
    //         error: true,
    //         message: `Unexpected error, read 0 as the record id, please try again.`
    //     })
    // }

    // return res.json({
    //     recordId
    // });

});

/**
 * Delete a certain record id from the report list
 */
router.delete("/:record_id", async (req: express.Request, res: express.Response) => {

    // Get the record id from the parameters
    const record_id: string = req.params.record_id;

    // Delete the record id from the database
    await Punishments.deletePunishmentFromRecordId(record_id);

    res.json({
        success: true
    })

});

export = {
    router: router,
    alternative: "dashboard"
}
