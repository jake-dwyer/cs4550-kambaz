import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import { Button, FormControl } from "react-bootstrap";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);

    const existingAssignment = assignments.find(a => a._id === aid);
    const isEditing = !!existingAssignment;

    const [assignment, setAssignment] = useState(
        existingAssignment || {
            title: "",
            description: "",
            points: 100,
            dueDate: "2024-05-13",
            availableFrom: "2024-05-06",
            availableUntil: "2024-05-20",
            course: cid,
        }
    );

    const handleSave = () => {
        if (isEditing) {
            dispatch(updateAssignment(assignment));
        } else {
            dispatch(addAssignment(assignment));
        }
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    };

    return (
        <div className="container mt-4 p-5">
            <h3>{isEditing ? "Edit Assignment" : "Create Assignment"}</h3>
            <div className="mb-3">
                <label className="form-label">Assignment Name</label>
                <FormControl value={assignment.title}
                    onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
            </div>
            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={4}
                    value={assignment.description}
                    onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} />
            </div>
            <div className="mb-3">
                <label className="form-label">Points</label>
                <FormControl type="number"
                    value={assignment.points}
                    onChange={(e) => setAssignment({ ...assignment, points: Number(e.target.value) })} />
            </div>
            <div className="d-flex justify-content-between">
                <div>
                    <label className="form-label">Due Date</label>
                    <FormControl type="date"
                        value={assignment.dueDate}
                        onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">Available From</label>
                    <FormControl type="date"
                        value={assignment.availableFrom}
                        onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })} />
                </div>
                <div>
                    <label className="form-label">Available Until</label>
                    <FormControl type="date"
                        value={assignment.availableUntil}
                        onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })} />
                </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                <Button variant="danger" className="ms-2" onClick={handleSave}>Save</Button>
            </div>
        </div>
    );
}