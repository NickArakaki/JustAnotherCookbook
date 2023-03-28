import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { validateUsername, validatePassword, validateConfirmPassword } from "../../utils/authUtils";
import './AuthForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordErrors, setConfrimPasswordErrors] = useState([])
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate username, password, errors
    // done this way because useState is asyc
    const validatedUsernameErrors = validateUsername(username)
    setUsernameErrors(validatedUsernameErrors)

    const validatePasswordErrors = validatePassword(password)
    setPasswordErrors(validatePasswordErrors)

    const validateConfirmPasswordErrors = validateConfirmPassword(password, confirmPassword)
    setConfrimPasswordErrors(validateConfirmPasswordErrors)

    if (!validatedUsernameErrors.length && !validatePasswordErrors.length && !validateConfirmPasswordErrors.length) {
      const data = await dispatch(signUp(username, email, password))

      if (data?.errors) {
        setErrors(["User Already Exists"])
      } else if (data) {
        setErrors(data)
      }
    }
  };

  return (
    <div className="signup_background_image">
      <div className="auth_form_container">
        <h1 className="auth_form_title">Sign up</h1>
        {errors.length > 0 && errors.map((error, idx) => {
          return <div className="form_error" key={idx}>{error}</div>
        })}
        <form className="auth_form" onSubmit={handleSubmit}>
          <div className="auth_form_input_div">
            <div className="auth_form_input_label">
              Username
            </div>
            <div className="input_errors_div">
              {usernameErrors.length > 0 && (
                usernameErrors.map((error, idx) => {
                  return <div className="form_error" key={idx}>{error}</div>
                })
              )}
            </div>
            <input
              className="auth_form_input"
              type="text"
              value={username}
              placeholder="Enter a username"
              onChange={(e) => setUsername(e.target.value)}
              required
              />
            </div>
            <div className="auth_form_input_details">
              {/* <p className="auth_form_profile_address">The address to your profile will be: <span className="auth_user_url">https://justanothercookbook.onrender.com/users/{username}</span></p> */}
              <div className="auth_form_username_constraints">No spaces, alphanumeric characters only. Maximum of 20 characters.</div>
            </div>
          <div className="auth_form_input_div">
              <div className="auth_form_input_label">
                Email address
              </div>
              <input
                className="auth_form_input"
                type="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
          </div>
          <div className="auth_form_input_div">
            <div className="auth_form_input_label">
              Password
            </div>
            <div className="input_errors_div">
              {passwordErrors.length > 0 && (
                passwordErrors.map((error, idx) => {
                  return <div className="form_error" key={idx}>{error}</div>
                })
              )}
            </div>
            <input
              className="auth_form_input"
              type="password"
              value={password}
              placeholder="Enter a password here"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth_form_input_div">
            <div className="auth_form_input_label">
              Confirm Password
              </div>
            <div className="input_errors_div">
              {confirmPasswordErrors.length > 0 && (
                confirmPasswordErrors.map((error, idx) => {
                  return <div className="form_error" key={idx}>{error}</div>
                })
              )}
            </div>
            <input
              className="auth_form_input"
              type="password"
              value={confirmPassword}
              placeholder="Re-type your password again here"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth_form_button" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
