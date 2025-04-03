import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  courses: [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, { payload }) => {
      state.courses = payload;
    },
    addCourse: (state, { payload }) => {
      const newCourse = { _id: uuidv4(), ...payload };
      state.courses.push(newCourse);
    },
    deleteCourse: (state, { payload: courseId }) => {
      state.courses = state.courses.filter(course => course._id !== courseId);
    },
    updateCourse: (state, { payload }) => {
      state.courses = state.courses.map(course =>
        course._id === payload._id ? payload : course
      );
    },
  },
});

export const {
  setCourses,
  addCourse,
  deleteCourse,
  updateCourse,
} = coursesSlice.actions;

export default coursesSlice.reducer;
