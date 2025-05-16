import React, { useState } from "react";
import "../CSS/Contact us Style.css";
import favicon from "../Assets/AASTUMARKETPLACE.png";
import phoneIcon from "../Assets/icons-phone.png";
import mailIcon from "../Assets/icons-mail.png";

const Contactus = () => {
  const [formData, setFormData] = useState({
    FullName: "",
    EmailAddress: "",
    PhoneNumber: "",
    Message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    success: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setStatus({ success: false, message: "" });

    try {
      const response = await fetch("http://localhost:8000/process_contactus.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form");
      }

      if (result.success) {
        setStatus({ success: true, message: result.message });
        setFormData({
          FullName: "",
          EmailAddress: "",
          PhoneNumber: "",
          Message: "",
        });
      } else {
        setErrors(result.errors || {});
        setStatus({ success: false, message: result.message });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Contact Us</title>
      <link rel="icon" href={favicon} type="image/x-icon" />

      <div className="homeText">
        <span>Home /</span>
        <h4 style={{ display: "inline" }}>Contact</h4>
      </div>

      <div className="page-container">
        <section className="section-1">
          <form onSubmit={handleSubmit}>
            <div className="contact-item">
              <img className="a" src={phoneIcon} alt="Call to Us" />
              <span className="a">Call to Us</span>
            </div>
            <br />
            <br />
            <span>We are available 24/7, 7 days a week</span>
            <br />
            <br />
            <h4>Phone: +251934556789</h4>
            <br />
            <div className="bottom-line2" />
            <br />
            <div className="contact-item">
              <img className="a" src={mailIcon} alt="Write To Us" />
              <span>Write to Us</span>
            </div>
            <br />
            <span>
              Fill out our form and we will contact you within 24 hours.
            </span>
            <br />
            <br />
            <h4>
              Emails: 
              <a href="mailto:dawitgetachew808@gmail.com">
                 dawitgetachew808@gmail.com
              </a>
            </h4>
            <h4>
              Emails: 
              <a href="mailto:ey.mazi222@gmail.com">
                 ey.mazi222@gmail.com
              </a>
            </h4>
            <h4>
              Emails: 
              <a href="mailto:ey.mazi233@gmail.com">
                 ey.mazi233@gmail.com
              </a>
            </h4>
          </form>
        </section>

        <section className="section-2">
          <form onSubmit={handleSubmit}>
            <span>
              <input
                className={`Name ${errors.FullName ? "error" : ""}`}
                type="text"
                name="FullName"
                placeholder="Your Name *"
                value={formData.FullName}
                onChange={handleChange}
              />
              {errors.FullName && (
                <span className="error-message">{errors.FullName}</span>
              )}

              <input
                className={`Email ${errors.EmailAddress ? "error" : ""}`}
                type="email"
                name="EmailAddress"
                placeholder="Your Email *"
                value={formData.EmailAddress}
                onChange={handleChange}
              />
              {errors.EmailAddress && (
                <span className="error-message">{errors.EmailAddress}</span>
              )}

              <input
                className={`Phone ${errors.PhoneNumber ? "error" : ""}`}
                type="tel"
                name="PhoneNumber"
                placeholder="Your Phone *"
                value={formData.PhoneNumber}
                onChange={handleChange}
              />
              {errors.PhoneNumber && (
                <span className="error-message">{errors.PhoneNumber}</span>
              )}
            </span>

            <textarea
              className={errors.Message ? "error" : ""}
              name="Message"
              placeholder="Your Message"
              value={formData.Message}
              onChange={handleChange}
            />
            {errors.Message && (
              <span className="error-message">{errors.Message}</span>
            )}

            <button className="send-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {status.message && (
              <div
                className={`status-message ${
                  status.success ? "success" : "error"
                }`}
              >
                {status.message}
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contactus;
