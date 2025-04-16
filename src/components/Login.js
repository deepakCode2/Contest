import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword } from "./firebase";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { sendPasswordResetEmail } from "firebase/auth";
import "../styles/Login.css";
import { useMsal } from "@azure/msal-react";
import { FaCode } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userRole) {
      setSnackbarMessage("Please select your role before logging in.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (!email || !password) {
      setSnackbarMessage("Email and password are required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Manual login using Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setSnackbarMessage(`Logged in successfully as ${userRole}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirect based on role
        if (userRole === "Student") {
          navigate("/student");
        } else if (userRole === "Educator") {
          navigate("/educator");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
        setSnackbarMessage("Login failed. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleGoogleLogin = async () => {
    if (!userRole) {
      setSnackbarMessage("Please select your role before continuing.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setSnackbarMessage(`Welcome ${user.displayName}!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Redirect after Google login
      if (userRole === "Student") {
        navigate("/student");
      } else if (userRole === "Educator") {
        navigate("/educator");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setSnackbarMessage("Google login failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleMicrosoftLogin = async () => {
    if (!userRole) {
      setSnackbarMessage("Please select your role before continuing.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const loginResponse = await instance.loginPopup({ scopes: ["User.Read"] });
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: loginResponse.account,
      });
      console.log("Token:", tokenResponse.accessToken);

      setSnackbarMessage(`Welcome ${loginResponse.account.name}!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Redirect after Microsoft login
      if (userRole === "Student") {
        navigate("/student");
      } else if (userRole === "Educator") {
        navigate("/educator");
      }
    } catch (error) {
      console.error("Microsoft login error:", error);
      setSnackbarMessage("Microsoft login failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleForgotPasswordClick = () => {
    if (!email.trim()) {
      setSnackbarMessage("Please enter your email address first.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    setIsDialogOpen(true);
  };

  // Handle password reset via email
  const handleDialogConfirm = async () => {
    setIsDialogOpen(false);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSnackbarMessage("Password reset email sent! Check your inbox.");
      setSnackbarSeverity("success");
    } catch (error) {
      let message = "Failed to send password reset email.";
      if (error.code === "auth/user-not-found")
        message = "No user found with this email.";
      else if (error.code === "auth/invalid-email")
        message = "Invalid email address.";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  const handleDialogCancel = () => setIsDialogOpen(false);

  return (
    <div className="login-container">
      {/* Left Animation Panel */}
      <div className="left-panel">
        <DotLottieReact
          src="https://lottie.host/4fd012a4-6979-41bc-8db2-86bedac4787f/GBEcGXnHEX.lottie"
          loop
          autoplay
        />
      </div>

      {/* Right Login Form Panel */}
      <div className="right-panel">
        <h1 className="brand-title" style={{ display: "flex", alignItems: "center" }}>
          <FaCode style={{ fontSize: "2rem", color: "black", marginRight: "8px" }} />
          <span style={{ color: "black", fontSize: "2.5rem", fontWeight: "600" }}>
            CodeIQ.ai
          </span>
        </h1>

        <div className="login-box">
          <h2>Welcome Back!</h2>
          <p style={{ marginBottom: "1px", color: "black", fontSize: "1.1rem" }}>
            Log in to your account to continue.
          </p>

          <div className="login-type">
            <p className="role-heading">Select your role to continue:</p>
            <div className="radio-group">
              <label className={`radio-option ${userRole === "Student" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={userRole === "Student"}
                  onChange={() => {
                    setUserRole("Student");
                    setSnackbarMessage("Student Login");
                    setSnackbarSeverity("info");
                    setSnackbarOpen(true);
                  }}
                />
                🎓 Student
              </label>

              <label className={`radio-option ${userRole === "Educator" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="Educator"
                  checked={userRole === "Educator"}
                  onChange={() => {
                    setUserRole("Educator");
                    setSnackbarMessage("Educator Login");
                    setSnackbarSeverity("info");
                    setSnackbarOpen(true);
                  }}
                />
                👩‍🏫 Educator
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
            </div>

            <Box textAlign="right" style={{ marginTop: "10px" }}>
              <Button
                onClick={handleForgotPasswordClick}
                variant="contained"
                color="primary"
                style={{
                  borderRadius: "20px",
                  color: "black",
                  backgroundColor: "inherit",
                  padding: "8px 16px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                disabled={isLoading}
                endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
              >
                {isLoading ? "Sending..." : "Forgot Password"}
              </Button>
            </Box>

            <button type="submit" className="login-btn">Login Now</button>

            <div className="or-separator"><span>OR</span></div>

            <div className="login-buttons">
              <button type="button" className="google-login-btn" onClick={handleGoogleLogin}>
                <img
                  src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                  alt="Google Logo"
                  className="google-logo"
                />
                Login with Google
              </button>

              <button type="button" className="micro-login-btn" onClick={handleMicrosoftLogin}>
                <img
                  src="https://img.icons8.com/color/48/microsoft.png"
                  alt="Microsoft Logo"
                  className="google-logo"
                />
                Login with Microsoft
              </button>
            </div>

            <p className="register-text">
              Don't have an account? <a href="../Signup">Click Here</a>
            </p>
          </form>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for forgot password */}
      <Dialog open={isDialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We will send a password reset email to: <strong>{email}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button onClick={handleDialogConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginPage;
