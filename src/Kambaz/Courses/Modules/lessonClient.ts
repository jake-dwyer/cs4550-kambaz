import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const LESSONS_API = `${REMOTE_SERVER}/api/modules`;

export const findLessonsForModule = async (moduleId: string) => {
  const response = await axios.get(`${LESSONS_API}/${moduleId}/lessons`);
  return response.data;
};

export const createLesson = async (moduleId: string, lesson: any) => {
  const response = await axios.post(`${LESSONS_API}/${moduleId}/lessons`, lesson);
  return response.data;
};

export const updateLesson = async (lesson: any) => {
  const response = await axios.put(`${REMOTE_SERVER}/api/lessons/${lesson._id}`, lesson);
  return response.data;
};

export const deleteLesson = async (lessonId: string) => {
  const response = await axios.delete(`${REMOTE_SERVER}/api/lessons/${lessonId}`);
  return response.data;
};