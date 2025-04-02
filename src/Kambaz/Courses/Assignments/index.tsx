import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { deleteAssignment, setAssignments, updateAssignment, addAssignment } from "./reducer";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { BsGripVertical, BsTrash } from "react-icons/bs";
import { RxTriangleDown } from "react-icons/rx";
import { LuNewspaper } from "react-icons/lu";
import * as assignmentClient from "./client";
import * as coursesClient from "../client";
import { useEffect } from "react";

export default function Assignments() {
  const { cid } = useParams();
  const assignmentsState = useSelector((state: any) => state.assignmentReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const canEdit = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY");
  const dispatch = useDispatch();

  if (!assignmentsState || !assignmentsState.assignments) {
    return <h2>Error loading assignments</h2>;
  }

  const { assignments } = assignmentsState;

  useEffect(() => {
    const fetchAssignments = async () => {
      const modules = await coursesClient.findModulesForCourse(cid as string);
      const moduleIds = modules.map((m: any) => m._id);
      const allAssignments = await Promise.all(
        moduleIds.map((id: string) => assignmentClient.findAssignmentsForModule(id))
      );
      const assignments = allAssignments.flat();
      dispatch(setAssignments(assignments));
    };    
    fetchAssignments();
  }, [cid]);
  

  return (
    <div id="assignments" className="d-flex flex-column p-5 pt-2">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Assignments</h2>
      </div>
      <ListGroup className="rounded-0 mt-4">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            <RxTriangleDown className="me-1" />
            ASSIGNMENTS
            {canEdit && <AssignmentControlButtons />}
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (
                <ListGroup.Item
                  key={assignment._id}
                  className="wd-assignment p-3 ps-1 d-flex justify-content-between"
                >
                  <div>
                    <BsGripVertical className="me-2 fs-3" />
                    <LuNewspaper style={{ stroke: "green" }} className="me-4" />
                    <a
                      className="text-dark text-decoration-none"
                      href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                    >
                      <b>{assignment.title}</b>
                    </a>
                  </div>
                  {canEdit && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this assignment?")) {
                          await assignmentClient.deleteAssignment(assignment._id);
                          const modules = await coursesClient.findModulesForCourse(cid as string);
                          const moduleIds = modules.map((m: any) => m._id);
                          const allAssignments = await Promise.all(
                            moduleIds.map((id: string) => assignmentClient.findAssignmentsForModule(id))
                          );
                          const assignments = allAssignments.flat();
                          dispatch(setAssignments(assignments));
                        }
                      }}                     
                    >
                      <BsTrash />
                    </button>
                  )}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
