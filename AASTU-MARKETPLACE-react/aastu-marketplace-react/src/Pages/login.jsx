import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginVector from "../Assets/login_vector2.png";
import loginIcon from "../Assets/login_icon.png";
import "../CSS/login.css";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupClick = (e) => {
    e.preventDefault();
    document.querySelector(".loginPage-content-container").style.animation =
      "fadeOut 0.5s ease forwards";
    setTimeout(() => {
      navigate("/signup");
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost/backend/process_login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        if (data.role === "buyer") {
          navigate("/homebuyer");
        } else if (data.role === "seller") {
          navigate("/homeseller");
        } else if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginPage-login-page">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AASTU Marketplace - Login</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      <div className="loginPage-content-container">
        {/* Left Form Container */}
        <div className="loginPage-form-container">
          <div className="loginPage-form-header">
            <img
              src={loginIcon}
              alt="AASTU Marketplace logo"
              className="loginPage-logo"
            />
            <h1 className="loginPage-title">Sign in to your account</h1>
            <p className="loginPage-subtitle">
              Enter your credentials to continue
            </p>
          </div>

          {error && <div className="loginPage-error-message">{error}</div>}

          <form className="loginPage-form" onSubmit={handleSubmit}>
            <div className="loginPage-form-group">
              <label htmlFor="email" className="loginPage-label">
                Email address*
              </label>
              <input
                type="email"
                id="email"
                className="loginPage-input"
                placeholder="Enter your AASTU email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="loginPage-form-group">
              <label htmlFor="password" className="loginPage-label">
                Password*
              </label>
              <input
                type="password"
                id="password"
                className="loginPage-input"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="/forgot-password" className="loginPage-forgot-password">
                Forgot password?
              </a>
            </div>

            {/* <div className="loginPage-remember-me">
              <input
                type="checkbox"
                id="remember"
                className="loginPage-checkbox"
              />
              <label htmlFor="remember" className="loginPage-remember-label">
                Remember me
              </label>
            </div> */}

            <button
              type="submit"
              className="loginPage-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="loginPage-signup-text">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="loginPage-signup-link"
              onClick={handleSignupClick}
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Right Vector Container */}
        <div className="loginPage-vector-container">
          <img
            src={loginVector}
            alt="Login illustration"
            className="loginPage-vector-image"
          />
          <div className="loginPage-vector-content">
            <h2 className="loginPage-vector-title">
              Welcome to AASTU Marketplace
            </h2>
            <p className="loginPage-vector-text">
              Connect with students and staff across campus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
