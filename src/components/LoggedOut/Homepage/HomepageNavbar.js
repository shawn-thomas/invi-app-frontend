import React from "react";
import inviLogo from "../../../images/InviLogo.svg"
import { NavLink } from "react-router-dom";
import "./styles/HomepageNavbar.css";

function HomepageNavbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-title navbar-item">
        <img className="navbar-logo" src={inviLogo} alt="invi-logo" />
      </NavLink>
      <NavLink className="navbar-item navbar-login" to="/login" end> Login </NavLink>
      <NavLink className="navbar-item navbar-signup" to="/signup" end> Sign up </NavLink>
    </header>
  );
}

export default HomepageNavbar;
