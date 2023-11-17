import React from "react";
import "./styles/Hero.css";
import invoiceHero from "../images/Invoice-amico.svg";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-container-left">
          <h1>Simplify. Organize. Elevate What Matters.</h1>
          <p>
            Experience a hassle-free approach to inventory and invoice management,
            helping you stay organized and focused on growing your business.
          </p>
        </div>
        <div className="hero-container-right">
          <img className="hero-container-img" src={invoiceHero} alt="Hero" />
        </div>
      </div>
    </div>

  );
}

export default Hero;