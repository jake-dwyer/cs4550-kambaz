import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const BASE_ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
const COURSE_ASSIGNMENTS_API = `${REMOTE_SERVER}/api/courses`;

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSE_ASSIGNMENTS_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  const response = await axiosWithCredentials.post(`${COURSE_ASSIGNMENTS_API}/${courseId}/assignments`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(`${BASE_ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  const response = await axiosWithCredentials.put(`${BASE_ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const response = await axiosWithCredentials.get(`${BASE_ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};