import { createSlice } from "@reduxjs/toolkit";

const lessonSlice = createSlice({
  name: "lessonReducer",
  initialState: { lessons: [] },
  reducers: {
    setLessons: (state, action) => {
      state.lessons = action.payload;
    },
    addLesson: (state, action) => {
      state.lessons.push(action.payload);
    },
    updateLesson: (state, action) => {
      const index = state.lessons.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) state.lessons[index] = action.payload;
    },
    deleteLesson: (state, action) => {
      state.lessons = state.lessons.filter((l) => l._id !== action.payload);
    },
  },
});

export const { setLessons, addLesson, updateLesson, deleteLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
