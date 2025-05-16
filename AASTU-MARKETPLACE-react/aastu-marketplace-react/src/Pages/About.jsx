import "../CSS/About.css";
import React from "react";
import SuccessStats from "../Components/About/SuccessStats";
import ServiceHighlights from "../Components/About/ServiceHighlights";
import StorySection from "../Components/About/StorySection";
import TeamSection from "../Components/About/TeamSection";

const About = () => (
  <div className="a">
    <StorySection />
    <h1 className="top-sucess">Top Sucesss</h1>

    <SuccessStats />
    <h1 className="our-team">Our Team</h1>

    <TeamSection />
    <h1 className="service">Our Services</h1>

    <ServiceHighlights />
  </div>
);
export default About;
