import { Link } from "react-router-dom";
import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleEnrollment } from "./Account/enrollmentReducer";
import * as db from "./Database";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const enrollments = useSelector((state: any) => state.peopleReducer.enrollments || []);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [courses, setCourses] = useState<any[]>(db.courses);
    const [course, setCourse] = useState<any>({ _id: "0", name: "New Course", description: "New Description" });
    const addNewCourse = () => {
        const newCourse = { ...course, _id: uuidv4() };
        setCourses([...courses, newCourse]);
    };
    const deleteCourse = (courseId: string) => {
        setCourses(courses.filter((course) => course._id !== courseId));
    };
    const updateCourse = () => {
        setCourses(courses.map((c) => (c._id === course._id ? course : c)));
    };
    const handleEnrollment = (courseId: string) => {
        dispatch(toggleEnrollment({ userId: currentUser?._id, courseId }));
    };
    const filteredCourses = showAllCourses
        ? courses
        : courses.filter(course =>
            enrollments.some(enrollment => enrollment.user === currentUser?._id && enrollment.course === course._id)
        );

    return (
        <div id="dashboard">
            <div>
                <h1 id="wd-dashboard-title">Dashboard</h1>
                <Button
                    variant="primary"
                    className="float-end"
                    style={{ marginBottom: "10px", marginTop: "-10px" }}
                    onClick={() => setShowAllCourses(!showAllCourses)}
                >
                    {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
                </Button>
                <hr />
            </div>
            {currentUser?.role === "FACULTY" && (
                <>
                    <h5>New Course
                        <Button className="btn btn-primary float-end" onClick={addNewCourse}>Add</Button>
                        <Button className="btn btn-warning float-end me-2" onClick={updateCourse}>Update</Button>
                    </h5>
                    <br />
                    <FormControl value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                    <FormControl value={course.description} className="mb-2" onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                    <hr />
                </>
            )}

            <h2 id="dashboard-published">Published Courses ({filteredCourses.length})</h2>
            <hr />
            <Row xs={1} md={5} className="g-4">
                {filteredCourses.map((course) => {
                    const isEnrolled = enrollments.some(
                        (e) => e.user === currentUser?._id && e.course === course._id
                    );

                    return (
                        <Col key={course._id} style={{ width: "300px" }}>
                            <Card>
                                <Card.Img variant="top" src={course.image || "/images/reactjs.jpg"} height={160} />
                                <Card.Body>
                                    <Card.Title className="text-nowrap overflow-hidden">{course.name}</Card.Title>
                                    <Card.Text className="overflow-hidden" style={{ height: "100px" }}>{course.description}</Card.Text>
                                    {isEnrolled ? (
                                        <Link to={`/Kambaz/Courses/${course._id}/Home`} className="btn btn-primary">Go</Link>
                                    ) : (
                                        <Button disabled className="btn btn-secondary">Locked</Button>
                                    )}
                                    <Button
                                        className={`btn float-end ${isEnrolled ? "btn-danger" : "btn-success"}`}
                                        onClick={() => handleEnrollment(course._id)}
                                    >
                                        {isEnrolled ? "Unenroll" : "Enroll"}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}