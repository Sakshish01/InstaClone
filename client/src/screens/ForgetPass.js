import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <h2>Instagram</h2>
      </div>
    </nav>
  );
};

const ForgetPass = () => {
  return (
    <>
      <Navbar />
      <div className="mycard">
        <div className="card auth-card input-field">
          <div className="icon-container">
            <FontAwesomeIcon icon={faLock} className="lock-icon" />
          </div>
          <h4>Trouble logging in?</h4>
          <p>
            Enter your email, phone, or username and we'll <br /> send you a
            link to get back into your account.
          </p>
          <input type="text" placeholder="email" />
          <div className="forgot-password"></div>
          <button className="btn ">Send login link</button>
          <div className="divider-container">
            <div className="divider"></div>
            <span className="or-text">OR</span>
            <div className="divider"></div>
          </div>
          <div className="signup">
            <h5 className="signup">
              <Link className="link" to="/signup">
                Create new account
              </Link>
            </h5>
          </div>

          <div className="footer">
            <button className="link" to="/login">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgetPass;
