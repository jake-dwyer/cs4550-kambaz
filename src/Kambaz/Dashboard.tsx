import { Link } from "react-router-dom";
import { Row, Col, Card, FormControl } from "react-bootstrap";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as db from "./Database";

import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [courses, setCourses] = useState<any[]>(db.courses);
    const [enrollments, setEnrollments] = useState<any[]>(db.enrollments);
    const [course, setCourse] = useState<any>({
        _id: "0", name: "New Course", description: "New Description"
    });

    const addNewCourse = () => {
        const newCourse = { ...course, _id: uuidv4() };
        setCourses([...courses, newCourse]);
    };

    const deleteCourse = (courseId: string) => {
        setCourses(courses.filter((course) => course._id !== courseId));
    };

    const updateCourse = () => {
        setCourses(
            courses.map((c) => (c._id === course._id ? course : c))
        );
    };

    const toggleEnrollment = (courseId: string) => {
        const isEnrolled = enrollments.some(
            (e) => e.user === currentUser?._id && e.course === courseId
        );

        if (isEnrolled) {
            setEnrollments(enrollments.filter((e) => !(e.user === currentUser?._id && e.course === courseId)));
        } else {
            const newEnrollment = { _id: uuidv4(), user: currentUser?._id, course: courseId };
            setEnrollments([...enrollments, newEnrollment]);
        }
    };

    // Filter courses based on enrollments
    const filteredCourses = currentUser?.role === "STUDENT"
        ? courses.filter(course =>
            enrollments.some(enrollment => enrollment.user === currentUser?._id && enrollment.course === course._id)
        )
        : courses;

    return (
        <div id="dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />

            {currentUser?.role === "FACULTY" && (
                <>
                    <h5>New Course
                        <button
                            className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={addNewCourse}>
                            Add
                        </button>
                        <button
                            className="btn btn-warning float-end me-2"
                            id="wd-update-course-click"
                            onClick={updateCourse}>
                            Update
                        </button>
                    </h5>
                    <br />
                    <FormControl
                        value={course.name}
                        className="mb-2"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                    <FormControl
                        value={course.description}
                        className="mb-2"
                        onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                    <hr />
                </>
            )}

            <h2 id="dashboard-published">Published Courses ({filteredCourses.length})</h2> <hr />
            <div id="dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {filteredCourses.map((course) => {
                        const isEnrolled = enrollments.some(
                            (e) => e.user === currentUser?._id && e.course === course._id
                        );

                        return (
                            <Col className="wd-dashboard-course" key={course._id} style={{ width: "300px" }}>
                                <Card>
                                    <Card.Img variant="top" src={course.image || "/images/reactjs.jpg"} height={160} />
                                    <Card.Body>
                                        <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                            {course.name}
                                        </Card.Title>
                                        <Card.Text className="wd-dashboard-course-description overflow-hidden">
                                            {course.description}
                                        </Card.Text>

                                        {/* Click Go to Navigate */}
                                        <Link to={`/Kambaz/Courses/${course._id}/Home`} className="btn btn-primary">
                                            Go
                                        </Link>

                                        {/* Course Management - Only for Faculty */}
                                        {currentUser?.role === "FACULTY" && (
                                            <>
                                                <button
                                                    id="wd-delete-course-click"
                                                    className="btn btn-danger float-end"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        deleteCourse(course._id);
                                                    }}>
                                                    Delete
                                                </button>
                                                <button
                                                    id="wd-edit-course-click"
                                                    className="btn btn-warning me-2 float-end"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setCourse(course);
                                                    }}>
                                                    Edit
                                                </button>
                                            </>
                                        )}

                                        {/* Enrollment/Unenrollment Buttons - Only for Students */}
                                        {currentUser?.role === "STUDENT" && (
                                            <button
                                                className={`btn ${isEnrolled ? "btn-danger" : "btn-success"} float-end`}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    toggleEnrollment(course._id);
                                                }}>
                                                {isEnrolled ? "Unenroll" : "Enroll"}
                                            </button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
}