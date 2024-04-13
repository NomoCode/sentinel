
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import authReducer from "./features/authSlice";
import punishmentReducer from "./features/punishmentSlice";
import insightsReducer from "./features/insightsSlice";

export const store = configureStore({
    reducer: {
        authReducer,
        punishmentReducer,
        insightsReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
