import React, { useState } from 'react';
import './SignupForm.css';
import HomepageNavbar from '../Homepage/HomepageNavbar';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Alert from '../../../common/Alert';

/**
 * Component for handling user login.
 *
 * @param {function} props.signUp - Function to sign up in the user.
 *
 * Homepage -> SignupForm -> Dashboard
 */

function SignupForm({ signUp }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  /** Updates the formData state with the input changes. */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  /** Handles form submission. */
  async function handleSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    try {
      await signUp(formData);
      navigate("/dashboard");
    } catch (err) {
      setFormErrors(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='signup-page'>
      <HomepageNavbar />
      <Snackbar
        open={loading}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity="warning">
          Our backend host will take some time to boot.
          We apologize for any inconvenience this may cause and appreciate your patience!
        </MuiAlert>
      </Snackbar>
      <div className="signup-container-wrapper">
        <div className="signup-container">
          <h2 className="signup-heading">Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            {formErrors.length > 0 && (
              <Alert messages={formErrors} />
            )}

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
            <div className="input-group">
              <label htmlFor="firstName" className="label">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName" className="label">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email" className="label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
            <p className='login-text'> Already have an account?
              <NavLink className="login-link" to="/login"> Sign in now.</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
