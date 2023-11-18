import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './LoginForm.css';
import HomepageNavbar from '../Homepage/HomepageNavbar';

function LoginForm({ login }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    console.log(formData);
    login(formData);
  }

  return (
    <div className='login-page'>
      <HomepageNavbar />
      <div className="login-container-wrapper">
        <div className="two-column-layout">
          {/* Left column with introductory text */}
          <div className="intro-text">
            <h2>Simplify Invoicing with Invi's Smart Management</h2>
            <p>
              Ensure accurate inventory tracking with real-time updates
              based on invoice status, minimizing risks of overselling or
              stockouts.
            </p>
          </div>

          {/* Right column with login form */}
          <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username" className="label">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="label">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
              <p className="register-text">
                Don't have an account yet?
                <NavLink className="register-link" to="/signup"> Sign up now.</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
