import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
console.log("REMOTE_SERVER =", REMOTE_SERVER);

const COURSES_API = `${REMOTE_SERVER}/api/courses`;

// Retrieves all courses from the backend
export const fetchAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(COURSES_API);
  return data;
};

// Deletes a course by its ID
export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};

// Updates a course object
export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

// Retrieves all modules for a given course ID
export const findModulesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

// Creates a new module for a given course
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/modules`, module);
  return response.data;
};

// Creates a new course using a POST request
export const createCourse = async (course: any) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}`, course);
  return response.data;
};

// Retrieves all enrolled users for a given course ID.
// Note: Uses axiosWithCredentials so that session credentials are sent.
export const findUsersForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};