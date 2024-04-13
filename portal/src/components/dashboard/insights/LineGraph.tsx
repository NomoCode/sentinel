
"use client";

import { useEffect } from "react";
import { useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export type LineGraphDataset = {
    data: Array<number | string>,
    label: string,
    borderColor?: string,
    backgroundColor?: string,
    fill?: boolean
}
export default function LineGraph({ canvasId, title, value }: { canvasId: string, title: string, value: any }) {

    // Active action
    const [activeAction, setActiveAction] = useState('1d');

    // Get the current value based off the activeAction
    const getCurrentStatValue = () => {

        let currentLabels: any = [];
        let currentValues: any = [];

        switch(activeAction) {
            case "total":
                currentLabels = Object.keys(value.totalChartData);
                currentValues = Object.values(value.totalChartData);
                break;
            case "1d":
                currentLabels = Object.keys(value.lastDayChartData);
                currentValues = Object.values(value.lastDayChartData);
                break;
            case "7d":
                currentLabels = Object.keys(value.lastWeekChartData);
                currentValues = Object.values(value.lastWeekChartData);
                break;
            case "30d":
                currentLabels = Object.keys(value.lastMonthChartData);
                currentValues = Object.values(value.lastMonthChartData);
                break;
        }

        return { labels: currentLabels, datasets: [{
            data: currentValues,
            label: title.split(" ")[0],
            borderColor: "#656565",
            backgroundColor: "#D7BD92"
        }] }

    }

    // Set the chart in here 
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
    };

    
    return (
        <div className="graph">

            <div className="header">
                <p>{ title }</p>


                <div className="actions">
                    <p className={ activeAction == "total" ? "active": "" } onClick={() => { setActiveAction('total'); }}>all</p>
                    <p className={ activeAction == "1d" ? "active": "" } onClick={() => { setActiveAction('1d'); }}>1d</p>
                    <p className={ activeAction == "7d" ? "active": "" } onClick={() => { setActiveAction('7d'); }}>7d</p>
                    <p className={ activeAction == "30d" ? "active": "" } onClick={() => { setActiveAction('30d'); }}>30d</p>
                </div>
            </div>

            <Line options={ options } data={ getCurrentStatValue() } />
        </div>
    )

}
