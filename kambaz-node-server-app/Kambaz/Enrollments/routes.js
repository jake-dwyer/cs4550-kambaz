import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/users/:userId/courses/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    dao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  });

  app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  });

  app.get("/api/users/:userId/courses", (req, res) => {
    const { userId } = req.params;
    const courses = dao.findCoursesForUser(userId);
    res.send(courses);
  });

  app.get("/api/courses/:courseId/users", (req, res) => {
    const { courseId } = req.params;
    const users = dao.findUsersForCourse(courseId);
    res.send(users);
  });

  app.get("/api/enrollments", (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.send(enrollments);
  });

  app.get("/api/enrollments/user/:userId", (req, res) => {
    const { userId } = req.params;
    const userEnrollments = dao.findEnrollmentsForUser(userId);
    res.send(userEnrollments);
  });
  
}
