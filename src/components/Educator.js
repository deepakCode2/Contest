import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Educator.css";
import QuestionCard from "./QuestionCard";
import { RiFlashlightFill } from "react-icons/ri";
import { LogOut as LucideLogOut } from "lucide-react";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState([]);
  const [educatorName, setEducatorName] = useState("");
  const [contestName, setContestName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("../");
    }, 3000);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const toggleContestStatus = (id) => {
    setContests((prevContests) =>
      prevContests.map((contest) =>
        contest.id === id
          ? {
              ...contest,
              status: contest.status === "active" ? "inactive" : "active",
            }
          : contest
      )
    );
  };

  const handleCreateContest = () => {
    if (contestName.trim() === "") {
      setError("Contest name is required.");
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (questions.length === 0) {
      setError("At least one question must be added to the contest.");
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const { title, description, sampleInput, expectedOutput } = questions[i];
      if (!title || !description || !sampleInput || !expectedOutput) {
        setError(`Please complete all required fields for Question ${i + 1}.`);
        formRef.current.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    const newContest = {
      id: contests.length + 1,
      name: contestName,
      questions,
      createdAt: new Date().toLocaleString(),
      status: "inactive", // Default status is inactive
    };

    setContests([newContest, ...contests]);
    setContestName("");
    setQuestions([]);
    setError("");
    setSuccessMessage("✅ Contest created successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleAddQuestion = () => {
    if (contestName.trim() === "") {
      setError("Please enter a contest name before adding questions.");
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setQuestions([
      ...questions,
      {
        title: "",
        description: "",
        sampleInput: "",
        expectedOutput: "",
        media: "",
      },
    ]);

    // Clear error message when adding a question
    setError("");
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
    const { title, description, sampleInput, expectedOutput } =
      updatedQuestions[index];
    if (
      contestName.trim() !== "" &&
      title.trim() &&
      description.trim() &&
      sampleInput.trim() &&
      expectedOutput.trim()
    ) {
      setError("");
    }
  };

  const deleteContest = (contestId) => {
    if (window.confirm("Are you sure you want to end this contest?")) {
      const updatedContests = contests.filter(
        (contest) => contest.id !== contestId
      );
      setContests(updatedContests);
    }
  };

  const viewSubmissions = (contestId) => {
    alert(`Viewing submissions for Contest ID: ${contestId}`);
  };

  return (
    <div className="dashboard">
      <div className="logout-container">
        <button
          className="logout-button flex items-center"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <span className="loader mr-2"></span>
          ) : (
            <LucideLogOut size={15} style={{ marginRight: "8px" }} />
          )}
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      <h1 className="title">
        <RiFlashlightFill
          size={28}
          strokeWidth={2}
          style={{ marginRight: "10px" }}
        />
        Educator Dashboard
      </h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          <span className="plus-circle">➕</span>
          Create Contest
        </button>

        <button
          className={`tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          📋 Created Contests
        </button>
      </div>

      {activeTab === "create" && (
        <div className="form-container" ref={formRef}>
          <h2 className="form-title">New Contest</h2>

          {error && <p className="error-message">{error}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <div className="form-row">
            <input
              type="text"
              className="input educator-name"
              placeholder="Enter educator name"
              value={educatorName}
              onChange={(e) => setEducatorName(e.target.value)}
            />

            <input
              type="text"
              className={`input contest-name ${error ? "input-error" : ""}`}
              placeholder="Enter contest name"
              value={contestName}
              onChange={(e) => {
                setContestName(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
            />

            <button
              className="button add-question-btn"
              onClick={handleAddQuestion}
            >
              + Add Questions
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {questions.map((q, index) => (
            <QuestionCard
              key={index}
              index={index}
              question={q}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
            />
          ))}

          <div className="button-center">
            <button className="button create-btn" onClick={handleCreateContest}>
              Publish Contest
            </button>
          </div>
        </div>
      )}

      {activeTab === "view" && (
        <div className="card">
          <h2 className="card-title">Created Contests</h2>
          {contests.length === 0 ? (
            <p className="no-contests">No contests created yet.</p>
          ) : (
            <div className="contest-cards-container">
              {contests.map((contest) => (
                <div key={contest.id} className="custom-contest-card">
                  <h3 className="contest-card-title">{contest.name}</h3>
                  <p className="contest-card-subtext">
                    Solve {contest.questions.length} questions of {contest.name}
                  </p>
                  <p className="contest-status">
                    <span
                      className={`status-indicator ${
                        contest.status === "active" ? "active" : "inactive"
                      }`}
                    ></span>
                    {contest.status === "active" ? "Active" : "Inactive"}
                  </p>
                  {/* <div className="card-btn-row"> */}
                    <button
                      className="end-contest-btn"
                      onClick={() => deleteContest(contest.id)}
                    >
                      ⛔ End Contest
                    </button>
                    <button
                      className="view-submissions-btn"
                      onClick={() => viewSubmissions(contest.id)}
                    >
                      📋 View Submissions
                    </button>
                    <button
                      className="toggle-status-btn"
                      onClick={() => toggleContestStatus(contest.id)}
                    >
                      {contest.status === "active"
                        ? "🔕 Deactivate Contest"
                        : "✅ Activate Contest"}
                    </button>
                  </div>
                // </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
