import { useState } from "react";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { FaAlignJustify } from "react-icons/fa";
import { Offcanvas } from "react-bootstrap";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import { courses } from "../Database";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table";

export default function Courses() {
    const { cid } = useParams();
    const course = courses.find((course) => course._id === cid);
    const { pathname } = useLocation();
    const [showDrawer, setShowDrawer] = useState(false); // Controls drawer visibility

    return (
        <div id="wd-courses">
            {/* Header with Red Hamburger Icon */}
            <h2 className="text-danger">
                <FaAlignJustify 
                    className="text-danger me-3 fs-4 d-md-none" 
                    onClick={() => setShowDrawer(true)} 
                    style={{ cursor: "pointer" }}
                />
                {course && course.name} &gt; {pathname.split("/")[4]}
            </h2>
            <hr />

            {/* Offcanvas Sidebar Drawer */}
            <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="start" className="w-100">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Course Navigation</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <CoursesNavigation />
                </Offcanvas.Body>
            </Offcanvas>

            <div className="d-flex">
                {/* Sidebar Navigation for Medium+ Screens */}
                <div className="d-none d-md-block">
                    <CoursesNavigation />
                </div>

                {/* Main Content */}
                <div className="flex-fill">
                    <Routes>
                        <Route path="/" element={<Navigate to="Home" />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Modules" element={<Modules />} />
                        <Route path="/Zoom" element={<h2>Zoom</h2>} />
                        <Route path="/Assignments" element={<Assignments />} />
                        <Route path="/Assignments/:aid" element={<AssignmentEditor />} />
                        <Route path="/People" element={<PeopleTable />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}