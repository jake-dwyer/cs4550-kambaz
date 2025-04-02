import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    enrollments: [],
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
        toggleEnrollment: (state, action) => {
            const { userId, courseId } = action.payload;
            const isEnrolled = state.enrollments.some(
                (e) => e.user === userId && e.course === courseId
            );

            if (isEnrolled) {
                state.enrollments = state.enrollments.filter(
                    (e) => !(e.user === userId && e.course === courseId)
                );
            } else {
                state.enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
            }
        }
    },
});

export const { setEnrollments, addEnrollment, removeEnrollment, toggleEnrollment } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;