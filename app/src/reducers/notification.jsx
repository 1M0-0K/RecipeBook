import { createSlice } from "@reduxjs/toolkit";

export const notifications = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
    },
    reducers: {
        addNotification: (state, {payload}) => {
            return {
                ...state,
                notifications: [...state.notifications, {"type": payload[0], "msg": payload[1]}]
            };
        },

        shiftNotifications: (state) => {
            return {
                ...state,
                notifications: [...state.notifications.slice(1)]
            };
        }
    }
    
})

export const {addNotification} = notifications.actions;
export const {shiftNotifications} = notifications.actions;

export const getNotifications = ({notifications: {notifications}}) => notifications;

export default notifications.reducer;


