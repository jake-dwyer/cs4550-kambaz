import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { FaAlignJustify } from "react-icons/fa";
import { Offcanvas } from "react-bootstrap";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table";
import Quizzes from "./Quiz/index";
import QuizEditor from "./Quiz/editor";
import TakeQuiz from "./Quiz/TakeQuiz";

export default function Courses() {
  const { cid } = useParams();
  const courses = useSelector((state: RootState) => state.coursesReducer?.courses || []);

  if (!courses.length) {
    return <h2 className="text-danger">Loading Courses...</h2>;
  }

  const course = courses.find((course) => course._id === cid);

  if (!course) {
    return <Navigate to="/Kambaz/Dashboard" />;
  }

  const { pathname } = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setShowDrawer(true);
    } else {
      setShowSidebar(!showSidebar);
    }
  };

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="text-danger me-3 fs-4"
          onClick={handleToggle}
          style={{ cursor: "pointer" }}
        />
        {course.name} &gt; {pathname.split("/")[4]}
      </h2>
      <hr />

      <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Course Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CoursesNavigation />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex">
        {showSidebar && (
          <div className="d-none d-md-block" style={{ width: "250px" }}>
            <CoursesNavigation />
          </div>
        )}

        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Modules" element={<Modules />} />
            <Route path="/Zoom" element={<h2>Zoom</h2>} />
            <Route path="/Assignments" element={<Assignments />} />
            <Route path="/Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="/People" element={<PeopleTable />} />
            <Route path="/Quizzes" element={<Quizzes />} />
            <Route path="/Quizzes/:qid" element={<QuizEditor />} />
            <Route path="/Quizzes/:qid/edit" element={<QuizEditor />} />
            <Route path="/Quizzes/:qid/take" element={<TakeQuiz />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
