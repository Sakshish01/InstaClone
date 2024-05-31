import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../App.css";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHome, faHeart, faComment, faShare, faUser, faPlusSquare, faUserPlus, faEnvelope, faCog} from "@fortawesome/free-solid-svg-icons";
import httpAPICall from "../Services";
import AwesomeSlider from "react-awesome-slider";


const Profile = () => {
  const navigate = useNavigate();
  const BaseUrl = process.env.REACT_APP_BASE_URL;
  const loggedInUser = localStorage.getItem("currentUserId");
  const currentUserId = loggedInUser;
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    httpAPICall({
      method: "get",
      url: `${BaseUrl}users/viewProfile/${id}`,
    })
      .then((res) => {
        if (res.status === false) {
          toast.error(res.data.message);
        } else {
          setUserProfile(res.data);
        }
        console.log("Response: ", res)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const logoutButton = () => {

    httpAPICall({
      method: "post",
      url: `${BaseUrl}users/logout`,
    })
      .then((res) => {
        if (res.status === false) {
          toast.error(res.message);
        } else {
          navigate("/login");
          // toast.success(res.message);
        }
        // console.log("LocalStorage: ", USER);
        console.log("1111111------------>>>>>", res);
      })
      .catch((error) => {
        console.log(":2222222-------->>>>", error);
      });
  }

  // const handleNextImage = () => {
  //   setCurrentImageIndex((prevIndex) => prevIndex === userProfile.user.posts[currentImageIndex].post.length - 1 ? 0 : prevIndex + 1);
  // };

  // const handlePreviousImage = () => {
  //   setCurrentImageIndex((prevIndex) => prevIndex === 0 ? userProfile.user.posts[currentImageIndex].post.length - 1 : prevIndex - 1);
  // };

  return (
    <>
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
              src={userProfile?.user?.profileImage}
              alt={userProfile?.user?.username}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h4 style={{ marginRight: "10px" }}>
                {userProfile?.user?.username}
              </h4>
            </div>
            <div>
              <h6 style={{ marginRight: "10px" }}>{userProfile?.user?.name}</h6>
            </div>
            <div>{userProfile?.user?.bio}</div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "10px",
              }}
            >
              
              <h5 style={{ marginRight: "10px", marginBottom: "0" }}>
                {userProfile?.postsCount} posts
              </h5>
              <Link to={`/followers/${id}`}>
              <h5 style={{ margin: "0 10px" }}>
                {userProfile?.followersCount} followers
              </h5>
              </Link>
              <Link to={`/following/${id}`}>
              <h5 style={{ marginLeft: "10px", marginBottom: "0" }}>
                {userProfile?.followingCount} following
              </h5>
              </Link>
            </div>

            <div>
              <button className="follow-button">
                <FontAwesomeIcon icon={ faUser } /> Edit Profile
              </button>
              <button className="follow-button-new" onClick={() => logoutButton()}>
                <FontAwesomeIcon icon={ faCog } /> Log Out
              </button>
            </div>
          </div>
        </div>

        <div className="highlights">
          {/* Highlight images */}
          <div className="highlight-images">
            {userProfile?.user?.highlights?.map((image, index) => (
              <div key={index} className="highlight-image">
                <img src={image} alt={`Highlight ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Your existing JSX */}
        {userProfile?.user?.posts?.length > 1 ? (
          <div className="gallery">
            {/* Grid container for posts */}
            <div className="post-grid">
              {userProfile.user.posts.map((post, index) => (
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
                    <h4 className="post-username">{userProfile.user.username}</h4>
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

export default Profile;
