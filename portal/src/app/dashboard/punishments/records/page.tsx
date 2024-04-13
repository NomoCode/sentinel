
"use client";

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import "../../../../styles/dashboard/layouts/Layout.css";
import "../../../../styles/dashboard/filter/FilterRow.css";
import "../../../../styles/dashboard/container/EmptyContainer.css";
import "../../../../styles/dashboard/container/RecordViewContainer.css";

import { useAppSelector } from "@/redux/store";
import { getAPIUrl } from "@/utils/api";
import { PunishmentRecord, setPunishments } from "@/redux/features/punishmentSlice";
import Record from "@/components/dashboard/record/Record";

export default function BansHome() {

    // Dispatch redux state
    const dispatch = useDispatch();

    // Get the punishments from the redux state
    const punishment_data = useAppSelector((state) => { return state.punishmentReducer.value });
    const auth_data = useAppSelector((state) => { return state.authReducer.value });

    // Input for the dropdown
    const [dropdownFilterInput, setDropdownFilterInput] = useState('');
    const [dropdownPopup, setDropdownPopup] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // Create children functions
    const editRecord = (record: any) => setEditingRecord(record);

    // Use state for the filters so we can keep track of them
    const [ipAddress, setIpAddress] = useState('');
    const [cookie, setCookie] = useState('');
    const [username, setUsername] = useState('');
    const [infractionType, setInfractionType] = useState('');

    // If there is an error
    const [error, setError] = useState('');

    // Confirmation popup
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    // Resolve the case, set the resolveCase popup
    const resolvePunishment = async () => {


        if (!editingRecord) return;

        // Send the api request
        const { data } = await axios.delete(`${getAPIUrl()}/api/dashboard/punishments/${editingRecord['id']}`, {
            headers: {
                "Authorization": auth_data.data.user.id
            }
        });

        if (data.error) return console.log("Error", data.error);

        // Remove punishment from punishment records
        let newPunishmentRef: Array<PunishmentRecord> = [...punishment_data.data].filter((ogPunishment: any) => { 
            return ogPunishment.id !== editingRecord['id']
        });

        dispatch(setPunishments({data: newPunishmentRef}));

    }

    // Get all the record results
    const getAllAPIResults = async () => {

        // Get the api results from the api
        const { data } = await axios.get(`${getAPIUrl()}/api/dashboard/punishments`, {
            headers: {
                "Authorization": auth_data.data.user.id
            }
        });

        // If an error we just need to let them know
        if (data.error) return setError(data.message);

        dispatch(setPunishments({ data: data }));
    }

    // Filter with the API 
    const getFilteredAPIResults = async () => {

        // Form the request body
        const requestBody: any = {
            conn_ip_address: ipAddress,
            conn_unique_cookie: cookie,
            game_username: username,
            punishment_type: infractionType
        }

        // Get the api results from the api
        const { data } = await axios.post(`${getAPIUrl()}/api/dashboard/punishments/filter`, requestBody, {
            headers: {
                "Authorization": auth_data.data.user.id
            }
        });

        // If an error we just need to let them know
        if (data.error) return setError(data.message);

        dispatch(setPunishments({ data: data }));
        console.log(requestBody);

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
                        <p className="subtext">Resolving this infraction will delete it permanately from records.</p>
                    </div>

                    <div className="actions">
                        <button className="cancel" onClick={() => { setConfirmationPopup(false) }}>Cancel</button>
                        <button className="accept" onClick={() => { setConfirmationPopup(false); resolvePunishment(); setEditingRecord(null); }}>Resolve</button>
                    </div>

                </div>
            </div>
        }     

        <div className="filter-row">

            <div className="dropdown-wrapper">

                <input
                    value={ dropdownFilterInput }
                    onChange={ (e) => {  
                        
                        if (e.target.value) {
                            setDropdownPopup(true);
                        } else {
                            setDropdownPopup(false);
                        }

                        setDropdownFilterInput(e.target.value); 
                    } }
                    placeholder="Enter value of filter..."
                />

                {

                    !dropdownPopup ? <></> :
                    <div className="dropdown-content">
                        <div className="item" style={{ border: "2px solid #ADD8E6" }} onClick={ () => { setIpAddress(dropdownFilterInput); getFilteredAPIResults(); setDropdownPopup(false); } }>
                            <p>IP Address</p>
                        </div>

                        <div className="item" style={{ border: "2px solid #FFD580" }} onClick={ () => { setUsername(dropdownFilterInput); getFilteredAPIResults(); setDropdownPopup(false); } }>
                            <p>Game Username</p>
                        </div>

                        <div className="item" style={{ border: "2px solid #90EE90" }} onClick={ () => { setCookie(dropdownFilterInput); getFilteredAPIResults(); setDropdownPopup(false); } }>
                            <p>Unique Cookie</p>
                        </div>

                        <div className="item"  style={{ border: "2px solid #FF474D" }} onClick={ () => { setInfractionType(dropdownFilterInput); getFilteredAPIResults(); setDropdownPopup(false); } }>
                            <p>Infraction Type</p>
                        </div>
                    </div>

                }

            </div>

            <div className="labels">

                {

                    !ipAddress ? <></> :
                    <div className="label" style={{ border: "2px solid #ADD8E6" }}>
                        <p className="text">{ ipAddress } </p>
                        <p className="x"  onClick={() => { setIpAddress('') } }>+</p>
                    </div>

                }

                {

                    !username ? <></> :
                    <div className="label" style={{ border: "2px solid #FFD580" }}>
                        <p className="text">{ username } </p>
                        <p className="x" onClick={() => { setUsername('') } }>+</p>
                    </div>

                }

                {

                    !cookie ? <></> :
                    <div className="label" style={{ border: "2px solid #90EE90" }}>
                        <p className="text">{ cookie } </p>
                        <p className="x" onClick={() => { setCookie('') } }>+</p>
                    </div>

                }

                {

                    !infractionType ? <></> :
                    <div className="label" style={{ border: "2px solid #FF474D" }}>
                        <p className="text">{ infractionType } </p>
                        <p className="x" onClick={ () => { setInfractionType(''); } }>+</p>
                    </div>

                }

            </div>
        
        </div>

        { 
            !error ? <></> :
            <>
                <div className="empty-container">
                    <p className="title">Unexpected Error</p>
                    <p className="desc">There was an unexpected error, refresh and try again.</p>
                </div>
            </>
        }

        {  
            !editingRecord ? <></> :
                <div className="record-view-container">

                    <div className="menu-bar">
                        <div className="items">
                            <div className="inline">
                                <button onClick={() => { setEditingRecord(null) }}>Go back to results</button>
                            </div>

                            <div className="row">
                                <button className="delete" onClick={() => { setConfirmationPopup(true); }}>Resolve Case</button>
                            </div>
                        </div>
                    </div>

                    <div className="content">
                        <div className="identifications">
                            <h1 className="username"> { editingRecord['game_username'] } </h1>

                            <div className="section">
                                <p className="title">Account ID:</p>
                                <p className="subtext">{ editingRecord['game_account_id'] ? editingRecord['game_account_id'] : "N/A" }</p>
                            </div>

                            <div className="section">
                                <p className="title">Moderator ID:</p>
                                <p className="subtext">{ editingRecord['game_moderator_id'] ? editingRecord['game_moderator_id'] : "N/A" }</p>
                            </div>

                            <div className="section">
                                <div className="inline">
                                    <p className="in-title">Created: </p>
                                    <p className="in-subtext">{ `${new Date(editingRecord['created_at']).getMonth() + 1}/${new Date(editingRecord['created_at']).getDate()}/${new Date(editingRecord['created_at']).getFullYear()}` }</p>
                                </div>

                                <div className="inline">
                                    <p className="in-title">Last Updated At: </p>
                                    <p className="in-subtext">{ editingRecord['updated_at'] ? `${new Date(editingRecord['updated_at']).getMonth() + 1}/${new Date(editingRecord['updated_at'])}/${new Date(editingRecord['updated_at']).getFullYear()}` : "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="identifications">
                            <div className="section">
                                <p className="title">Reason:</p>
                                <p className="subtext">{ editingRecord['reason'] ? editingRecord['reason'] : "N/A" }</p>
                            </div>

                            <div className="section">
                                <p className="title">Punishment Type:</p>
                                <p className="subtext">{ editingRecord['punishment_type'] }</p>
                            </div>


                            <div className="section">
                                <p className="title">Game Region:</p>
                                <p className="subtext">{ editingRecord['region'] ? editingRecord['region'] : "N/A" }</p>
                            </div>

                            <div className="section">
                                <p className="title">Duration:</p>
                                <p className="subtext">{ editingRecord['duration'] ? editingRecord['duration'] : "N/A" }</p>
                            </div>
                        </div>

                        <div className="identifications">
                            <div className="section">
                                <p className="title">Hashed IP Address:</p>
                                <p className="subtext">{ editingRecord['conn_ip_address'] ? editingRecord['conn_ip_address'] : "N/A" }</p>
                            </div>

                            <div className="section">
                                <p className="title">Unique Cookie:</p>
                                <p className="subtext">{ editingRecord['conn_unique_cookie'] ? editingRecord['conn_unique_cookie'] : "N/A" }</p>
                            </div>

                            <div className="section">
                                <p className="title">Active Punishment:</p>
                                <p className="subtext">{ editingRecord['active'] ? "Yes" : "No" } </p>
                            </div>
                        </div>
                    </div>

                </div>
        }

        { 
            punishment_data.data.length > 0 ?
                ( !editingRecord ?
                <>

                    <div className="record-container">

                        <p className="counter">

                            <span className="number">{ (punishment_data.data.length).toLocaleString() } </span> results returned

                        </p>

                        <div className="records">
                            {

                                punishment_data.data.map((punishment: PunishmentRecord) => {

                                    return <Record title= { punishment.game_username } tag={ punishment.punishment_type } subtitle={ `${new Date(punishment.created_at).getMonth() + 1}/${new Date(punishment.created_at).getDate()}/${new Date(punishment.created_at).getFullYear()} | ID: ${punishment.id}` } enableEditView={ editRecord } metadata={ punishment } />

                                })                            

                            }
                        </div>
                    </div>
                    </>
                    : <></> )
            :
                ( editingRecord ? <></> :
                <div className="empty-container">
                    <p className="title">Uh oh...</p>
                    <p className="desc">There were no results shown, please click the button below to get all records.</p>
                    <button onClick={() => { getAllAPIResults() }}>Get All Records</button>
                </div>
                )
        }

    </>
  )
}
