import {configureStore} from "@reduxjs/toolkit";
import notification from "../reducers/notification";
import recipes from "../reducers/recipes";

const store =  configureStore({
    reducer:{
        notifications: notification,
        recipes
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({immutableCheck: false, serializableCheck: false})
});

export default store;

