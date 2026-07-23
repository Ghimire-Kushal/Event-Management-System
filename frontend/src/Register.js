import React, { useState } from "react";
import axios from "axios";

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState(1); // 1: Register, 2: OTP
  const [otp, setOtp] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register/",
        formData
      );

      // Shows the message from Django, which includes the OTP
      alert(response.data.message);
      setStep(2);
    } catch (err) {
      const errorDetail = err.response
        ? JSON.stringify(err.response.data)
        : "Server not reachable";
      alert("Registration failed: " + errorDetail);
      console.error(err.response?.data);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/users/verify-otp/", {
        email: formData.email,
        otp: otp,
      });
      alert("Verified! You can now browse events.");
      setStep(1);
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      alert("Invalid OTP code. Please check again.");
    }
  };

  return (
    <div className="auth-card">
      {step === 1 ? (
        <>
          <h2>Create Account</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email (use @apollo.edu for internal)"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn">
              Register &amp; Get OTP
            </button>
          </form>

          {switchToLogin && (
            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <span
                  className="link-bold"
                  role="button"
                  tabIndex={0}
                  onClick={switchToLogin}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") switchToLogin();
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <h2>Verify OTP</h2>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "20px" }}>
            Check your alert box for the code sent to <b>{formData.email}</b>
          </p>

          <form onSubmit={handleVerify}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "5px" }}
                maxLength="6"
                required
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button type="submit" className="btn">
              Verify Account
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: "none",
                color: "#003366",
                cursor: "pointer",
                display: "block",
                margin: "10px auto 0",
              }}
            >
              Back to Register
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;