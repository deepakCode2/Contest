import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import SignupPage from "./components/Signup";
import StudentPage from "./components/Student";
import EducatorPage from "./components/Educator";
// import QuestionPage from "./components/QuestionList";
import TestPage from "./components/TestEvaluator";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/educator" element={<EducatorPage />} />
        <Route path="/student" element={<StudentPage />} />
        {/* <Route path="/Question" element={<QuestionPage />} /> */}
        <Route path="/test-platform" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
