import { toast } from "react-toastify";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import httpAPICall from "../Services";

const Login = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL;
  console.log('BaseURL: ', BaseUrl);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userlogin = async () => {
    let data = {
      username: username,
      password: password,
    };
    console.log('Data: ', data);


    httpAPICall({
      method: "post",
      url: `${BaseUrl}users/login`,
      payload: data,
    })
      .then((res) => {
        if (res.data === null) {
          toast.error(data.message);
        } else {
          localStorage.setItem("token", res?.data);
          localStorage.setItem("currentUserId", res?.currentUserId);
          navigate("/post/feed");
          // toast.success(data.message);
        }
        // console.log("LocalStorage: ", USER);
        console.log("1111111------------>>>>>", res, res.data);
      })
      .catch((error) => {
        console.log(":2222222-------->>>>", error);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn " onClick={userlogin} >
          Login
        </button>
        <div className="divider-container">
          <div className="divider"></div>
          <span className="or-text">OR</span>
          <div className="divider"></div>
        </div>
        <div className="forgot-password-login">
          <Link className="link" to="/reset">
            Forgot password?
          </Link>
        </div>

        <div className="signup">
          <h5 className="signup">
            Don't have an account?{" "}
            <Link className="link" to="/signup">
              Sign Up
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
};
export default Login;
