import { Link } from "react-router-dom";
import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleEnrollment } from "./Account/enrollmentReducer";
import { addCourse, deleteCourse, updateCourse } from "./Courses/reducer";
import * as enrollmentClient from "./Account/enrollmentClient";
import { setEnrollments } from "./Account/enrollmentReducer";
import { setCourses } from "./Courses/reducer";
import * as courseClient from "./Courses/client";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const enrollments = useSelector((state: any) => state.peopleReducer.enrollments || []);
  const courses = useSelector((state: any) => state.coursesReducer.courses || []);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    description: "New Description",
    image: "/images/reactjs.jpg",
  });
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser?._id) {
        const userEnrollments = await enrollmentClient.findEnrollmentsForUser(currentUser._id);
        dispatch(setEnrollments(userEnrollments));
      }
    };
    fetchEnrollments();
  }, [currentUser]);  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await courseClient.fetchAllCourses();
        dispatch(setCourses(courses));
      } catch (e) {
        console.error("Failed to fetch courses", e);
      }
    };
  
    fetchCourses();
  }, []);  

  const addNewCourse = async () => {
    const newCourse = {
      name: course.name,
      description: course.description,
      image: course.image,
    };
  
    const created = await courseClient.createCourse(newCourse);
    dispatch(addCourse(created));
  
    setCourse({ name: "New Course", description: "New Description", image: "/images/reactjs.jpg" });
  };

  const updateExistingCourse = async () => {
    const updated = await courseClient.updateCourse(course);
    dispatch(updateCourse(updated));
    setCourse({ _id: "0", name: "New Course", description: "New Description", image: "/images/reactjs.jpg" });
  };
  

  const handleDelete = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    dispatch(deleteCourse(courseId));
  };  

  const handleEnrollment = async (courseId: string) => {
    const isEnrolled = enrollments.some(
      (e) => e.user === currentUser?._id && e.course === courseId
    );
  
    if (isEnrolled) {
      await enrollmentClient.unenroll(currentUser._id, courseId);
    } else {
      await enrollmentClient.enroll(currentUser._id, courseId);
    }
  
    const updatedEnrollments = await enrollmentClient.findEnrollmentsForUser(currentUser._id);
    dispatch(setEnrollments(updatedEnrollments));
  };  

  const filteredCourses =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN"
      ? courses
      : showAllCourses
      ? courses
      : courses.filter(course =>
          enrollments.some(
            enrollment => enrollment.user === currentUser?._id && enrollment.course === course._id
          )
        );

  return (
    <div id="dashboard">
      <div>
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {!(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") && (
          <Button
            variant="primary"
            className="float-end"
            style={{ marginBottom: "10px", marginTop: "-10px" }}
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
          </Button>
        )}
        <hr />
      </div>
      {(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") && (
        <>
          <h5>
            New Course
            <Button className="btn btn-primary float-end" onClick={addNewCourse}>
              Add
            </Button>
            <Button className="btn btn-warning float-end me-2" onClick={updateExistingCourse}>
              Update
            </Button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}
      <h2 id="dashboard-published">Published Courses ({filteredCourses.length})</h2>
      <hr />
      <Row xs={1} md={5} className="g-4">
        {filteredCourses.map((courseItem) => {
          const isEnrolled = enrollments.some(
            (e) => e.user === currentUser?._id && e.course === courseItem._id
          );
          return (
            <Col key={courseItem._id} style={{ width: "300px" }}>
              <Card>
                <Card.Img
                  variant="top"
                  src={courseItem.image || "/images/reactjs.jpg"}
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="text-nowrap overflow-hidden">
                    {courseItem.name}
                  </Card.Title>
                  <Card.Text className="overflow-hidden" style={{ height: "100px" }}>
                    {courseItem.description}
                  </Card.Text>
                  {(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") ? (
                    <>
                      <Link
                        to={`/Kambaz/Courses/${courseItem._id}/Home`}
                        className="btn btn-primary"
                      >
                        Go
                      </Link>
                      <Button
                        className="btn btn-warning ms-2"
                        onClick={() => setCourse(courseItem)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn btn-danger ms-2"
                        onClick={() => handleDelete(courseItem._id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      {isEnrolled ? (
                        <Link
                          to={`/Kambaz/Courses/${courseItem._id}/Home`}
                          className="btn btn-primary"
                        >
                          Go
                        </Link>
                      ) : (
                        <Button disabled className="btn btn-secondary">
                          Locked
                        </Button>
                      )}
                      <Button
                        className={`btn float-end ${isEnrolled ? "btn-danger" : "btn-success"}`}
                        onClick={() => handleEnrollment(courseItem._id)}
                      >
                        {isEnrolled ? "Unenroll" : "Enroll"}
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}