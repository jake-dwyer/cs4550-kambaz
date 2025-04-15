import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as quizClient from "./client";

export default function TakeQuiz() {
  const { qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizClient.findQuizById(qid!);
        setQuiz(data);
        setError(null);
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError("Could not load quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (qid) fetchQuiz();
  }, [qid]);

  const handleChange = (questionIndex: number, value: any) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const handleSubmit = async () => {
    if (!quiz || !currentUser) return;
  
    const score = Object.entries(answers).reduce((sum, [qid, ans]) => {
      const q = quiz.questions.find((q: any) => q._id === qid);
      if (!q) return sum;
  
      if (q.type === "multiple-choice" && q.correctChoiceIndex === ans) {
        return sum + q.points;
      } else if (q.type === "true-false" && q.correctTrueFalse === ans) {
        return sum + q.points;
      } else if (
        q.type === "fill-in-the-blank" &&
        q.possibleAnswers?.map((a: string) => a.toLowerCase()).includes(ans.toLowerCase())
      ) {
        return sum + q.points;
      }
      return sum;
    }, 0);
  
    try {
      const existing = await quizClient.findQuizById(qid!);
      const userAttempts = existing.attempts?.filter((a: any) => a.student === currentUser._id) || [];
      const limit = existing.settings?.howManyAttempts || 1;
  
      if (userAttempts.length >= limit) {
        alert("You have already used all your allowed attempts.");
        return;
      }
  
      const updated = {
        ...existing,
        attempts: [
          ...(existing.attempts || []),
          {
            student: currentUser._id,
            answers: Object.values(answers),
            score,
            takenAt: new Date(),
          },
        ],
      };
  
      await quizClient.updateQuiz(updated);
      setSubmitted(true);
      setScore(score);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (loading) return <div className="p-4">Loading quiz...</div>;
  if (error) return <div className="text-danger p-4">{error}</div>;
  if (!quiz) return <div className="p-4">Quiz not found.</div>;

  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>
      {quiz.questions.map((q: any, index: number) => (
        <div key={index} className="border p-3 mb-3">
          <strong>{q.title}</strong>
          <p>{q.questionText}</p>

          {q.type === "multiple-choice" &&
            q.choices.map((choice: string, cIndex: number) => (
              <Form.Check
                key={cIndex}
                type="radio"
                label={choice}
                name={`q-${index}`}
                checked={answers[index] === cIndex}
                onChange={() => handleChange(index, cIndex)}
              />
            ))}

          {q.type === "true-false" && (
            <>
              <Form.Check
                type="radio"
                label="True"
                name={`q-${index}`}
                checked={answers[index] === true}
                onChange={() => handleChange(index, true)}
              />
              <Form.Check
                type="radio"
                label="False"
                name={`q-${index}`}
                checked={answers[index] === false}
                onChange={() => handleChange(index, false)}
              />
            </>
          )}

          {q.type === "fill-in-the-blank" && (
            <Form.Control
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          )}
        </div>
      ))}

      {!submitted ? (
        <Button variant="success" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      ) : (
        <div className="alert alert-info mt-4">
          <h4>Your score: {score}</h4>
          <Button variant="primary" onClick={() => navigate(`/Kambaz/Courses/${quiz.course}/Quizzes`)}>
            Back to Quizzes
          </Button>
        </div>
      )}
    </div>
  );
}
