import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faUserPlus,
  faEnvelope,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { Link, useParams } from "react-router-dom";
import httpAPICall from "../Services";
import { toast } from "react-toastify";


const UserProfile = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL
  const { userId } = useParams();
  const [userdata, setUserData] = useState([]);

  useEffect(() => {
    httpAPICall({
      method: "get",
      url: `${BaseUrl}users/viewProfile/${userId}`,
    })
      .then((res) => {
        if (res.status === false) {
          toast.error(res.message);
        } else {
          setUserData(res.data);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  return (
    <>
      <div>
      <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            margin: "18px 0px",
            marginLeft: "40px",
          }}
        >
          <div style={{ alignSelf: "center" }}>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={userdata?.user?.profileImage}
              alt={userdata?.user?.username}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h4 style={{ marginRight: "10px" }}>
                {userdata?.user?.username}
              </h4>
            </div>
            <div>
              <h6 style={{ marginRight: "10px" }}>{userdata?.user?.name}</h6>
            </div>
            <div>{userdata?.user?.bio}</div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "10px",
              }}
            >
              
              <h5 style={{ marginRight: "10px", marginBottom: "0" }}>
                {userdata?.postsCount} posts
              </h5>
              <Link to={`/followers/${userId}`}>
              <h5 style={{ margin: "0 10px" }}>
                {userdata?.followersCount} followers
              </h5>
              </Link>
              <Link to={`/following/${userId}`}>
              <h5 style={{ marginLeft: "10px", marginBottom: "0" }}>
                {userdata?.followingCount} following
              </h5>
              </Link>
            </div>

            <div>
              <button className="follow-button">
                <FontAwesomeIcon icon={faUserPlus} /> Follow
              </button>
              <button className="message-button">
                <FontAwesomeIcon icon={faEnvelope} /> Message
              </button>
            </div>
          </div>
        </div>

        <div className="highlights">
          {/* Highlight images */}
          <div className="highlight-images">
            {userdata?.user?.highlights?.map((image, index) => (
              <div key={index} className="highlight-image">
                <img src={image} alt={`Highlight ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Your existing JSX */}
        {userdata?.user?.posts?.length > 1 ? (
          <div className="gallery">
            {/* Grid container for posts */}
            <div className="post-grid">
              {userdata.user.posts.map((post, index) => (
                <div key={index} className="post-item">
                  {post.post.length === 1 ? (
                    // If post has only one image
                    <img
                      className="item"
                      src={post.post[0]}
                      alt={`Post ${index + 1}`}
                    />
                  ) : (
                    // If post has more than one image
                    <AwesomeSlider>
                      {post.post.map((image, imageIndex) => (
                        <div key={imageIndex}>
                          <img src={image} alt={`Post ${index + 1}`} />
                        </div>
                      ))}
                    </AwesomeSlider>
                  )}

                  {/* Post buttons */}
                  <div className="post-buttons">
                    <button className="icon-button">
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <button className="icon-button">
                      <FontAwesomeIcon icon={faComment} />
                    </button>
                    <button className="icon-button">
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                  </div>

                  {/* Display username and caption */}
                  <div className="post-details" style={{ display: "flex" }}>
                    <h4 className="post-username">{userdata.user.username}</h4>
                    <p className="post-caption" style={{ marginLeft: "10px" }}>
                      {post.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h5>No posts </h5>
        )}
      </div>
    </>
  );
};

export default UserProfile;
