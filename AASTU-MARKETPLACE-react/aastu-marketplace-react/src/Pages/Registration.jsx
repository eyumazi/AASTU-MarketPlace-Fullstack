import React, { useState, useEffect } from "react";
import signupVector from "../Assets/signup_vector2.png";
import "../CSS/Registration.css";
import favicon from "../Assets/AASTUMARKETPLACE.png";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload, FiX, FiRefreshCw } from "react-icons/fi";
import { supabase } from "../supabaseClient";
export const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "", // Changed from Id to user_id
    Email: "",
    Name: "",
    Phone: "",
    Password: "",
    PPpath: null,
    Role: "buyer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isCodeSent || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      if (timeLeft <= 1) {
        setCanResend(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isCodeSent]);

  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const mediumRegex =
      /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    if (strongRegex.test(password)) return "strong";
    if (mediumRegex.test(password)) return "medium";
    return "weak";
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "Email":
        if (!value.includes("@aastustudent.edu.et")) {
          error = "Must use your AASTU institutional email";
        }
        break;
      case "Phone":
        if (!/^[0-9]{10}$/.test(value)) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;
      case "Password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (
          !/[A-Z]/.test(value) ||
          !/[a-z]/.test(value) ||
          !/[0-9]/.test(value)
        ) {
          error = "Must contain uppercase, lowercase, and numbers";
        }
        break;
      case "user_id":
        if (!value) {
          error = "ID number is required";
        }
        break;
      default:
        if (!value) {
          error = "This field is required";
        }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "PPpath") {
      if (files[0] && files[0].size > 2097152) {
        setErrors((prev) => ({
          ...prev,
          PPpath: "File size must be less than 2MB",
        }));
      } else {
        setFormData({ ...formData, [name]: files[0] });
        setErrors((prev) => ({ ...prev, PPpath: "" }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "Password") {
        setPasswordStrength(checkPasswordStrength(value));
      }
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    let isValid = true;
    for (const [name, value] of Object.entries(formData)) {
      if (name !== "PPpath") {
        isValid = validateField(name, value) && isValid;
      }
    }

    // Validate file upload
    if (!formData.PPpath) {
      setErrors((prev) => ({ ...prev, PPpath: "Profile picture is required" }));
      isValid = false;
    } else if (formData.PPpath.size > 2097152) {
      setErrors((prev) => ({
        ...prev,
        PPpath: "File size must be less than 2MB",
      }));
      isValid = false;
    }

    if (!isValid) {
      setError("Please fix the errors below");
      console.log(errors);
      return;
    }

    if (formData.Password !== e.target.confirmPassword.value) {
      setError("Passwords do not match");
      return;
    }

    if (!e.target.terms.checked) {
      setError("You must accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }

      formDataToSend.append("terms", e.target.terms.checked);

      const response = await fetch("http://localhost/backend/register.php", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      if (result.success) {
        if (result.requires_verification) {
          setIsCodeSent(true);
          setMessage(
            "Verification code sent to your email. Please check and enter it below."
          );
          setSuccess(result.message);
          setTimeLeft(60);
          setCanResend(false);
        } else {
          navigate("/login");
        }
      } else {
        setMessage(result.message || "Registration Failed");
        setError(result.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(`Error: ${err.message || "Network error. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost/backend/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.Email,
          verification_code: verificationCode,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setError("Verification failed. Please try again." + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost/backend/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.Email,
          resend_verification: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Verification code resent successfully!");
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setError(data.message || "Failed to resend verification code");
      }
    } catch (error) {
      setError("Failed to resend verification code" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AASTU Marketplace - Sign Up</title>
      <link rel="icon" href={favicon} type="image/x-icon" />
      <link rel="stylesheet" href="signup.css" />

      <div className="registration-grid-container">
        <div className="registration-vector-container">
          <img
            src={signupVector}
            alt="AASTU Marketplace illustration"
            className="vector-image"
          />
          <div className="vector-content">
            <h2>Welcome to AASTU Marketplace</h2>
            <p>The official e-commerce platform for AASTU students and staff</p>
          </div>
        </div>

        <div className="registration-form-container">
          <div className="form-header">
            <i
              className="fas fa-user-circle"
              style={{ fontSize: "64px", color: "#555" }}
            ></i>
            <h1>{isCodeSent ? "Verify Your Email" : "Create Account"}</h1>
            <p>
              {isCodeSent
                ? "Enter the 6-digit code sent to your email"
                : "Join our community of buyers and sellers"}
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          {message && !error && !success && (
            <div className="alert alert-info">{message}</div>
          )}

          {isCodeSent ? (
            <form id="verification-form" onSubmit={handleVerify}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="verificationCode">Verification Code*</label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength="6"
                    required
                    pattern="\d{6}"
                    title="Please enter a 6-digit code"
                  />
                  <div className="verification-info">
                    <p>
                      Code expires in:{" "}
                      <span className="time-left">{timeLeft} seconds</span>
                    </p>
                    {canResend && (
                      <button
                        type="button"
                        className="resend-btn"
                        onClick={handleResendCode}
                        disabled={isSubmitting}
                      >
                        <FiRefreshCw /> Resend Code
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form
              id="registration-form"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user_id">ID Number*</label>
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    placeholder="AASTU ID"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    className={errors.user_id ? "error" : ""}
                  />
                  {errors.user_id && (
                    <span className="error-message">{errors.user_id}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Name">Full Name*</label>
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    placeholder="Enter your full name"
                    value={formData.Name}
                    onChange={handleChange}
                    required
                    className={errors.Name ? "error" : ""}
                  />
                  {errors.Name && (
                    <span className="error-message">{errors.Name}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Email">AASTU Email*</label>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    placeholder="username@aastustudent.edu.et"
                    value={formData.Email}
                    onChange={handleChange}
                    pattern=".+@aastustudent\.edu\.et"
                    required
                    className={errors.Email ? "error" : ""}
                  />
                  <small>Must use your AASTU institutional email</small>
                  {errors.Email && (
                    <span className="error-message">{errors.Email}</span>
                  )}
                </div>
              </div>

              <div className="form-row double-column">
                <div className="form-group">
                  <label htmlFor="Phone">Phone*</label>
                  <input
                    type="tel"
                    id="Phone"
                    name="Phone"
                    placeholder="09XXXXXXXX"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className={errors.Phone ? "error" : ""}
                  />
                  {errors.Phone && (
                    <span className="error-message">{errors.Phone}</span>
                  )}
                </div>
              </div>

              <div className="form-row double-column">
                <div className="form-group">
                  <label htmlFor="Password">Password*</label>
                  <input
                    type="password"
                    id="Password"
                    name="Password"
                    placeholder="Create password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    className={errors.Password ? "error" : ""}
                  />
                  <div className="password-strength">
                    {formData.Password && (
                      <>
                        <span
                          className={`strength-indicator ${passwordStrength}`}
                        >
                          Strength: {passwordStrength}
                        </span>
                        <div className="strength-bars">
                          <div
                            className={`strength-bar ${passwordStrength}`}
                          ></div>
                          <div
                            className={`strength-bar ${passwordStrength}`}
                          ></div>
                          <div
                            className={`strength-bar ${passwordStrength}`}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                  {errors.Password && (
                    <span className="error-message">{errors.Password}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="PPpath">Upload Profile Picture*</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="PPpath"
                      name="PPpath"
                      accept="image/*"
                      onChange={handleChange}
                      className="file-input"
                      required
                    />
                    <label htmlFor="PPpath" className="file-upload-label">
                      {formData.PPpath ? (
                        <>
                          <span className="file-name">
                            {formData.PPpath.name}
                          </span>
                          <span className="file-size">
                            {(formData.PPpath.size / 1024).toFixed(2)} KB
                          </span>
                        </>
                      ) : (
                        <>
                          <FiUpload className="upload-icon" />
                          <span>Choose a file (Max 2MB)</span>
                        </>
                      )}
                    </label>
                    {formData.PPpath && (
                      <button
                        type="button"
                        className="clear-file-btn"
                        onClick={() =>
                          setFormData({ ...formData, PPpath: null })
                        }
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                  {errors.PPpath && (
                    <span className="error-message">{errors.PPpath}</span>
                  )}
                  {formData.PPpath && (
                    <div className="image-preview">
                      <img
                        src={URL.createObjectURL(formData.PPpath)}
                        alt="Preview"
                        onLoad={() => URL.revokeObjectURL(formData.PPpath)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group account-type">
                  <label>Account Type (Role)*</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="Role"
                        value="buyer"
                        checked={formData.Role === "buyer"}
                        onChange={handleChange}
                        required
                      />
                      <span className="radio-custom"></span>
                      Buyer
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Role"
                        value="seller"
                        checked={formData.Role === "seller"}
                        onChange={handleChange}
                        required
                      />
                      <span className="radio-custom"></span>
                      Seller
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group terms">
                  <input type="checkbox" id="terms" name="terms" required />
                  <label htmlFor="terms">
                    I agree to the <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>*
                  </label>
                </div>
              </div>

              <div className="form-row">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          )}

          {!isCodeSent && (
            <div className="form-footer">
              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
