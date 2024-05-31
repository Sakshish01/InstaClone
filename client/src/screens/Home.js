import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import httpAPICall from "../Services";
import { toast } from "react-toastify";
const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userlogin = async () => {
    let data = {
      username: username,
      password: password,
    };

    let USER;
    httpAPICall({
      method: "post",
      url: "http://192.168.98.131:8000/api/users/login",
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
        <div className="forgot-password">
          <Link className="link " to="/reset">
            Forgot password?
          </Link>
        </div>
        <button className="btn " onClick={userlogin}>
          Login
        </button>

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
export default Home;
