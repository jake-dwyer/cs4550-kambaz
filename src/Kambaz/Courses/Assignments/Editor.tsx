import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import { v4 as uuidv4 } from "uuid";
import * as assignmentClient from "./client";

export default function Editor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const assignmentsState = useSelector((state: any) => state.assignmentReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const canEdit = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY");

  const existingAssignment = assignmentsState.assignments.find((a: any) => a._id === aid);

  const modules = useSelector((state: any) => state.modulesReducer.modules || []);
  const defaultModuleId = modules.length > 0 ? modules[0]._id : null;

  const [assignment, setAssignment] = useState<any>(
    existingAssignment || {
      _id: uuidv4(),
      title: "",
      course: cid,
      module: defaultModuleId,
      points: 100,
      group: "ASSIGNMENTS",
      displayGrade: "PERCENTAGE",
      submissionType: "ONLINE",
      options: {
        textEntry: false,
        websiteURL: true,
        mediaRecordings: false,
        studentAnnotation: false,
        fileUploads: false,
      },
      assignTo: "Everyone",
      dueDate: "2024-05-13",
      availableFrom: "2024-05-06",
      availableUntil: "2024-05-20",
      description: `This assignment is part of course ${cid}. Please refer to the course materials for specific instructions.`,
    }
  );

  const handleSave = async () => {
    if (!assignment.module) {
      alert("Assignment must be associated with a module.");
      return;
    }
  
    if (existingAssignment) {
      const updated = await assignmentClient.updateAssignment(assignment);
      dispatch(updateAssignment(updated));
    } else {
      const created = await assignmentClient.createAssignment(assignment.module, assignment);
      dispatch(addAssignment(created));
    }
  
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  if (!canEdit) {
    return (
      <div className="container mt-4 p-5">
        <h2>Assignment Details</h2>
        <div className="mb-4">
          <strong>Assignment Name:</strong>
          <div>{assignment.title}</div>
        </div>
        <div className="mb-4">
          <strong>Description:</strong>
          <div>{assignment.description}</div>
        </div>
        <div className="mb-4">
          <strong>Points:</strong>
          <div>{assignment.points}</div>
        </div>
        <div className="mb-4">
          <strong>Assignment Group:</strong>
          <div>{assignment.group}</div>
        </div>
        <div className="mb-4">
          <strong>Display Grade as:</strong>
          <div>{assignment.displayGrade}</div>
        </div>
        <div className="mb-4">
          <strong>Submission Type:</strong>
          <div>{assignment.submissionType}</div>
        </div>
        <div className="mb-4">
          <strong>Assign To:</strong>
          <div>{assignment.assignTo}</div>
        </div>
        <div className="mb-4">
          <strong>Due Date:</strong>
          <div>{assignment.dueDate}</div>
        </div>
        <div className="mb-4">
          <strong>Available From:</strong>
          <div>{assignment.availableFrom}</div>
        </div>
        <div className="mb-4">
          <strong>Available Until:</strong>
          <div>{assignment.availableUntil}</div>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4 p-5">
      <div className="mb-4">
        <div className="row align-items-center">
          <div>
            <label htmlFor="name" className="form-label">Assignment Name</label>
          </div>
          <div className="col-md-12">
            <input
              id="name"
              value={assignment.title}
              type="text"
              className="form-control"
              onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="row align-items-start">
          <div className="col-md-12">
            <textarea
              id="description"
              className="form-control"
              rows={6}
              value={assignment.description}
              onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Points, Assignment Group, Display Grade */}
      <div className="mb-4">
        <div className="row align-items-center mb-3">
          <div className="col-md-4 d-flex justify-content-end">
            <label htmlFor="points" className="form-label">Points</label>
          </div>
          <div className="col-md-8">
            <input
              id="points"
              value={assignment.points}
              type="number"
              className="form-control"
              onChange={(e) => setAssignment({ ...assignment, points: e.target.value })}
            />
          </div>
        </div>
        <div className="row align-items-center mb-3">
          <div className="col-md-4 d-flex justify-content-end">
            <label htmlFor="group" className="form-label">Assignment Group</label>
          </div>
          <div className="col-md-8">
            <select
              id="group"
              className="form-select"
              value={assignment.group}
              onChange={(e) => setAssignment({ ...assignment, group: e.target.value })}
            >
              <option value="NONE">None</option>
              <option value="ASSIGNMENTS">Assignments</option>
            </select>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-4 d-flex justify-content-end">
            <label htmlFor="display-grade" className="form-label">Display Grade as</label>
          </div>
          <div className="col-md-8">
            <select
              id="display-grade"
              className="form-select"
              value={assignment.displayGrade}
              onChange={(e) => setAssignment({ ...assignment, displayGrade: e.target.value })}
            >
              <option value="FRACTION">Fraction</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submission Type */}
      <div className="mb-4">
        <div className="row align-items-top">
          <div className="col-md-4 d-flex justify-content-end">
            <label htmlFor="submission-type" className="form-label">Submission Type</label>
          </div>
          <div className="col-md-8">
            <div className="border border-1 border-secondary-subtle rounded-2 p-3">
              <select
                id="submission-type"
                className="form-select"
                value={assignment.submissionType}
                onChange={(e) => setAssignment({ ...assignment, submissionType: e.target.value })}
              >
                <option value="PAPER">Paper</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Section */}
      <div className="mb-4">
        <div className="row align-items-top">
          <div className="col-md-4 d-flex justify-content-end">
            <label className="form-label">Assign</label>
          </div>
          <div className="col-md-8">
            <div className="border border-1 border-secondary-subtle rounded-2 p-3">
              <div className="row g-3">
                <div className="col-md-12">
                  <label htmlFor="assign-to" className="form-label">Assign to</label>
                  <input
                    id="assign-to"
                    value={assignment.assignTo}
                    type="text"
                    className="form-control"
                    onChange={(e) => setAssignment({ ...assignment, assignTo: e.target.value })}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="due-date" className="form-label">Due</label>
                  <input
                    id="due-date"
                    value={assignment.dueDate}
                    type="date"
                    className="form-control"
                    onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="available-from" className="form-label">Available from</label>
                  <input
                    id="available-from"
                    value={assignment.availableFrom}
                    type="date"
                    className="form-control"
                    onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="available-until" className="form-label">Until</label>
                  <input
                    id="available-until"
                    value={assignment.availableUntil}
                    type="date"
                    className="form-control"
                    onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="d-flex justify-content-end mt-4">
        <Button id="cancel" variant="secondary" className="me-2" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}>
          Cancel
        </Button>
        <Button id="save" variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
