import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/modules`;
const BASE_ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

export const findAssignmentsForModule = async (moduleId: string) => {
  const response = await axios.get(`${ASSIGNMENTS_API}/${moduleId}/assignments`);
  return response.data;
};

export const createAssignment = async (moduleId: string, assignment: any) => {
    const response = await axios.post(`${ASSIGNMENTS_API}/${moduleId}/assignments`, assignment);
    return response.data;
  };  

  export const deleteAssignment = async (assignmentId: string) => {
    const response = await axios.delete(`${BASE_ASSIGNMENTS_API}/${assignmentId}`);
    return response.data;
  };

export const updateAssignment = async (assignment: any) => {
    const response = await axios.put(`${BASE_ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return response.data;
  };
