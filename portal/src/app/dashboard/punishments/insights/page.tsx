
"use client";

import axios from "axios";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import "../../../../styles/dashboard/layouts/Layout.css";
import '../../../../styles/dashboard/container/StatCards.css';
import "../../../../styles/dashboard/container/GraphContainer.css";

import { getAPIUrl } from "@/utils/api";
import { setInsights } from "@/redux/features/insightsSlice";

import StatCard from "@/components/dashboard/insights/StatCard";
import LineGraph from "@/components/dashboard/insights/LineGraph";

export default function BansHome() {

    // Redux state management
    const dispatch = useDispatch();

    const auth_data = useAppSelector((state) => { return state.authReducer.value });
    const insight_data = useAppSelector((state) => { return state.insightsReducer.value });

    // Set all the insight data from the api
    const getInsightDataFromAPI = async () => {

        const { data } = await axios.get(`${getAPIUrl()}/api/dashboard/punishments/insights`, {
            headers: {
                "Authorization": auth_data.data.user.id
            }
        });

        if (data.error) return console.log(`Error when getting insights`, data.error);

        // Set the insight data
        dispatch(setInsights(data));
    }

    useEffect(() => {
        
        // Just incase the redux state is set but the data is undefined / null / not there
        if (!auth_data.data) return;
        if (!auth_data.data) return;
        if (!auth_data.data.user) return;

        // Get the insights from the api
        getInsightDataFromAPI();

        console.log(Object.keys(insight_data.tempbans.lastDayChartData))

    }, [auth_data])


  return (
    <>

        <div className="stat-card-container">

            <StatCard stat={ "Warns" } value={ insight_data.warns } />
            <StatCard stat={ "Bans" } value={ insight_data.bans } />
            <StatCard stat={ "Tempbans" } value={ insight_data.tempbans } />


        </div>

        <div className="graph-container">

            <LineGraph
                title="Warn Analytics"
                canvasId="warns-data"
                value={ insight_data.warns }
            />
            
            <LineGraph
                title="Ban Analytics"
                canvasId="bans-data"
                value={ insight_data.bans }
            />

            <LineGraph
                title="Tempban Analytics"
                canvasId="tempbans-data"
                value={ insight_data.tempbans }
            />
        </div>

    </>
  )
}
