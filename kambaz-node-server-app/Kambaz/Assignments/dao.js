import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const createAssignment = (assignment) => {
  const newAssignment = { ...assignment, _id: uuidv4() };
  db.assignments = [...db.assignments, newAssignment];
  return newAssignment;
};

export const findAssignmentsForModule = (moduleId) => {
  return db.assignments.filter((a) => a.module === moduleId);
};

export const updateAssignment = (assignmentId, updates) => {
  db.assignments = db.assignments.map((a) =>
    a._id === assignmentId ? { ...a, ...updates } : a
  );
  return db.assignments.find((a) => a._id === assignmentId);
};

export const deleteAssignment = (assignmentId) => {
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
    return { status: "deleted" };
  };
