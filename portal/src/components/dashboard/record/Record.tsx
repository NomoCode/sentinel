
"use client";

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import "../../../styles/dashboard/popup/Confirmation.css";
import "../../../styles/dashboard/container/RecordContainer.css";

import { getAPIUrl } from "@/utils/api";
import { useAppSelector } from "@/redux/store";
import { PunishmentRecord, setPunishments } from "@/redux/features/punishmentSlice";

export default function Record({ title, subtitle, tag, enableEditView, metadata }: { title: string, subtitle: string, tag: string, enableEditView: Function, metadata: object | any }) {


    // Redux state management
    const dispatch = useDispatch();

    const auth_data = useAppSelector((state) => { return state.authReducer.value });
    const punishment_data = useAppSelector((state) => { return state.punishmentReducer.value })

    // Popup things
    const [popup, setPopup] = useState(false);
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    // Resolve the case, set the resolveCase popup
    const resolvePunishment = async () => {

        // Send the api request
        const { data } = await axios.delete(`${getAPIUrl()}/api/dashboard/punishments/${metadata['id']}`, {
            headers: {
                "Authorization": auth_data.data.user.id
            }
        });

        if (data.error) return console.log("Error", data.error);

        // Remove punishment from punishment records
        let newPunishmentRef: Array<PunishmentRecord> = [...punishment_data.data].filter((ogPunishment: any) => { 
            return ogPunishment.id !== metadata['id']
        });

        dispatch(setPunishments({data: newPunishmentRef}));

    }

    return (
        <>

            { !confirmationPopup ? <></> :
            <div className="confirmation-popup-overlay">
                <div className="popup">

                    <div className="header">
                        <p>Are you sure?</p>
                        <p className="close" onClick={() => { setConfirmationPopup(false) }}>+</p>
                    </div>

                    <div className="content">
                        <p className="subtext">Resolving this infraction will deactivate it, making it voided.</p>
                    </div>

                    <div className="actions">
                        <button className="cancel" onClick={() => { setConfirmationPopup(false) }}>Cancel</button>
                        <button className="accept" onClick={() => { setConfirmationPopup(false); resolvePunishment(); }}>Resolve</button>
                    </div>

                </div>
            </div>
            }           

            <div className="record">

                <div className="information">
                    <div className="tag-tip">
                        <p className="title">{ title }</p>
                        
                        <div className="label">
                            <p>{ tag }</p>
                        </div>
                    </div>
                    <p className="subtitle">{ subtitle }</p>
                </div>

                <div className="action" onBlur={() => { setPopup(false); }}>

                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { setPopup(!popup); }} width="800px" height="800px" viewBox="0 0 16 16" fill="#9A9A9A">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>

                    { popup ? 
                        <div className="popup-menu">
                            <ul>
                                {/* <li><a href="#">Archive</a></li> */}
                                <li onClick={ () => { enableEditView(metadata) } }><a href="#">Details</a></li>
                                <li onClick={ () => { setConfirmationPopup(true) }}><a href="#">Resolve</a></li>
                            </ul>
                        </div>
                    :
                        <></>
                    }

                </div>

            </div>
        </>
    )

}
