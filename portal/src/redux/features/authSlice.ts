
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type AuthState = {

    data: any

}

type InitialState = {
    value: AuthState
}

const initialState: InitialState = {

    value: {
        data: {}
    }

}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: () => initialState,
        logIn: (state: any, action: PayloadAction<object | any>) => {
            return {
                value: {
                    data: action.payload['data']
                }
            }
        }
    }
})

export const {logIn, logOut } = auth.actions;
export default auth.reducer;