import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../styles/Signup.css";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { FaCode } from "react-icons/fa";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password rules checking for enabling/disabling submit button
  const isPasswordValid =
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&#]/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!isPasswordValid) {
      alert("Password does not meet strength requirements!");
      return;
    }
    console.log("Signing up with", email, password);
  };

  return (
    <div className="signup-container">
      {/* Left Panel: Lottie Animation */}
      <div className="left-panel">
        <DotLottieReact
          src="https://lottie.host/dc62d82a-bfe7-40da-9a24-f288d2091843/ARq8kqUeNP.lottie"
          loop
          autoplay
        />
      </div>

      {/* Right Panel: Signup Form */}
      <div className="right-panel">
        <h1 className="brand-title">
          <FaCode style={{ marginRight: "5px", marginTop: "10px" }} />
          CodeIQ.ai
        </h1>
        <div className="signup-box">
          <h2>Create an Account</h2>
          <p style={{ marginBottom: "25px", color: "black" }}>
            Sign up to start using our platform!
          </p>
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Email Input */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
              {/* Show rules if password doesn't match all */}
              <PasswordStrengthChecker password={password} />
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`signup-btn ${
                !isPasswordValid || password !== confirmPassword
                  ? "disabled-btn"
                  : ""
              }`}
              disabled={!isPasswordValid || password !== confirmPassword}
            >
              Sign Up Now
            </button>

            <p className="login-text">
              Already have an account? <a href="../login">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
