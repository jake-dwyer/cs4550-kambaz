import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import * as db from "../../Database";

export default function Editor() {
    const { aid } = useParams(); // Get assignment ID from URL params
    const assignment = db.assignments.find(a => a._id === aid) || { title: "", course: "" };

    return (
        <div className="container mt-4 p-5">
            <div className="mb-4">
                <div className="row align-items-center">
                    <div>
                        <label htmlFor="name" className="form-label">Assignment Name</label>
                    </div>
                    <div className="col-md-12">
                        <input id="name" value={assignment.title} type="text" className="form-control" readOnly />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="row align-items-start">
                    <div className="col-md-12">
                        <textarea id="description" className="form-control" rows={6} readOnly>
                            {`This assignment is part of course ${assignment.course}. Please refer to the course materials for specific instructions.`}
                        </textarea>
                    </div>
                </div>
            </div>

            {/* Points, Assignment Group, Display Grade as */}
            <div className="mb-4">
                <div className="row align-items-center mb-3">
                    <div className="col-md-4 d-flex justify-content-end">
                        <label htmlFor="points" className="form-label">Points</label>
                    </div>
                    <div className="col-md-8">
                        <input id="points" value={100} type="number" className="form-control" />
                    </div>
                </div>
                <div className="row align-items-center mb-3">
                    <div className="col-md-4 d-flex justify-content-end">
                        <label htmlFor="group" className="form-label">Assignment Group</label>
                    </div>
                    <div className="col-md-8">
                        <select id="group" className="form-select">
                            <option value="NONE">None</option>
                            <option selected value="ASSIGNMENTS">Assignments</option>
                        </select>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md-4 d-flex justify-content-end">
                        <label htmlFor="display-grade" className="form-label">Display Grade as</label>
                    </div>
                    <div className="col-md-8">
                        <select id="display-grade" className="form-select">
                            <option value="FRACTION">Fraction</option>
                            <option selected value="PERCENTAGE">Percentage</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Submission Type - FIXED */}
            <div className="mb-4">
                <div className="row align-items-top">
                    <div className="col-md-4 d-flex justify-content-end">
                        <label htmlFor="submission-type" className="form-label">Submission Type</label>
                    </div>
                    <div className="col-md-8">
                        <div className="border border-1 border-secondary-subtle rounded-2 p-3">
                            <select id="submission-type" className="form-select">
                                <option value="PAPER">Paper</option>
                                <option selected value="ONLINE">Online</option>
                            </select>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <h6><b>Online Entry Options:</b></h6>
                                    <div className="form-check mt-4 mb-4">
                                        <input type="checkbox" className="form-check-input" id="text-entry" />
                                        <label className="form-check-label" htmlFor="text-entry">Text Entry</label>
                                    </div>
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" id="website-url" defaultChecked />
                                        <label className="form-check-label" htmlFor="website-url">Website URL</label>
                                    </div>
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" id="media-recordings" />
                                        <label className="form-check-label" htmlFor="media-recordings">Media Recordings</label>
                                    </div>
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" id="student-annotation" />
                                        <label className="form-check-label" htmlFor="student-annotation">Student Annotation</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="file-uploads" />
                                        <label className="form-check-label" htmlFor="file-uploads">File Uploads</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Section - FIXED */}
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
                                    <input id="assign-to" value="Everyone" type="text" className="form-control" />
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="due-date" className="form-label">Due</label>
                                    <input id="due-date" value="2024-05-13" type="date" className="form-control" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="available-from" className="form-label">Available from</label>
                                    <input id="available-from" value="2024-05-06" type="date" className="form-control" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="available-until" className="form-label">Until</label>
                                    <input id="available-until" value="2024-05-20" type="date" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr />
            <div className="d-flex justify-content-end mt-4">
                <Button id="cancel" variant="secondary" className="me-2">Cancel</Button>
                <Button id="save" variant="danger">Save</Button>
            </div>
        </div>
    );
}