import React from 'react';
import "./App.css";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from "./screens/login";
import SignUp from "./screens/Signup";
import ForgetPass from './screens/ForgetPass';
import Profile from './screens/Profile';
import PostHome from './screens/PostHome';
import UserProfile from './screens/userProfile';
import Message from './screens/Message';
import Chat from './screens/Chat';
import CreatePost from './screens/CreatePost';
import SearchUser from './screens/SearchUser';
import UserFollowerList from './screens/UserFollowersList';
import UserFollowingList from './screens/UserFollowingList';
// import Feed from './screens/Feed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget/password" element={<ForgetPass />} />
        <Route path="/profile/:id" element={<Profile />} />

        {/* post feed or Home */}
        <Route path="/post/feed" element={<PostHome/>}/>

        <Route path="/user/profile/:userId" element={<UserProfile/>}/>

        <Route path= "/message" element={<Message/>}/>

        {/* chat */}
        <Route path= "/chat/:userId" element={<Chat/>} />

        <Route path= "/create/post" element={<CreatePost/>} />

        <Route path= "/search" element={<SearchUser/>} />

        <Route path= "/followers/:userId" element={<UserFollowerList/>} />
        <Route path= "/following/:userId" element={<UserFollowingList/>} />



      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={"colored"}
      />
    </Router>
  );
}

export default App;
