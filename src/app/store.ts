import { configureStore } from "@reduxjs/toolkit";
import showSlice from "../features/showSlice";

export const store = configureStore({
    reducer:{
        show:showSlice.show,
        item:showSlice.edit,
        addItem:showSlice.add,
        role:showSlice.role,
        theme:showSlice.theme,
        count:showSlice.count
    }
})