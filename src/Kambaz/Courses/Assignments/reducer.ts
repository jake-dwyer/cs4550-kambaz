import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload }) => {
      state.assignments = payload;
    },
    addAssignment: (state, { payload }) => {
      state.assignments.push(payload);
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

export const {
  setAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
