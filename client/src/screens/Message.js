import React, { useState, useEffect } from "react";
import "../App.css";
import httpAPICall from "../Services";
import { toast } from "react-toastify";
import { differenceInSeconds } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlusSquare,
  faSearch,
  faHeart,
  faComment,
  faShare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";


const App = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const loggedInUser = localStorage.getItem("currentUserId");
  const currentUserId = loggedInUser;

  const [selectedUser, setSelectedUser] = useState(null);
  const [userConversations, setUserConversations] = useState([]);
  console.log("1111111", userConversations);

  useEffect(() => {
    // Fetch user conversations from the API
    httpAPICall({
      method: "get",
      url: `${BaseUrl}userConversation`,
    })
      .then((res) => {
        console.log(res);
        if (res.data.status === false) {
          toast.error(res.data.message);
        } else {
          setUserConversations(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching user conversations:", error);
      });
  }, []); // Empty dependency array to run the effect only once

  const socket = io("http://192.168.0.33:8000"); // Replace the URL with your Socket.IO server URL
  const handleButtonClick = (userId) => {
    navigate(`/chat/${userId}`);
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const secondsDiff = differenceInSeconds(new Date(), date);
    if (secondsDiff < 60) {
      return `${secondsDiff} seconds ago`;
    } else if (secondsDiff < 3600) {
      const minutes = Math.floor(secondsDiff / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (secondsDiff < 86400) {
      const hours = Math.floor(secondsDiff / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(secondsDiff / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      <div className="home">
      <header>
          <div className="header-left">
            <h1>Instagram</h1>
          </div>
          <div className="header-right">
            <FontAwesomeIcon icon={faHeart} className="icon" />
            <Link to="/message">
              <FontAwesomeIcon icon={faComment} className="icon" />
            </Link>
          </div>
        </header>
        <div className="instagram-messages">
          <div className="message-list">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
            <ul>
              {userConversations?.map((user) => {
                return (
                  <li
                    key={user?.id}
                    className={
                      user.members?.[0]._id?.id === selectedUser ? "active" : ""
                    }
                    onClick={() => handleButtonClick(user.members[0]._id)}
                  >
                    <div className="user-profile">
                      <img
                        src={user.members?.[0].profileImage}
                        alt="User profile"
                      />
                      <div className="user-details">
                        <h3>{user?.members?.[0]?.name}</h3>
                        <p>{user?.lastMessage.text}</p>
                      </div>
                    </div>
                    <div className="last-message"></div>
                    {/* Format the timestamp */}
                    <p>{formatTimestamp(user?.lastMessage.createdAt)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <footer>
          <Link to="/post/feed">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Link>
          <Link to={`/create/post`}>
            <FontAwesomeIcon icon={faPlusSquare} className="icon" />
          </Link>
          <Link to="/search">
            <FontAwesomeIcon icon={faSearch} className="icon" />
          </Link>
          <Link to={`/profile/${currentUserId}`}>
            <FontAwesomeIcon icon={faUser} className="icon" />
          </Link>
          {/* You can replace the reel icon with your preferred icon */}
        </footer>
      </div>
    </>
  );
};

export default App;
