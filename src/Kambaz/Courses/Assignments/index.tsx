import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { deleteAssignment } from "./reducer";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { BsGripVertical } from "react-icons/bs";
import { RxTriangleDown } from "react-icons/rx";
import { LuNewspaper } from "react-icons/lu";

export default function Assignments() {
    const { cid } = useParams();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div id="assignments" className="d-flex flex-column p-5 pt-2">
            <ListGroup className="rounded-0 mt-4">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" />
                        <RxTriangleDown className="me-1" />
                        ASSIGNMENTS
                        <AssignmentControlButtons />
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {assignments
                            .filter((assignment) => assignment.course === cid)
                            .map((assignment) => (
                                <ListGroup.Item key={assignment._id} className="wd-assignment p-3 ps-1 d-flex justify-content-between">
                                    <div>
                                        <BsGripVertical className="me-2 fs-3" />
                                        <LuNewspaper style={{ stroke: "green" }} className="me-4" />
                                        <a className="text-dark text-decoration-none"
                                           href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}>
                                            <b>{assignment.title}</b>
                                        </a>
                                    </div>
                                    <button className="btn btn-danger btn-sm"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this assignment?")) {
                                                dispatch(deleteAssignment(assignment._id));
                                            }
                                        }}>
                                        Delete
                                    </button>
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}