import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import "../App.css";
import httpAPICall from "../Services";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const SearchUser = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL
  const loggedInUser = localStorage.getItem("currentUserId");
  const currentUserId = loggedInUser;
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value.trim());
  };

  const handleSearch = async () => {
    try {
      let data = {
        keyword: query
      }
      const response = await httpAPICall({
        method: "get",
        url: `${BaseUrl}users/search`,
        params: data,
      });

      if (response.status === false) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        setSearchResults(response.users);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const renderSearchResults = () => {
    return searchResults.map((user) => (
      <Link key={user.id} to={`/user/profile/${user._id}`} className="user-profile">
      <div key={user.id} className="user-profile" >
        <img
          src={user.profileImage}
          alt={user.username}
        />
        <span><h4>{user.username}</h4></span>
        {/* <p>{user.name}</p> */}
      </div>
      </Link>
    ));
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
        <div className="container">
          <h1>Search Users</h1>
          <div className="search-bar">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div id="searchResults">
            {searchResults.length > 0 ? renderSearchResults() : null}
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
export default SearchUser;
