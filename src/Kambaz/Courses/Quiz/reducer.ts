import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload }) => {
      state.quizzes = payload;
    },
    addQuiz: (state, { payload }) => {
      const existing = state.quizzes.find((q: any) => q._id === payload._id);
      if (!existing) {
        state.quizzes.push(payload);
      }
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === payload._id ? payload : q
      );
    },
    togglePublish: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, published: !q.published } : q
      );
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  togglePublish,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
