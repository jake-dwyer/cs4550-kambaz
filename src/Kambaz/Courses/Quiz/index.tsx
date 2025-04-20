import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { ListGroup, Button, Dropdown } from "react-bootstrap";
import { setQuizzes, deleteQuiz as deleteQuizAction, updateQuiz } from "./reducer";
import * as quizClient from "./client";
import { RootState } from "../../store";

export default function Quizzes() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const quizzes = useSelector((state: RootState) => state.quizzesReducer?.quizzes || []);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const canEdit = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await quizClient.findQuizzesForCourse(cid!);
        dispatch(setQuizzes(response));
        setError(false);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [cid]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <h2>Loading quizzes...</h2>;
  if (error) return <h2 className="text-danger">Error loading quizzes.</h2>;

  return (
    <div className="container mt-4 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quizzes</h2>
        {canEdit && (
          <Button variant="primary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/new`)}>
            + Quiz
          </Button>
        )}
      </div>
      <ListGroup>
        {quizzes.length === 0 && (
          <div className="text-muted ms-2">No quizzes found. {canEdit && "Click + Quiz to add one."}</div>
        )}
        {quizzes.map((q) => {
          const userAttempts = q.attempts?.filter((a: any) => a.student === currentUser?._id) || [];
          const latestScore = userAttempts[userAttempts.length - 1]?.score;

          const now = new Date();
          const availableFrom = q.availability?.availableFrom ? new Date(q.availability.availableFrom) : null;
          const availableUntil = q.availability?.availableUntil ? new Date(q.availability.availableUntil) : null;

          let availabilityStatus = "Unknown";
          if (!q.published) {
            availabilityStatus = "Unpublished";
          } else if (availableFrom && now < availableFrom) {
            availabilityStatus = `Not available until ${availableFrom.toLocaleDateString("en-US")}`;
          } else if (availableUntil && now > availableUntil) {
            availabilityStatus = "Closed";
          } else {
            availabilityStatus = "Available";
          }

          const publishedIcon = q.published ? "✅" : "🚫";

          return (
            <ListGroup.Item
              key={q._id}
              className="mb-2 border rounded d-flex justify-content-between align-items-start"
            >
              <div
                className="flex-grow-1"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${q._id}/details`)}
              >
                <b className="text-primary">
                  {publishedIcon} {q.title || "Untitled Quiz"}
                </b>
                <div className="text-muted small">
                  {availabilityStatus} | Due: {formatDate(q.availability?.dueDate)} | Available: {formatDate(q.availability?.availableFrom)} - {formatDate(q.availability?.availableUntil)} | Points: {q.points || 0} | Questions: {q.questions?.length || 0}
                  {currentUser?.role === "STUDENT" && userAttempts.length > 0 && ` | Your Score: ${latestScore}`}
                </div>
              </div>
              {canEdit && (
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="sm" />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${q._id}`)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${q._id}/preview`)}>
                      Preview
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this quiz?")) {
                          await quizClient.deleteQuiz(q._id);
                          dispatch(deleteQuizAction(q._id));
                        }
                      }}
                    >
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={async () => {
                        const updated = await quizClient.publishQuiz(q._id, !q.published);
                        dispatch(updateQuiz(updated));
                      }}
                    >
                      {q.published ? "Unpublish" : "Publish"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}