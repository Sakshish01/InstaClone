
// userRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, update, follow, unfollow, logout, viewProfile, changePassword, forgetPassword, resetPassword, addFriend, deleteFriend, deleteAllFriends, viewCloseFriendsList,  acceptFollowRequest, declioneFollowRequest,  viewUserStory,
    storyFeed,   searchUser , followersList, followingList  } = require("../controller/UserController");
const protect = require("../middleware/authMiddleware");
// const {addFriend} = require("../controller/CloseFriendsController");

// const  profileUpload  = require("../extras/multer");

const {addMessage} = require("../controller/MessageController")
const {profileUpload} = require("../extras/multer");

router.post("/register", register);
router.post("/login", login);
// router.get("/profile", protect, profile);
router.get("/viewProfile/:id", protect, viewProfile);
router.patch("/update/:id", protect, profileUpload.single('profile'), update);
router.post("/follow/:id", protect, follow);
router.post("/unfollow/:id", protect, unfollow);   
router.post("/logout", protect, logout);
router.post("/password/change", protect, changePassword);
router.post("/password/forget", forgetPassword);
router.post("/password/reset", protect, resetPassword);

//accept or decline follow requests
router.post("/follow/accept/:id", protect, acceptFollowRequest);
router.post("/follow/decline/:id", protect, declioneFollowRequest);


//close friend routes
router.post("/add/closeFriend", protect, addFriend);
router.post("/delete/closeFriend", protect, deleteFriend);
router.post("/deleteAll/closeFriend", protect, deleteAllFriends);
router.get("/view/closeFriend", protect, viewCloseFriendsList);

//user story routes
router.post("/story/view/:id", protect, viewUserStory);
router.post("/story/feed", protect, storyFeed);

//message 
router.post("/message/:id", protect, addMessage);

//search user
router.get("/search", protect, searchUser);

//users followers list
router.get("/followers/:id", protect, followersList);

router.get("/following/:id", protect, followingList);


module.exports = router;
