import { createSlice } from "@reduxjs/toolkit";
import { assignments as initialAssignments } from "../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    assignments: initialAssignments,
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        addAssignment: (state, { payload }) => {
            const newAssignment = { ...payload, _id: uuidv4() };
            state.assignments.push(newAssignment);
        },
        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter(a => a._id !== assignmentId);
        },
        updateAssignment: (state, { payload }) => {
            state.assignments = state.assignments.map(a =>
                a._id === payload._id ? payload : a
            );
        },
    },
});

export const { addAssignment, deleteAssignment, updateAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;