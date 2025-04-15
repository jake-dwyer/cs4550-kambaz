import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Nav, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as quizClient from "./client";
import { addQuiz, updateQuiz } from "./reducer";

export default function Editor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quizzes = useSelector((state: any) => state.quizzesReducer?.quizzes || []);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const canEdit = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY");

  const existingQuiz = quizzes.find((q: any) => q._id === qid);

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>({
    _id: qid || "",
    title: existingQuiz?.title || "Untitled Quiz",
    description: existingQuiz?.description || "",
    course: cid,
    createdBy: currentUser?._id,
    quizType: existingQuiz?.quizType || "Graded Quiz",
    assignmentGroup: existingQuiz?.assignmentGroup || "Quizzes",
    points: existingQuiz?.points || 0,
    settings: existingQuiz?.settings || {
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: false,
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockAfterAnswering: false,
    },
    availability: existingQuiz?.availability || {
      dueDate: "",
      availableFrom: "",
      availableUntil: "",
    },
    questions: existingQuiz?.questions || [],
    attempts: existingQuiz?.attempts || [],
  });

  useEffect(() => {
    if (existingQuiz) setQuiz(existingQuiz);
  }, [existingQuiz]);

  const handleSave = async () => {
    try {
      if (existingQuiz) {
        const updated = await quizClient.updateQuiz(quiz);
        dispatch(updateQuiz(updated));
      } else {
        const created = await quizClient.createQuiz(cid!, quiz);
        dispatch(addQuiz(created));
      }
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (err) {
      console.error("❌ Error saving quiz:", err);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      type: "multiple-choice",
      title: "New Question",
      points: 1,
      questionText: "",
      choices: ["Option 1", "Option 2"],
      correctChoiceIndex: 0,
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const handleQuestionChange = (index: number, updatedQuestion: any) => {
    const updatedQuestions = quiz.questions.map((q: any, i: number) =>
      i === index ? updatedQuestion : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  if (!currentUser) return <div className="p-4">Unauthorized</div>;
  if (!canEdit && !existingQuiz?.published) return <div className="p-4">This quiz is not available yet.</div>;

  if (!canEdit) {
    return (
      <div className="p-4">
        <h2>{existingQuiz?.title}</h2>
        <p>{existingQuiz?.description}</p>
        <Button onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`)}>
          Take Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4 p-4">
      <h2>Edit Quiz</h2>
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
        <Nav.Item>
          <Nav.Link eventKey="details">Details</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="questions">Questions</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "details" ? (
        <>
          <input
            className="form-control mt-3"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />
          <textarea
            className="form-control mt-2"
            rows={4}
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />
          <label className="form-label mt-3">Points</label>
          <input
            type="number"
            className="form-control"
            value={quiz.points}
            onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value || "0") })}
          />
          <label className="form-label mt-3">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={quiz.availability.dueDate}
            onChange={(e) =>
              setQuiz({ ...quiz, availability: { ...quiz.availability, dueDate: e.target.value } })
            }
          />
          <label className="form-label mt-3">Available From</label>
          <input
            type="date"
            className="form-control"
            value={quiz.availability.availableFrom}
            onChange={(e) =>
              setQuiz({ ...quiz, availability: { ...quiz.availability, availableFrom: e.target.value } })
            }
          />
          <label className="form-label mt-3">Available Until</label>
          <input
            type="date"
            className="form-control"
            value={quiz.availability.availableUntil}
            onChange={(e) =>
              setQuiz({ ...quiz, availability: { ...quiz.availability, availableUntil: e.target.value } })
            }
          />

          <div className="mt-4">
            <h5>Settings</h5>
            <Form.Check
              type="checkbox"
              label="Shuffle Answers"
              checked={quiz.settings.shuffleAnswers}
              onChange={(e) => setQuiz({ ...quiz, settings: { ...quiz.settings, shuffleAnswers: e.target.checked } })}
            />
            <Form.Check
              type="checkbox"
              label="Multiple Attempts"
              checked={quiz.settings.multipleAttempts}
              onChange={(e) => setQuiz({ ...quiz, settings: { ...quiz.settings, multipleAttempts: e.target.checked } })}
            />
            <Form.Label className="mt-2">How Many Attempts</Form.Label>
            <Form.Control
              type="number"
              value={quiz.settings.howManyAttempts}
              onChange={(e) => setQuiz({ ...quiz, settings: { ...quiz.settings, howManyAttempts: parseInt(e.target.value || "1") } })}
            />
            <Form.Label className="mt-2">Time Limit (minutes)</Form.Label>
            <Form.Control
              type="number"
              value={quiz.settings.timeLimit}
              onChange={(e) => setQuiz({ ...quiz, settings: { ...quiz.settings, timeLimit: parseInt(e.target.value || "20") } })}
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <Button variant="primary" onClick={handleAddQuestion} className="mb-3">
            + New Question
          </Button>
          {quiz.questions.map((q: any, index: number) => (
            <div key={index} className="border p-3 mb-3">
              <Form.Control
                type="text"
                placeholder="Question Title"
                className="mb-2"
                value={q.title}
                onChange={(e) =>
                  handleQuestionChange(index, { ...q, title: e.target.value })
                }
              />
              <Form.Select
                className="mb-2"
                value={q.type}
                onChange={(e) => handleQuestionChange(index, { ...q, type: e.target.value })}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="fill-in-the-blank">Fill in the Blank</option>
              </Form.Select>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Question Text"
                className="mb-2"
                value={q.questionText || ""}
                onChange={(e) =>
                  handleQuestionChange(index, { ...q, questionText: e.target.value })
                }
              />
              <Form.Control
                type="number"
                placeholder="Points"
                className="mb-2"
                value={q.points || 1}
                onChange={(e) =>
                  handleQuestionChange(index, { ...q, points: parseInt(e.target.value || "1") })
                }
              />
              {q.type === "multiple-choice" && (
                <>
                  {q.choices?.map((choice: string, cIndex: number) => (
                    <div key={cIndex} className="d-flex mb-2 align-items-center">
                      <Form.Check
                        type="radio"
                        name={`correct-${index}`}
                        className="me-2"
                        checked={q.correctChoiceIndex === cIndex}
                        onChange={() =>
                          handleQuestionChange(index, { ...q, correctChoiceIndex: cIndex })
                        }
                      />
                      <Form.Control
                        value={choice}
                        onChange={(e) => {
                          const newChoices = [...q.choices];
                          newChoices[cIndex] = e.target.value;
                          handleQuestionChange(index, { ...q, choices: newChoices });
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={() =>
                      handleQuestionChange(index, {
                        ...q,
                        choices: [...q.choices, `Option ${q.choices.length + 1}`],
                      })
                    }
                  >
                    + Add Choice
                  </Button>
                </>
              )}
              {q.type === "true-false" && (
                <Form.Check
                  type="checkbox"
                  label="Correct answer is True"
                  checked={q.correctTrueFalse === true}
                  onChange={(e) =>
                    handleQuestionChange(index, { ...q, correctTrueFalse: e.target.checked })
                  }
                />
              )}
              {q.type === "fill-in-the-blank" && (
                <>
                  {(q.possibleAnswers || []).map((ans: string, aIndex: number) => (
                    <Form.Control
                      key={aIndex}
                      className="mb-2"
                      value={ans}
                      onChange={(e) => {
                        const updated = [...(q.possibleAnswers || [])];
                        updated[aIndex] = e.target.value;
                        handleQuestionChange(index, { ...q, possibleAnswers: updated });
                      }}
                    />
                  ))}
                  <Button
                    size="sm"
                    onClick={() =>
                      handleQuestionChange(index, {
                        ...q,
                        possibleAnswers: [...(q.possibleAnswers || []), ""],
                      })
                    }
                  >
                    + Add Answer
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-end mt-4">
        <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
          Cancel
        </Button>
        <Button className="ms-2" variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}