
// Web server dependencies
import express from "express";

import { PunishmentRecord } from "../utils/database/Punishments";
import * as Punishments from "../utils/database/Punishments";
import { postgres, redis } from "..";
import { write_to_logs } from "../utils/cache/Logger";

const router: express.Router = new express.Router();

/**
 * See if this ip address is banned / tempbanned
 */
router.get("/isBanned/:ip_address", async (req: express.Request, res: express.Response) => {

    // Get the ip address from the parameters and hash it so we can compare
    const ip_address: string = Punishments.hashIpAddress(req.params.ip_address);

    // Get the hashed IP address validation 
    const isBanned: boolean = await Punishments.isBanned(ip_address);

    return res.json({
        banned: isBanned
    });

})

/**
 * Get the insights of the latest punishments
 */
router.get("/insights", async (req: express.Request, res: express.Response) => {

    // Get the ban punishments from last day, last week, and last month
    const totalBans: number = (await Punishments.getPunishmentsFromType("ban")).length;
    const totalBanChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("ban");

    const banLastDayInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("ban", "1 day");
    const banLastDayChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("ban", "1 day");

    const banLastWeekInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("ban", "7 days");
    const banLastWeekChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("ban", "7 days");

    const banLastMonthInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("ban", "30 days");
    const banLastMonthChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("ban", "30 days");

    // Get warnings
    const totalWarns: number = (await Punishments.getPunishmentsFromType("warn")).length;
    const totalWarnChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("warn");

    const warnLastDayInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("warn", "1 day");
    const warnLastDayChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("warn", "1 day");

    const warnLastWeekInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("warn", "7 days");
    const warnLastWeekChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("warn", "7 days");

    const warnLastMonthInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("warn", "30 days");
    const warnLastMonthChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("warn", "30 days");

    // Get tempbans
    const totalTempbans: number = (await Punishments.getPunishmentsFromType("tempban")).length;
    const totalTempbanChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("tempban");

    const tempbanLastDayInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("tempban", "1 day");
    const tempbanLastDayChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("tempban", "1 day");

    const tempbanLastWeekInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("tempban", "7 days");
    const tempbanLastWeekChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("tempban", "7 days");

    const tempbanLastMonthInsights: Array<PunishmentRecord> = await Punishments.getPunishmentsFromElapsedDuration("tempban", "30 days");
    const tempbanLastMonthChartData: any = await Punishments.getChartDetailsFromElapsedDurationForPunishmentType("tempban", "30 days");


    return res.json({
        bans: {
            total: totalBans,
            totalChartData: totalBanChartData,
            lastDay: banLastDayInsights.length,
            lastDayChartData: banLastDayChartData,
            lastWeek: banLastWeekInsights.length,
            lastWeekChartData: banLastWeekChartData,
            lastMonth: banLastMonthInsights.length,
            lastMonthChartData: banLastMonthChartData
        },
        warns: {
            total: totalWarns,
            totalChartData: totalWarnChartData,
            lastDay: warnLastDayInsights.length,
            lastDayChartData: warnLastDayChartData,
            lastWeek: warnLastWeekInsights.length,
            lastWeekChartData: warnLastWeekChartData,
            lastMonth: warnLastMonthInsights.length,
            lastMonthChartData: warnLastMonthChartData
        },
        tempbans: {
            total: totalTempbans,
            totalChartData: totalTempbanChartData,
            lastDay: tempbanLastDayInsights.length,
            lastDayChartData: tempbanLastDayChartData,
            lastWeek: tempbanLastWeekInsights.length,
            lastWeekChartData: tempbanLastWeekChartData,
            lastMonth: tempbanLastMonthInsights.length,
            lastMonthChartData: tempbanLastMonthChartData
        }
    })

});

/**
 * Get all the punishments through the API, we will add pagination to it as well
 */
router.get("/", async (req: express.Request, res: express.Response) => {

    // Get all the punishment records from the database
    const records: PunishmentRecord[] = await Punishments.getAllPunishmentRecords();

    return res.json(records);

});

/**
 * Filter through all of the punishments with query requirements they have defined
 */
router.post("/filter", async (req: express.Request, res: express.Response) => {

    // Get the body of the request
    const filters: PunishmentRecord = req.body;

    // Form the parent query
    let parentQuery: string = `
        SELECT * FROM punishments WHERE active=true
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
    const rows: Array<PunishmentRecord> = (await postgres.query(parentQuery, [...parentParams])).rows;

    return res.json(rows);

})

/**
 * Create a punishment record in the database
 */
router.post("/", async (req: express.Request, res: express.Response) => {

    // Create the body instance to get all the data
    const body: PunishmentRecord = req.body;

    // We need to hash the ip address on our end
    if (body.conn_ip_address) body.conn_ip_address = Punishments.hashIpAddress(body.conn_ip_address);

    // Create the record
    const recordId: number = await Punishments.createPunishmentRecord(body);

    // Send the error message if the recordId is 0
    if (recordId === 0) {
        return res.json({
            error: true,
            message: `Unexpected error, read 0 as the record id, please try again.`
        })
    }

    // Expire it after x time using moment
    // We need to check if there's an actual duration specified
    if (body.duration) {

        // Convert the duration text to seconds
        const seconds: number = Punishments.getTextTimeToSeconds(body.duration);

        // We can't expire after 0 seconds, Redis gives an error message
        if (seconds === 0) { return res.json({
            error: true,
            message: `Duration set was converted to 0 seconds, please make sure the query is correct.`
        })};
        
        // Create the redis expire key
        await redis.set(
            `expired-punishment:${recordId}`,
            JSON.stringify(body),
            "EX",
            seconds
        );

        write_to_logs("actions", `Expiring punishment record ${recordId} after ${seconds} seconds (${body.duration}).`);

    }

    return res.json({
        recordId
    });

});

/**
 * Delete a certain record id from the punishment list
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
