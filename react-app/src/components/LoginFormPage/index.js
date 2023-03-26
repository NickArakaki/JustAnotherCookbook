import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './LoginForm.css';

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
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth_form_input_div">
          <div className="auth_form_input_label">
            Password
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="auth_form_button" type="submit">Log In</button>
      </form>
      <button className="auth_form_demo_button" onClick={handleDemoLogin} type="button">Login as Demo</button>
    </div>
  );
}

export default LoginFormPage;
