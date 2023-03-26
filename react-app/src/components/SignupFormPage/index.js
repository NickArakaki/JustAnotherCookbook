import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import './AuthForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(username, email, password));
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <div className="signup_background_image">
      <div className="auth_form_container">
        <h1 className="auth_form_title">Sign up</h1>
        <form className="auth_form" onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => <li className="auth_form_error" key={idx}>{error}</li>)}
          </ul>
          <div className="auth_form_input_div">
            <div className="auth_form_input_label">
              Username
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
          <div className="auth_form_input_div">
              <div className="auth_form_input_label">
                Email address
              </div>
              <input
                className="auth_form_input"
                type="text"
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
