import React from "react";
import { Phone } from "lucide-react";

const ProfileSection = () => (
  <div className="profile-section">
    <div className="profile-card">
      <div className="logo-container">
        <div className="logo-circle">
          <Phone className="phone-icon" />
        </div>
        <h2 className="company-name">Venux Technology</h2>
        <p className="user-role">Buyer</p>
      </div>
    </div>

    <div className="about-card">
      <h3 className="section-title">About Us</h3>
      <p className="about-text">
        Sit perferendis totam aut harum odio laudantium. Dolorem sit est
        voluptates asperiores quia...
      </p>
    </div>
  </div>
);

export default ProfileSection;
