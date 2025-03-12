import { createSlice } from "@reduxjs/toolkit";
import * as db from "../Database";

const initialState = {
    enrollments: db.enrollments || [],
};

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {
        setEnrollments: (state, action) => {
            state.enrollments = action.payload;
        },
        addEnrollment: (state, action) => {
            state.enrollments.push(action.payload);
        },
        removeEnrollment: (state, action) => {
            state.enrollments = state.enrollments.filter(
                (enrollment) => enrollment._id !== action.payload
            );
        },
    },
});

export const { setEnrollments, addEnrollment, removeEnrollment } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;