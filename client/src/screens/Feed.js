import React, { useEffect, useState } from "react";
import "../App.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCog,
  faComment, faShare,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import httpAPICall from "../Services";


const Feed = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL;
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(()=>{
        getData()
    },[])



    const getData = async () => {    
        httpAPICall({
          method: "get",
          url: `${BaseUrl}posts/feed`,
        //   payload: data,
        }).then((res) => {
            if (res.success) {
                setPosts(res?.data)
                setMessage(res?.message)
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
            console.log("1111111------------>>>>>", res, res.data);
          })
          .catch((error) => {
            toast.error(error.message);

            console.log(":2222222-------->>>>", error);
          });
      };
    return (
      <>
      {posts?.length > 0 ?
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                src="https://media.istockphoto.com/id/1460312541/photo/smiling-young-businessman-working-online-with-digital-tablet-while-standing-by-window.webp?b=1&s=170667a&w=0&k=20&c=CMpIkPHe7G4KSS-ARRPRqqqV5rory9o2YG5Do_WFFsU="
                alt=""
              />
            </div>
            <div>
              <h4>Username</h4>
              <button>Edit profile</button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h5>40 posts</h5>
                <h5>40 followers</h5>
                <h5>40 following</h5>
              </div>
              <div>
                Bio
              </div>
            </div>
          </div>

          if()
  
          <div className="gallery">
            {/* Grid container for posts */}
            <div className="post-grid">
              {/* First post */}
              <div className="post-item">
                <img className="item" src="https://media.istockphoto.com/id/1460312541/photo/smiling-young-businessman-working-online-with-digital-tablet-while-standing-by-window.webp?b=1&s=170667a&w=0&k=20&c=CMpIkPHe7G4KSS-ARRPRqqqV5rory9o2YG5Do_WFFsU=" alt="" />
                {/* Post buttons */}
                <div className="post-buttons">
                  {/* Like button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faHeart} /></button>
                  {/* Comment button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faComment} /></button>
                  {/* Share button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faShare} /></button>
                </div>
              </div>
  
              {/* Second post */}
              <div className="post-item">
                <img className="item" src="https://images.unsplash.com/photo-1525253604620-23ac591dbea0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlcnNvbiUyMHNxdWFyZXxlbnwwfDF8MHx8fDA%3D" alt="" />
                {/* Post buttons */}
                <div className="post-buttons">
                  {/* Like button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faHeart} /></button>
                  {/* Comment button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faComment} /></button>
                  {/* Share button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faShare} /></button>
                </div>
              </div>
              <div className="post-item">
                <img className="item" src="https://media.istockphoto.com/id/1460312541/photo/smiling-young-businessman-working-online-with-digital-tablet-while-standing-by-window.webp?b=1&s=170667a&w=0&k=20&c=CMpIkPHe7G4KSS-ARRPRqqqV5rory9o2YG5Do_WFFsU=" alt="" />
                {/* Post buttons */}
                <div className="post-buttons">
                  {/* Like button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faHeart} /></button>
                  {/* Comment button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faComment} /></button>
                  {/* Share button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faShare} /></button>
                </div>
              </div>
  
              {/* Second post */}
              <div className="post-item">
                <img className="item" src="https://images.unsplash.com/photo-1525253604620-23ac591dbea0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlcnNvbiUyMHNxdWFyZXxlbnwwfDF8MHx8fDA%3D" alt="" />
                {/* Post buttons */}
                <div className="post-buttons">
                  {/* Like button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faHeart} /></button>
                  {/* Comment button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faComment} /></button>
                  {/* Share button with icon */}
                  <button className="icon-button"><FontAwesomeIcon icon={faShare} /></button>
                </div>
              </div>
            </div>
          </div>
  
        </div>
        :
        <div>
            <p>{message || "No Post Available"}</p>
        </div>
}
        

      </>
    );
  };

export default Feed;