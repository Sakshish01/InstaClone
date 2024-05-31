import React, { useEffect, useState } from "react";
import "../App.css";
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
import httpAPICall from "../Services";
import { toast } from "react-toastify";
import AwesomeSlider from "react-awesome-slider";


const Home = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL;
  const loggedInUser = localStorage.getItem("currentUserId");
  const currentUserId = loggedInUser;
  console.log('BaseUrl: ', BaseUrl);
  const navigate = useNavigate();
  const userID = localStorage.getItem("currentUserId");
  console.log("Userid: ", userID);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await httpAPICall({
        method: "get",
        url: `${BaseUrl}posts/feed`,
      });

      if (res) {
        if (res.status) {
          setPosts(res.data);
          const likedPostsByCurrentUser = res.data
            .filter(post => post.likes.includes(currentUserId))
            .map(post => post._id);
          setLikedPosts(likedPostsByCurrentUser);
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
      console.log(error);
    }
  };

  const handleUnlikeButton = (postId) => {
    httpAPICall({
      method: "post",
      url: `${BaseUrl}posts/unlike/${postId}`, // Use the correct API endpoint for unliking
    })
      .then((res) => {
        console.log("response", res.data);
        if (res.status === false) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          // Remove the unliked post from the likedPosts state
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  

  const handleLikeButton = (postId) => {
    // Check if the post is already liked

    if (likedPosts.includes(postId)) {
      handleUnlikeButton(postId);
    } else {
      httpAPICall({
        method: "post",
        url: `${BaseUrl}posts/like/${postId}`,
      })
        .then((res) => {
          console.log("response", res.data);
          if (res.status === false) {
            toast.error(res.message);
          } else {
            toast.success(res.message);
            // Update liked posts state
            setLikedPosts([...likedPosts, postId]);
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  



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
        {/* post1 */}
        {posts?.length > 0 ? (
          <div className="post-container">
            {posts.map((post, index) => (
              <div className="card home-card" key={index}>
                <div className="card-header">
                  <img
                    className="profile-pic"
                    src={post.user.profileImage}
                    alt="Profile"
                  />
                  <h5>{post.user.username}</h5>
                </div>
                <div className="card-image">
                  {/* Render post image or video */}
                  {post.post.length === 1 ? (
                    <img
                      className="post-image"
                      src={post.post[0]}
                      alt={`Post ${index + 1}`}
                    />
                  ) : (
                    <AwesomeSlider>
                      {post.post.map((image, imageIndex) => (
                        <div key={imageIndex}>
                          <img src={image} alt={`Post ${index + 1}`} />
                        </div>
                      ))}
                    </AwesomeSlider>
                  )}
                </div>
                <div className="card-footer">
                  <div>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`btnNew icon ${
                        likedPosts.includes(post._id) ? "liked" : "unlike"
                      }`}

                      onClick={() => handleLikeButton(post._id)}
                    />
                    {/* <Link> */}
                    <span>{post.likes.length} likes</span>
                    {/* </Link> */}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faComment} className="icon" />
                    <span>{post.comments.length}</span>
                  </div>
                  <FontAwesomeIcon icon={faShare} className="icon" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No posts</p>
          </div>
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
        </footer>
      </div>
    </>
  );
};

export default Home;
