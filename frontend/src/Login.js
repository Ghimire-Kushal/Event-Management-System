import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess, switchToRegister }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/login/",
        credentials
      );
      // Save the token so the user stays logged in
      localStorage.setItem("token", res.data.access);
      alert("Login Successful!");
      onLoginSuccess();
    } catch (err) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </div>

        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <div className="auth-footer">
        <p>
          <a href="#forgot" className="link-small">
            Forgot Password?
          </a>
        </p>

        {switchToRegister && (
          <p>
            Don&apos;t have an account?{" "}
            <span
              className="link-bold"
              role="button"
              tabIndex={0}
              onClick={switchToRegister}
              onKeyDown={(e) => {
                if (e.key === "Enter") switchToRegister();
              }}
            >
              Create Account
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;