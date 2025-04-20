import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Nav, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as quizClient from "./client";
import { addQuiz, updateQuiz } from "./reducer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
      const updatedQuiz = { ...quiz };
      if (existingQuiz) {
        const updated = await quizClient.updateQuiz(updatedQuiz);
        dispatch(updateQuiz(updated));
      } else {
        const created = await quizClient.createQuiz(cid!, updatedQuiz);
        dispatch(addQuiz(created));
      }
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (err) {
      console.error("Error saving quiz:", err);
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

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleQuestionChange = (index: number, updatedQuestion: any) => {
    const updatedQuestions = quiz.questions.map((q: any, i: number) =>
      i === index ? updatedQuestion : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  if (!currentUser) return <div className="p-4">Unauthorized</div>;
  if (!canEdit && !existingQuiz?.published) return <div className="p-4">This quiz is not available yet.</div>;

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
        <Form.Label className="mt-2">Description</Form.Label>
        <ReactQuill
          theme="snow"
          value={quiz.description}
          onChange={(value) => setQuiz({ ...quiz, description: value })}
          className="bg-white"
        />
        <Form.Label className="mt-3">Total Points</Form.Label>
        <div className="form-control-plaintext">
          {quiz.questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0)}
        </div>
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
            <Form.Label className="mt-2">Quiz Type</Form.Label>
            <Form.Select
              value={quiz.quizType}
              onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
            >
              <option value="Graded Quiz">Graded Quiz</option>
              <option value="Practice Quiz">Practice Quiz</option>
              <option value="Graded Survey">Graded Survey</option>
              <option value="Ungraded Survey">Ungraded Survey</option>
            </Form.Select>

            <Form.Label className="mt-2">Assignment Group</Form.Label>
            <Form.Select
              value={quiz.assignmentGroup}
              onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
            >
              <option value="Quizzes">Quizzes</option>
              <option value="Exams">Exams</option>
              <option value="Assignments">Assignments</option>
              <option value="Project">Project</option>
            </Form.Select>

            <Form.Check
              type="checkbox"
              label="Lock Questions After Answering"
              checked={quiz.settings.lockAfterAnswering}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  settings: {
                    ...quiz.settings,
                    lockAfterAnswering: e.target.checked,
                  },
                })
              }
            />

            <Form.Check
              type="checkbox"
              label="Show Correct Answers"
              checked={quiz.settings.showCorrectAnswers}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  settings: {
                    ...quiz.settings,
                    showCorrectAnswers: e.target.checked,
                  },
                })
              }
            />

            <Form.Check
              type="checkbox"
              label="Webcam Required"
              checked={quiz.settings.webcamRequired}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  settings: {
                    ...quiz.settings,
                    webcamRequired: e.target.checked,
                  },
                })
              }
            />
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
              onChange={(e) =>
                setQuiz({ ...quiz, settings: { ...quiz.settings, howManyAttempts: parseInt(e.target.value || "1") } })
              }
            />
            <Form.Label className="mt-2">Time Limit (minutes)</Form.Label>
            <Form.Control
              type="number"
              value={quiz.settings.timeLimit}
              onChange={(e) =>
                setQuiz({ ...quiz, settings: { ...quiz.settings, timeLimit: parseInt(e.target.value || "20") } })
              }
            />
            <Form.Label className="mt-2">Access Code (optional)</Form.Label>
            <Form.Control
              type="text"
              value={quiz.settings.accessCode}
              onChange={(e) =>
                setQuiz({ ...quiz, settings: { ...quiz.settings, accessCode: e.target.value } })
              }
            />
            <Form.Check
              type="checkbox"
              label="One Question at a Time"
              checked={quiz.settings.oneQuestionAtATime}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  settings: {
                    ...quiz.settings,
                    oneQuestionAtATime: e.target.checked,
                  },
                })
              }
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Control
                  type="text"
                  placeholder="Question Title"
                  className="me-2"
                  value={q.title}
                  onChange={(e) => handleQuestionChange(index, { ...q, title: e.target.value })}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  ✕
                </Button>
              </div>
              <Form.Select
                className="mb-2"
                value={q.type}
                onChange={(e) => handleQuestionChange(index, { ...q, type: e.target.value })}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="fill-in-the-blank">Fill in the Blank</option>
              </Form.Select>
              <div className="mb-2">
                <Form.Label>Question Text</Form.Label>
                <ReactQuill
                  theme="snow"
                  value={q.questionText || ""}
                  onChange={(val) => handleQuestionChange(index, { ...q, questionText: val })}
                />
              </div>
              <Form.Control
                type="number"
                placeholder="Points"
                className="mb-2"
                value={q.points || 1}
                onChange={(e) => handleQuestionChange(index, { ...q, points: parseInt(e.target.value || "1") })}
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
                      <div className="d-flex align-items-center w-100">
                        <Form.Control
                          className="me-2"
                          value={choice}
                          onChange={(e) => {
                            const newChoices = [...q.choices];
                            newChoices[cIndex] = e.target.value;
                            handleQuestionChange(index, { ...q, choices: newChoices });
                          }}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            const newChoices = q.choices.filter((_, i) => i !== cIndex);
                            handleQuestionChange(index, {
                              ...q,
                              choices: newChoices,
                              correctChoiceIndex: q.correctChoiceIndex >= newChoices.length ? 0 : q.correctChoiceIndex,
                            });
                          }}
                        >
                          ✕
                        </Button>
                      </div>
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
{/*  If we wanted a save button per problem we'd just do this             
                    <Button
                    size="sm"
                    className="mt-2"
                    variant="outline-primary"
                    onClick={async () => {
                      try {
                        const updatedQuiz = {
                          ...quiz,
                          questions: [...quiz.questions],
                        };
                        await quizClient.updateQuiz(updatedQuiz);
                      } catch (err) {
                        console.error("Error saving individual question:", err);
                      }
                    }}
                  >
                    Save Question
                  </Button> */}
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
                    <div className="d-flex align-items-center mb-2" key={aIndex}>
                      <Form.Control
                        className="me-2"
                        value={ans}
                        onChange={(e) => {
                          const updated = [...(q.possibleAnswers || [])];
                          updated[aIndex] = e.target.value;
                          handleQuestionChange(index, { ...q, possibleAnswers: updated });
                        }}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          const updated = (q.possibleAnswers || []).filter((_, i) => i !== aIndex);
                          handleQuestionChange(index, { ...q, possibleAnswers: updated });
                        }}
                      >
                        ✕
                      </Button>
                    </div>
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
        <Button
          className="ms-2"
          variant="success"
          onClick={async () => {
            try {
              const updatedQuiz = { ...quiz, published: true };

              let finalQuiz;
              if (existingQuiz) {
                finalQuiz = await quizClient.updateQuiz(updatedQuiz);
                dispatch(updateQuiz(finalQuiz));
              } else {
                finalQuiz = await quizClient.createQuiz(cid!, updatedQuiz);
                dispatch(addQuiz(finalQuiz));
              }

              await quizClient.publishQuiz(finalQuiz._id, true);
              navigate(`/Kambaz/Courses/${cid}/Quizzes`);
            } catch (err) {
              console.error("Error saving & publishing quiz:", err);
            }
          }}
        >
          Save & Publish
        </Button>
      </div>
    </div>
  );
}