import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "../SignupFormPage/AuthForm.css"

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleDemoLogin = async(e) => {
    e.preventDefault();
    const data = await dispatch(login("demo@user.com", "password"))
    if (data) {
      setErrors(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  return (
    <div className="login_background_image">
      <div className="auth_form_container">
        <h1 className="auth_form_title">Log in</h1>
        <form className="auth_form" onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li className="auth_form_error" key={idx}>{error}</li>
            ))}
          </ul>
          <div className="auth_form_input_div">
            <div className="auth_form_input_label">
              Email
            </div>
            <input
              className="auth_form_input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address here"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password here"
              required
            />
          </div>
          <div className="auth_form_button_div">
            <button className="auth_form_button" type="submit">Log In</button>
            <button className="auth_form_button" onClick={handleDemoLogin} type="button">Login as Demo</button>
          </div>
        </form>
        <div className="auth_form_signup_link_div">
          <Link to={"/signup"}>
            <span className="auth_form_signup_link">Need to sign up?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
