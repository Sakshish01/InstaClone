import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { toast } from "react-toastify";
import httpAPICall from "../Services";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    // Regular expression pattern for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const userData = async ()=> {
  //   if(!name || !email || !password || !username ){
  //     toast.error('All fields are required')
  //   } else {
  //     await fetch("http://192.168.0.14:8000/api/users/register",{
  //       method: "post",
  //       headers:{
  //         "Accept":"application/json"
  //       },
  //       body: JSON.stringify({
  //         name,
  //         username,
  //         password,
  //         email
  //       })
  //     })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //       // if (data.data === null) {
  //       //   toast.error(data.message);
  //       //   return
  //       // } else {
  //       //   toast.success(data.message);
  //       //   navigate('/login');
  //       // }
  //       // console.log(data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     })

  // }

  let data = {
    name: name,
    username: username,
    password: password,
    email: email
  };

  httpAPICall({
    method: "post",
    url: "http://192.168.241.131/api/users/register",
    payload: data,
  })
    .then((res) => {
      if (res.data === null) {
        toast.error(data.message);
      } else {
        navigate('/login');
        toast.success(data.message);
      }
      console.log("1111111------------>>>>>", res, res.data);
    })
    .catch((error) => {
      console.log(":2222222-------->>>>", error);
    });
    
  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <p className="description">Sign up to see photos and videos <br />
         from your friends.</p>
        <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type="password" minLength={6} placeholder="Password" value={password} onChange={(e)=>setPassword (e.target.value)}/>
        <div className="forgot-password">
          <Link className="link " to="/forget/password">
            Forgot password?
          </Link>
        </div>
        <button className="btn " onClick={userData}>
          SignUp
        </button>

        <div className="signup">
          <h5 className="signup">
            Have an account?{" "}
            <Link className="link" to="/login">
              Log in
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
};
export default Signup;
