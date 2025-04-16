import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuestionList.css";

const questions = [
  { title: "Subset_problem ( Recursion )" },
  { title: "Odd Even Using Recursion" },
  { title: "Mazepath_D ( Count, Print )" },
  { title: "Nth Triangle Recursion" },
];

function QuestionList() {
  const [solvedQuestions, setSolvedQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSolve = (index) => {
    setSolvedQuestions((prev) => ({
      ...prev,
      [index]: true,
    }));

    navigate("/test-platform");
  };

  return (
    <div className="question-list-container">
      <h1>Contest Description</h1>

      {/* Search Bar */}
      <input
        className="search-bar"
        type="text"
        placeholder="Search problems by name..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Render filtered questions */}
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((q, index) => (
          <div key={index} className="question-item">
            <div className="question-content">
              {/* Green tick if solved */}
              {solvedQuestions[index] && (
                <span className="solved-icon">✔️</span>
              )}
              <h3>{q.title}</h3>
            </div>
            <div>
              <button
                className={`solve-button ${solvedQuestions[index] ? "solved" : ""}`}
                onClick={() => handleSolve(index)}
              >
                {solvedQuestions[index] ? "Solved" : "Solve"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No matching problems found.</p>
      )}
    </div>
  );
}

export default QuestionList;
