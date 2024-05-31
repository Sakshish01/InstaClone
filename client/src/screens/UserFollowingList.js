import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import httpAPICall from "../Services";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faHome, faPlusSquare, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

const FollowingList = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL;

  const loggedInUser = localStorage.getItem("currentUserId");
  const currentUserId = loggedInUser;
  const navigate = useNavigate();

  const { userId } = useParams();
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    // Fetch followers list
    httpAPICall({
      method: "get",
      url: `${BaseUrl}users/following/${userId}`,
    })
      .then((res) => {
        if (res.status === false) {
          toast.error(res.data.message);
        } else {
          setFollowingList(res.data.following);
        }
        console.log("Response: ", res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleButtonClick = (userId) => {
    navigate(`/user/profile/${userId}`);
  };

  return (
    <div className="home">
    {/* Header */}
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
      <div className="followers-container">
        <h2>Followers List</h2>
        {followingList?.length > 0 ? (
          <div>
            {followingList.map((following, index) => (
              <div
                key={index}
                className="follower-item"
                onClick={() => handleButtonClick(following._id)}
              >
                {/* <Link to={`/profile/${follower?._id}`} className="follower-link"> */}
                <div className="follower-box">
                  <img
                    className="follower-image"
                    src={following?.profileImage}
                    alt={following?.username}
                  />
                  <div className="follower-details">
                    <div>
                      <p className="follower-username">{following?.username}</p>
                      <p className="follower-name">{following?.name}</p>
                    </div>
                  </div>
                </div>
                {/* </Link> */}
              </div>
            ))}
          </div>
        ) : (
          <p>No followings found.</p>
        )}
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
        </footer>
    </div>
  );
};

export default FollowingList;
