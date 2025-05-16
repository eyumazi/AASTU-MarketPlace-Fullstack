import React from "react";
import { ArrowUpRight } from "lucide-react";

const InfoSettingsSection = () => (
  <div className="info-settings-section">
    <div className="info-card">
      <h3 className="info-title">Information</h3>
      {[
        "Email: example@gmail.com",
        "Address: Addis Ababa",
        "Phone: +251-912-345-6789",
      ].map((info, index) => (
        <div className="info-item" key={index}>
          <span>{info}</span>
          <ArrowUpRight className="arrow-icon" />
        </div>
      ))}
    </div>

    <div className="settings-card">
      <h3 className="settings-title">Settings</h3>
      {["Example", "Example", "Example", "Logout"].map((setting, index) => (
        <div className="settings-item" key={index}>
          <span>{setting}</span>
          <ArrowUpRight className="arrow-icon" />
        </div>
      ))}
    </div>
  </div>
);

export default InfoSettingsSection;
