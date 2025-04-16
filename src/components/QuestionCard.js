import React from "react";
import { useDropzone } from "react-dropzone";

const QuestionCard = ({ index, question, updateQuestion, deleteQuestion }) => {
  const handleDrop = (acceptedFiles) => {
    updateQuestion(index, "media", URL.createObjectURL(acceptedFiles[0]));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, video/*",
    onDrop: handleDrop,
  });

  return (
    <div className="question-card">
      <div className="question-card-header">
        <h3>Question {index + 1}</h3>
      </div>

      <div className="input-group">
        <input
          type="text"
          className={`input ${!question.title.trim() ? "input-error" : ""}`}
          placeholder="Problem Title (required)"
          value={question.title}
          onChange={(e) => updateQuestion(index, "title", e.target.value)}
        />
        <textarea
          className={`input ${!question.description.trim() ? "input-error" : ""}`}
          placeholder="Problem Description (required)"
          value={question.description}
          onChange={(e) => updateQuestion(index, "description", e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          type="text"
          className={`input ${!question.sampleInput.trim() ? "input-error" : ""}`}
          placeholder="Sample Input (required)"
          value={question.sampleInput}
          onChange={(e) => updateQuestion(index, "sampleInput", e.target.value)}
        />
        <input
          type="text"
          className={`input ${!question.expectedOutput.trim() ? "input-error" : ""}`}
          placeholder="Expected Output (required)"
          value={question.expectedOutput}
          onChange={(e) => updateQuestion(index, "expectedOutput", e.target.value)}
        />
      </div>

      <div className="upload-section" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop an image or video, or click to select files</p>
      </div>

      <p>{question.media ? `Uploaded: ${question.media}` : "No file uploaded yet."}</p>
      <button
          className="button-delete"
          onClick={() => deleteQuestion(index)}
        >
          🗑️ Delete Question
        </button>
    </div>
  );
};

export default QuestionCard;
