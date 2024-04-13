
"use client";

import { useState } from "react";

import { Insight } from "@/redux/features/insightsSlice";

export type StatComparison = {
    notation: string, // up, down, same
    percent: string,
    elapsedDuration: string // last week, last monht, yesterday: "Since last week
}

export default function StatCard({ stat, value, comparison }: { stat: string, value: Insight, comparison?: StatComparison }) {

    // Active action
    const [activeAction, setActiveAction] = useState('1d');

    // Get the current value based off the activeAction
    const getCurrentStatValue = () => {

        let currentValue: number = 0;

        switch(activeAction) {
            case "total":
                currentValue = value.total;
                break;
            case "1d":
                currentValue = value.lastDay;
                break;
            case "7d":
                currentValue = value.lastWeek;
                break;
            case "30d":
                currentValue = value.lastMonth;
                break;
        }

        return currentValue;

    }
    
    return (
        <>
        
            <div className="stat-card">

                <div className="header">
                    <p>{ stat }</p>

                    <div className="actions">
                        <p className={ activeAction == "total" ? "active": "" } onClick={() => { setActiveAction('total'); }}>all</p>
                        <p className={ activeAction == "1d" ? "active": "" } onClick={() => { setActiveAction('1d'); }}>1d</p>
                        <p className={ activeAction == "7d" ? "active": "" } onClick={() => { setActiveAction('7d'); }}>7d</p>
                        <p className={ activeAction == "30d" ? "active": "" } onClick={() => { setActiveAction('30d'); }}>30d</p>
                    </div>
                </div>

                <div className="content">
                    <p className="value">{ getCurrentStatValue() }</p>
                    { comparison ? 
                        <p className="notation">{ comparison.notation } { comparison.percent } since { comparison.elapsedDuration }</p>
                        : <></>
                    }
                </div>
                
            </div>
        
        </>
    )

}
