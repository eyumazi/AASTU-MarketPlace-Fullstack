import React, { useState } from "react";
import signupVector from "../Assets/signup_vector2.png";
import "../CSS/Registration.css";
import favicon from "../Assets/AASTUMARKETPLACE.png";
import { Link } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";

export const Registration = () => {
  const [formData, setFormData] = useState({
    Id: "",
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
      // Validate file size before setting
      if (files[0] && files[0].size > 2097152) {
        // 2MB in bytes
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

      const response = await fetch("http://localhost:8000/register.php", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      if (result.success) {
        setIsCodeSent(true);
        setMessage(
          "Verification code sent to your email. Please check and enter it below."
        );
        setSuccess(result.message);
        setFormData({
          Id: "",
          Email: "",
          Name: "",
          Phone: "",
          Password: "",
          PPpath: null,
          Role: "",
        });
        setPasswordStrength("");
        setErrors({});
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
  const handleVerify = async (e) =>
  {
    e.preventDefault(); 
    try{
      fetch("http://localhost:8000/register.php", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body:JSON.stringify({Email, code: verificationCode}),
      })
    }
    
    catch(error)
    {
      setMessage("verification failed please try again ");
    }
    const data = await response.json();
    if(data.message)
    {
      //redirect to welcome page
    }
  }

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
            <h1>Create Account</h1>
            <p>Join our community of buyers and sellers</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form
            id="registration-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Id">ID Number*</label>
                <input
                  type="text"
                  id="Id"
                  name="Id"
                  placeholder="AASTU ID"
                  value={formData.Id}
                  onChange={handleChange}
                  required
                  className={errors.Id ? "error" : ""}
                />
                {errors.Id && (
                  <span className="error-message">{errors.Id}</span>
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
                      onClick={() => setFormData({ ...formData, PPpath: null })}
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

          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
