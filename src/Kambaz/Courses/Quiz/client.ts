import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api`;

// Get all quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/courses/${courseId}/quizzes`);
  return response.data;
};

// Create a new quiz
export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/courses/${courseId}/quizzes`, quiz);
  return response.data;
};

// Update a quiz
export const updateQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/quizzes/${quiz._id}`, quiz);
  return response.data;
};

// Delete a quiz
export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/quizzes/${quizId}`);
  return response.data;
};

// Publish/unpublish a quiz
export const publishQuiz = async (quizId: string, published: boolean) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/quizzes/${quizId}/publish`, { published });
  return response.data;
};

// Get a quiz by ID
export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/quizzes/${quizId}`);
  return response.data;
};
