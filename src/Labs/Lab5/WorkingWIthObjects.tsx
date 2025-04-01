import React, { useState } from "react";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({ title: "", score: 0, completed: false });
    const [module, setModule] = useState({ name: "", description: "" });

    return (
        <div id="wd-working-with-objects">
            <h3>Assignment Controls</h3>
            <input
                placeholder="New Score"
                type="number"
                className="form-control mb-2"
                onChange={(e) => setAssignment({ ...assignment, score: Number(e.target.value) })}
            />
            <a
                className="btn btn-primary mb-2"
                href={`${REMOTE_SERVER}/lab5/assignment/score/${assignment.score}`}
                target="_blank"
            >
                Update Score
            </a>
            <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={assignment.completed}
                    onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}
                />
                <label className="form-check-label">Completed</label>
            </div>
            <a
                className="btn btn-primary mb-4"
                href={`${REMOTE_SERVER}/lab5/assignment/completed/${assignment.completed}`}
                target="_blank"
            >
                Update Completed
            </a>

            <h3>Module Controls</h3>
            <a className="btn btn-secondary mb-2" href={`${REMOTE_SERVER}/lab5/module`} target="_blank">
                Get Module
            </a>
            <a className="btn btn-secondary mb-2" href={`${REMOTE_SERVER}/lab5/module/name`} target="_blank">
                Get Module Name
            </a>
            <input
                placeholder="New Module Name"
                className="form-control mb-2"
                onChange={(e) => setModule({ ...module, name: e.target.value })}
            />
            <a
                className="btn btn-primary mb-4"
                href={`${REMOTE_SERVER}/lab5/module/name/${module.name}`}
                target="_blank"
            >
                Update Module Name
            </a>
            <input
                placeholder="New Module Description"
                className="form-control mb-2"
                onChange={(e) => setModule({ ...module, description: e.target.value })}
            />
            <a
                className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module/description/${module.description}`}
                target="_blank"
            >
                Update Module Description
            </a>
        </div>
    );
}
