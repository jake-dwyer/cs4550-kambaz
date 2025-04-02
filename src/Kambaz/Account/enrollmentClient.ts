import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const ENROLLMENTS_API = `${REMOTE_SERVER}/api`;

export const enroll = async (userId: string, courseId: string) => {
  const response = await axios.post(`${ENROLLMENTS_API}/users/${userId}/courses/${courseId}`);
  return response.data;
};

export const unenroll = async (userId: string, courseId: string) => {
  const response = await axios.delete(`${ENROLLMENTS_API}/users/${userId}/courses/${courseId}`);
  return response.data;
};

export const findCoursesForUser = async (userId: string) => {
  const response = await axios.get(`${ENROLLMENTS_API}/users/${userId}/courses`);
  return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${ENROLLMENTS_API}/courses/${courseId}/users`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
    const response = await axios.get(`${ENROLLMENTS_API}/enrollments/user/${userId}`);
    return response.data;
  };
  