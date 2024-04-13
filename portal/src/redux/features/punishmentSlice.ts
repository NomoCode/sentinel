
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PunishmentRecord = {

    id: number,
    game_username: string,
    game_account_id: string,
    game_moderator_id: string,
    conn_ip_address: string,
    conn_unique_cookie: string,
    punishment_type: string,
    metadata: object,
    duration: string,
    region: string,
    reason: string,
    active: boolean,
    updated_at: Date,
    created_at: Date

}

type PunishmentState = {

    data: PunishmentRecord[]

}

type InitialState = {
    value: PunishmentState
}

const initialState: InitialState = {

    value: {
        data: []
    }

}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setPunishments: (state: any, action: PayloadAction<object | any>) => {
            return {
                value: {
                    data: action.payload['data']
                }
            }
        }
    }
})

export const {setPunishments } = auth.actions;
export default auth.reducer;