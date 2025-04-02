import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { courses as initialCourses } from "../../../kambaz-node-server-app/Kambaz/Database";

const initialState = {
  courses: initialCourses,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
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

export const { addCourse, deleteCourse, updateCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
