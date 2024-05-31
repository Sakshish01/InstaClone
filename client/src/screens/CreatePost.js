import "../App.css";
import React, { useState } from "react";
import { toast } from "react-toastify";
import httpAPICall from "../Services";
import { Link, useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [captions, setCaptions] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // setPosts(files);
    setPosts((prev)=> ({...prev, files }))

  };

  const handleCaptionChange = (e) => {
    setCaptions(e.target.value);
  };

  const handleTaggedUserChange = (e) => {
    const files = Array.from(e.target.files);

    setTaggedUsers(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform submission logic, e.g., send data to server
    console.log("Submitting posts:", { posts, captions, taggedUsers });
    // Reset form fields after submission
    setPosts([]);
    setCaptions("");
    setTaggedUsers([]);
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post" className="custom-file-upload">
            Select posts:
          </label>
          <input
            type="file"
            id="post"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="file-upload-box" onClick={() => document.getElementById('post').click()}>
            <span>+</span>
          </div>
        </div>
        {posts.length > 0 && (
          <div className="form-group image-gallery">
            {posts.map((image, index) => (
              <div className="image-container" key={index}>
                <img src={URL.createObjectURL(image)} alt={`Post ${index}`} />
              </div>
            ))}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="caption">Caption:</label>
          <input
            type="text"
            id="caption"
            value={captions}
            onChange={handleCaptionChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tagged-user">Tagged User:</label>
          <input
            type="text"
            id="tagged-user"
            value={taggedUsers}
            onChange={handleTaggedUserChange}
          />
        </div>
        <button type="submit" disabled={posts.length === 0}>
          Submit
        </button>
        {posts.length === 0 && (
          <p>Please select one or more posts to continue.</p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
