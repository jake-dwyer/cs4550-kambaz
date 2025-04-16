import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button, Form } from "react-bootstrap";
import * as quizClient from "./client";

export default function PreviewQuiz() {
  const { qid } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizClient.findQuizById(qid);
        setQuiz(data);
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [qid]);

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = () => {
    if (!quiz) return;

    const calculatedScore = quiz.questions.reduce((sum, q, index) => {
      const answer = answers[index];
      if (q.type === "multiple-choice" && q.correctChoiceIndex === answer) return sum + q.points;
      if (q.type === "true-false" && q.correctTrueFalse === answer) return sum + q.points;
      if (
        q.type === "fill-in-the-blank" &&
        q.possibleAnswers?.some((ans) => ans.toLowerCase() === (answer || "").toLowerCase())
      ) return sum + q.points;
      return sum;
    }, 0);

    setSubmitted(true);
    setScore(calculatedScore);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-danger p-4">{error}</div>;
  if (!quiz) return <div className="p-4">Quiz not found.</div>;

  return (
    <div className="container mt-4">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate(`/Kambaz/Courses/${quiz.course}/Quizzes`)}
      >
        ← Back to Quizzes
      </Button>

      <h2>{quiz.title} (Preview)</h2>
      <p className="text-muted">This is a preview mode. Your answers will not be saved.</p>

      {quiz.questions.map((q, index) => (
        <div key={index} className="border p-3 mb-3">
          <strong>{q.title}</strong>
          <p>{q.questionText}</p>

          {q.type === "multiple-choice" && q.choices.map((choice, i) => (
            <Form.Check
              key={i}
              type="radio"
              label={choice}
              name={`q-${index}`}
              checked={answers[index] === i}
              onChange={() => handleChange(index, i)}
              isValid={submitted && i === q.correctChoiceIndex}
              isInvalid={submitted && answers[index] === i && i !== q.correctChoiceIndex}
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
                isValid={submitted && q.correctTrueFalse === true}
                isInvalid={submitted && answers[index] === true && !q.correctTrueFalse}
              />
              <Form.Check
                type="radio"
                label="False"
                name={`q-${index}`}
                checked={answers[index] === false}
                onChange={() => handleChange(index, false)}
                isValid={submitted && q.correctTrueFalse === false}
                isInvalid={submitted && answers[index] === false && q.correctTrueFalse !== false}
              />
            </>
          )}

          {q.type === "fill-in-the-blank" && (
            <Form.Control
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              isValid={
                submitted && q.possibleAnswers?.some(
                  (ans) => ans.toLowerCase() === (answers[index] || "").toLowerCase()
                )
              }
              isInvalid={
                submitted && !q.possibleAnswers?.some(
                  (ans) => ans.toLowerCase() === (answers[index] || "").toLowerCase()
                )
              }
            />
          )}
        </div>
      ))}

      {!submitted ? (
        <Button variant="success" onClick={handleSubmit}>Submit Preview</Button>
      ) : (
        <div className="alert alert-info mt-4">
          <h4>Preview Score: {score}</h4>
          <Button onClick={() => navigate(`/Kambaz/Courses/${quiz.course}/Quizzes`)}>Back to Quizzes</Button>
        </div>
      )}
    </div>
  );
}
