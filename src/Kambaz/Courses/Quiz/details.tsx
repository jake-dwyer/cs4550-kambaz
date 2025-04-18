import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Alert } from "react-bootstrap";
import * as quizClient from "./client";
import { useSelector } from "react-redux";

export default function QuizDetails() {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [attemptedStart, setAttemptedStart] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const q = await quizClient.findQuizById(qid!);
        setQuiz(q);
      } catch (err) {
        setError("Could not load quiz.");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [qid]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error || !quiz) return <div className="text-danger p-4">{error || "Quiz not found."}</div>;

  const now = new Date();
  const availableFrom = quiz.availability?.availableFrom ? new Date(quiz.availability.availableFrom) : null;
  const availableUntil = quiz.availability?.availableUntil ? new Date(quiz.availability.availableUntil) : null;
  const isAvailable =
    quiz.published &&
    (!availableFrom || now >= availableFrom) &&
    (!availableUntil || now <= availableUntil);

  const userAttempts = quiz.attempts?.filter((a: any) => a.student === currentUser?._id) || [];
  const remainingAttempts = quiz.settings?.howManyAttempts - userAttempts.length;
  const isAccessCodeCorrect = !quiz.settings?.accessCode || quiz.settings.accessCode === accessCode;
  const latestAttempt = userAttempts[userAttempts.length - 1];
  const latestScore = latestAttempt?.score;
  const latestAnswers = latestAttempt?.answers || [];

  const handleStartQuiz = () => {
    setAttemptedStart(true);
    if (isAvailable && remainingAttempts > 0 && isAccessCodeCorrect) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>
      <div className="mb-3" dangerouslySetInnerHTML={{ __html: quiz.description }} />

      <p><strong>Points:</strong> {quiz.points}</p>
      <p><strong>Due:</strong> {quiz.availability?.dueDate?.slice(0, 10) || "N/A"}</p>
      <p><strong>Available:</strong> {quiz.availability?.availableFrom?.slice(0, 10) || "N/A"} - {quiz.availability?.availableUntil?.slice(0, 10) || "N/A"}</p>
      <p><strong>Attempts Left:</strong> {remainingAttempts}</p>
      {userAttempts.length > 0 && (
        <p><strong>Your Last Score:</strong> {latestScore}</p>
      )}

      {quiz.settings?.accessCode && quiz.settings.accessCode !== "" && (
        <div className="mb-3">
          <label className="form-label">Access Code</label>
          <input
            className="form-control"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            type="text"
            placeholder="Enter code"
          />
        </div>
      )}

      {!isAvailable && <Alert variant="warning">This quiz is not currently available.</Alert>}
      {remainingAttempts <= 0 && <Alert variant="danger">You have no remaining attempts.</Alert>}
      {attemptedStart && !isAccessCodeCorrect && quiz.settings?.accessCode && quiz.settings.accessCode !== "" && (
        <Alert variant="danger">Invalid access code.</Alert>
      )}

      {remainingAttempts > 0 ? (
        <Button
          variant="primary"
          disabled={!isAvailable || remainingAttempts <= 0 || !isAccessCodeCorrect}
          onClick={handleStartQuiz}
        >
          Start Quiz
        </Button>
      ) : (
        <div className="mt-4">
          <h4>Review Your Last Attempt</h4>
          {quiz.questions.map((q: any, index: number) => {
            const answer = latestAnswers[index];
            let isCorrect = false;
            if (q.type === "multiple-choice") isCorrect = answer === q.correctChoiceIndex;
            else if (q.type === "true-false") isCorrect = answer === q.correctTrueFalse;
            else if (q.type === "fill-in-the-blank") isCorrect = q.possibleAnswers?.map((a: string) => a.toLowerCase()).includes((answer || '').toLowerCase());

            return (
              <div key={q._id} className="border p-3 mb-3">
                <strong>{q.title}</strong>
                <p>{q.questionText}</p>

                <p><strong>Your Answer:</strong> {q.type === "multiple-choice" ? q.choices[answer] : answer?.toString()}</p>
                <p className={isCorrect ? "text-success" : "text-danger"}>{isCorrect ? "✔ Correct" : "✘ Incorrect"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
