
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Insight = {
    total: number,
    totalChartData: any,
    lastDay: number,
    lastDayChartData: any,
    lastWeek: number,
    lastWeekChartData: any,
    lastMonth: number,
    lastMonthChartData: any
}

type InsightState = {

    warns: Insight,
    bans: Insight,
    tempbans: Insight

}

type InitialState = {
    value: InsightState
}

const initialState: InitialState = {

    value: {
        warns: {
            total: 0,
            totalChartData: {},
            lastDay: 0,
            lastDayChartData: {},
            lastWeek: 0,
            lastWeekChartData: {},
            lastMonth: 0,
            lastMonthChartData: {}
        },
        bans: {
            total: 0,
            totalChartData: {},
            lastDay: 0,
            lastDayChartData: {},
            lastWeek: 0,
            lastWeekChartData: {},
            lastMonth: 0,
            lastMonthChartData: {}
        },
        tempbans: {
            total: 0,
            totalChartData: {},
            lastDay: 0,
            lastDayChartData: {},
            lastWeek: 0,
            lastWeekChartData: {},
            lastMonth: 0,
            lastMonthChartData: {}
        }
    }

}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setInsights: (state: any, action: PayloadAction<object | any>) => {
            return {
                value: {
                   warns: action.payload['warns'],
                   bans: action.payload['bans'],
                   tempbans: action.payload['tempbans']
                }
            }
        }
    }
})

export const {setInsights } = auth.actions;
export default auth.reducer;