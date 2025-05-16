import React from "react";
import twitter from "../../Assets/twitter.png";
import insta from "../../Assets/insta.png";
import linkedin from "../../Assets/linkedin.png";
import tom from "../../Assets/Tom.png";
import emma from "../../Assets/Emma.png";
import john from "../../Assets/John.png";

const teamMembers = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: tom,
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    image: emma,
  },
  {
    name: "John Doe",
    role: "Product Designer",
    image: john,
    className: "profile",
  },
];

const socialIcons = [
  { src: twitter, alt: "twitter" },
  { src: insta, alt: "insta" },
  { src: linkedin, alt: "linkedin" },
];

const TeamSection = () => (
  <section className="team">
    {teamMembers.map((member, index) => (
      <div key={index} className="individual">
        <img
          src={member.image}
          alt={member.name}
          className={member.className || ""}
        />
        <h3>{member.name}</h3>
        <p>{member.role}</p>
        <div className="social-links">
          {socialIcons.map((icon, i) => (
            <img key={i} src={icon.src} alt={icon.alt} />
          ))}
        </div>
      </div>
    ))}
  </section>
);

export default TeamSection;
