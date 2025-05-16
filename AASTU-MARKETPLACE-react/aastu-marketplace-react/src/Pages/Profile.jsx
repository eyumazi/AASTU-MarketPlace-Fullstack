import React from "react";
import ProfileSection from "../Components/Profile/ProfileSection";
import InfoSettingsSection from "../Components/Profile/Setting";
import "../CSS/user-dashboard.css";
import ItemSales from "../Components/home/item";

export default function UserDashboard() {
  return (
    <div className="dashboard-container">
      <ProfileSection />
      <div className="bottom">
        <InfoSettingsSection />
        <div className="items-container-pro">
          <ItemSales />
        </div>
      </div>
    </div>
  );
}
