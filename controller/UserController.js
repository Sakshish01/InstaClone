const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../extras/generateToken");
const bcrypt = require("bcrypt");
// const Token = require("../models/token");
const { sendEmail, sendResetPassEmail } = require("../mail");
const otp = require("../models/otp");
const Story = require("../models/story");
const postedTime = require("../extras/functions");
const cloudinaryUpload = require("../extras/cloudinary");
const user = require("../models/user");

const registerValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .notEmpty()
    .withMessage("Name is required"),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
];

const register = asyncHandler(async (req, res) => {
  // console.log("oppp");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const existingUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists", data: null });
  }
  // Generate a salt
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password using the salt
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // if(req.file){

  //   const profileImagePath = profileImage.path;
  // }


  const user = new User({
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    password: hashedPassword,
    bio: req.body.bio,
    // profileImage: profileImagePath,
  });

  await user.save();

  // sendEmail(user.email, user.name);

  const token = generateAccessToken(user._id);

  return res.status(201).json({ message: "User registered", data: token });
});

const asyncRegister = [registerValidationRules, register];

const userLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
  }
  const existingUser = await User.findOne({ username: req.body.username });
  console.log(existingUser);
  if (existingUser) {
    const password = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    console.log(password, req.body.password, existingUser.password);

    if (password) {
      const AccessToken = generateAccessToken(existingUser._id);
      const RefreshToken = generateRefreshToken(existingUser._id);

      existingUser.RefreshToken = RefreshToken;
      await existingUser.save();
      // console.log(existingUser);
      // const tokenUser = new Token({ token: token, user: existingUser._id, createdAt: Date.now() });
      // await tokenUser.save();
      // console.log(existingUser);
      // console.log(tokenUser);
      // console.log(tokenUser);
      res
        .status(200)
        .json({ message: "Login successfull", data: AccessToken, currentUserId: existingUser._id });
    } else {
      res.status(400).json({ message: "Invalid password", data: null });
    }
  } else {
    res.status(400).json({ message: "Invalid credentials", data: null});
  }
});

// const userProfile = asyncHandler(async (req, res) => {
//   const userDetails = await User.findById(req.user.userId).populate("posts");
//   const followersCount = userDetails.followers.length;
//   const followingCount = userDetails.following.length;
//   const postsCount = userDetails.posts.length;
//   if (userDetails) {
//     res.status(200).json({
//       message: "Details fetch successfull",
//       data: { userDetails, followersCount, followingCount, postsCount },
//     });
//   } else {
//     res.status(400).json({ message: "Details fetch not successfull" });
//   }
// });

const viewProfile = asyncHandler(async (req, res) => {
  // console.log("hello");
  console.log(req.params.id);
  const loggedUser = await User.findById(req.user.userId).populate('posts');

  if (req.params.id === req.user.userId) {
    const followersCount = loggedUser.followers.length;
    const followingCount = loggedUser.following.length;
    const postsCount = loggedUser.posts.length;
    if (loggedUser) {
      res.status(200).json({
        status: true,
        message: "Details fetch successfull",
        data: { user: loggedUser, followersCount, followingCount, postsCount },
      });
    } else {
      res.status(400).json({ status: false, message: "Details fetch not successfull" });
    }
  }else{

    const user = await User.findById(req.params.id).populate("posts");
    if (user) {
      if (user.is_public === 1) {
        const followersCount = user.followers.length;
        const followingCount = user.following.length;
        const postsCount = user.posts.length;
  
        res.status(200).json({
        status: true,
          message: "Details fetch successfull",
          data: { user, followersCount, followingCount, postsCount },
        });
      } else {
        // console.log(loggedUser)
        if (
          loggedUser &&
          loggedUser.following &&
          loggedUser.following.includes(req.params.id)
        ) {
          const followersCount = user.followers.length;
          const followingCount = user.following.length;
          const postsCount = user.posts.length;
  
          res.status(200).json({
        status: true,

            message: "Details fetch successfull",
            data: { user, followersCount, followingCount, postsCount },
          });
        } else {
          res.status(400).json({
        status: false,

            message: "Account is private",
          });
        }
      }
    } else {
      res.status(404).json({
        status: false,

        message: "User not found",
      });
    }
  }

});

const editProfile = asyncHandler(async (req, res) => {
  // console.log("req.file:", req.file); // Log for debugging

  const { name, username, bio, is_public } = req.body;
  // const { profileImage } = req.file;
  var user = await User.findById(req.params.id);

  const isImageValid =
    req.file &&
    (req.file.mimetype.startsWith("image/jpeg") ||
      req.file.mimetype.startsWith("image/jpg") ||
      req.file.mimetype.startsWith("image/png"));

  if (user) {
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (is_public) user.is_public = is_public;
    // if (profileImage) user.profileImage = profileImage;
    if (isImageValid) {
      const cloudinaryResponse = await cloudinaryUpload(req.file.path, res);
      console.log(cloudinaryResponse);
      user.profileImage = cloudinaryResponse.secure_url;
    } else {
      res.status(400).json({ message: "Image type is not valid" });
    }
    await user.save();

    res.status(200).json({ message: "User details updated.", data: user });
  } else {
    res.status(400).json({ message: "User not found" });
  }
});

const follow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  let currentUser = await User.findById(req.user.userId);
  if (user && currentUser) {
    // console.log('User', user);
    // console.log('currUser', currentUser);
    if(user._id.toString() === currentUser._id.toString()){
      res.status(404).json({
        message: "User dont follow self",
      });
    }

    if(currentUser.following.includes(user._id.toString())){
      res.status(409).json({
        message: "Following already",
      });
    }
    if (user.is_public === 0) {
      //user account is private
      user.followRequests.push(currentUser._id);
      await user.save();
      res.status(200).json({
        message: "Follow request sent successfully",
      });
    } else {
      user.followers.push(currentUser._id);
      currentUser.following.push(user._id);

      await currentUser.save();
      await user.save();

      // console.log(user, req.user);
      res.status(200).json({
        message: "Followed successfully",
      });
    }
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});

const unfollow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(user)
  let currentUser = await User.findById(req.user.userId);
  if (user && currentUser.following.includes((user._id.toString()))) {
    user.followers.remove(req.user.userId);
    console.log(user);
    currentUser.following.remove(user._id);
    await user.save();
    await currentUser.save();
    res.status(200).json({
      message: "Unfollowed successfully",
    });
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});

const acceptFollowRequest = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const requestedUser = await User.findById(req.params.id);

  if (!currentUser) {
    res.status(404).json({
      message: "User not found",
    });
  }

  if (
    !requestedUser ||
    !currentUser.followRequests.includes(requestedUser._id)
  ) {
    res.status(404).json({
      message: "Requested User not found",
    });
  }
  currentUser.followers.push(requestedUser._id);
  requestedUser.following.push(currentUser._id);
  await currentUser.save();
  await requestedUser.save();

  res.status(200).json({
    message: "Request accepted",
  });
});

const declioneFollowRequest = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const requestedUser = await User.findById(req.params.id);

  if (!currentUser) {
    res.status(404).json({
      message: "User not found",
    });
  }

  if (
    !requestedUser ||
    !currentUser.followRequests.includes(requestedUser._id)
  ) {
    res.status(404).json({
      message: "Requested User not found",
    });
  }

  currentUser.followRequests.remove(requestedUser._id);
  await currentUser.save();

  res.status(200).json({
    message: "Request declined",
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if oldPassword, newPassword, and confirmPassword are defined and not empty
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All password fields must be provided" });
    }

    // Check if the old password matches the hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(404).send({
      message: "Email is required",
    });
  }
  const user = await User.findOne(req.user.email);
  console.log(user);
  const RandomOtp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiration = Date.now() + 300000;

  if (user) {
    const otpInstance = new otp({
      email: req.body.email,
      otp: RandomOtp,
      expiresAt: otpExpiration,
    });

    await otpInstance.save();
    // console.log();

    // sendResetPassEmail(
    //   user.name,
    //   user.name,
    //   otpInstance.otp,
    //   otpInstance.expiresAt
    // );

    res.status(200).json({
      message: "Otp sent",
    });
  } else {
    res.status(400).json({
      message: "Email not found",
      status: false,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  if (!req.body.otp) {
    res.status(404).send({
      message: "Otp is required",
    });
  }

  if (!req.body.password) {
    res.status(404).send({
      message: "Password is required",
    });
  }

  const user = await User.findById(req.user.userId);
  const savedOtp = await otp.findOne({ otp: req.body.otp });
  // console.log(savedOtp);

  if (req.body.otp === savedOtp.otp && savedOtp.expiresAt > Date.now()) {
    if (req.body.password === user.password) {
      res.status(400).json({
        message: "Please dont use previous password",
        status: false,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successfull",
      status: true,
    });
  } else {
    res.status(400).json({
      message: "Password not reset",
      status: false,
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId }, // Filter
    { $unset: { RefreshToken: "" } } // Update
  );
  if (!user) {
    res.status(400).json({
      status: false,
      message: "User not logged out"
    });
  }
  const userss = await User.findById(req.user.userId);
  console.log(userss);
  res.status(200).json({
    status: true,
    message: "Logged out successfully",
  });
});

//close friens routes

const addFriend = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    // let users = [];
    const users = req.body.users;

    if (!currentUser) {
      res.status(404).json({
        message: "User not found",
      });
    }

    if (!users || !Array.isArray(users)) {
      res.status(400).json({
        message: "Users array required",
      });
    }
    // console.log(users);

    for (const user of users) {
      const friend = await User.findById(user);

      if (!friend) {
        res.status(400).json({ message: `User with ID ${friend} not found.` });
      }

      // if (!currentUser.following.includes(friend)) {
      //   res.status(400).json({message :`Friend  with ${friend._id} is not in the following list.`});
      // }

      // if (currentUser.closeFriends.includes(friend._id)) {
      //   // console.log(`Friend with ID ${friend._id} is already in close friends list.`);
      //   res
      //     .status(400)
      //     .json({
      //       message: `Friend with ID ${friend._id} is already in close friends list.`,
      //     });
      //   continue; // Skip adding duplicate entry
      // }

      currentUser.closeFriends.push(friend._id);
    }
    await currentUser.save();

    res.status(200).json({
      message: "Close friends added",
    });
  } catch (error) {
    console.error("Error adding close friends:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

const deleteFriend = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);

  const users = req.body.users;

  if (!currentUser) {
    res.status(404).json({
      message: "User not found",
    });
  }

  if (!users || !Array.isArray(users)) {
    res.status(400).json({
      message: "Users array required",
    });
  }

  for (const user of users) {
    const friend = await User.findById(user);

    if (!friend) {
      res.status(400).json({ message: `User with ID ${friend} not found.` });
    }

    if (!currentUser.following.includes(friend)) {
      res.status(400).json({
        message: `Friend  with ${friend._id} is not in the following list.`,
      });
    }

    user.closeFriends.remove(friend);
  }
  await currentUser.save();

  res.status(200).json({
    message: "Close friends deleted",
  });
});

const deleteAllFriends = asyncHandler(async (req, res) => {
  currentUser = await User.findById(req.user.userId);

  if (!currentUser) {
    res.status(404).json({
      message: "User not found",
    });
  }

  currentUser.closeFriends = [];
  await currentUser.save();

  res.status(200).json({
    message: "All close friends deleted",
  });
});

const viewCloseFriendsList = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const limit = req.params.limit ? parseInt(req.params.limit) : 10;
  const offset = req.params.offset ? parseInt(req.params.offset) : 0;

  if (req.params.keyword) {
    const keyword = req.params.keyword.trim();
    const searchedUser = await User.find({
      $or: [
        { username:{ $regex: keyword, $options: 'i' } }, 
        { name: { $regex: keyword, $options: 'i'} }
      ],
    }).limit(limit).skip(offset);
    const userCount = searchedUser.length;
    if (userCount === 0) {
      res.status(404).json({
        message: "Searched user not found",
      });
    }

    res.status(200).json({
      message: "User found.",
      data: {
        userCount: userCount,
        userData: searchedUser,
      },
    });
  }

  if (!currentUser) {
    res.status(404).json({
      message: "User not found",
    });
  }

  const closeFriends = currentUser.closeFriends;

  res.status(200).json({
    message: "Close friends list retrieved",
    data: closeFriends,
  });
});


//user story routes

const viewUserStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  const postedAgoTime = postedTime(story.createdAt);

  if (!story) {
    res.status(404).json({
      message: "Story not found",
    });
  }

  res.status(200).json({
    message: "Story data retrieved successfully",
    data: {
      story,
      postedAgoTime,
    },
  });
});

const storyFeed = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const followings = currentUser.following;

  const stories = await Story.find({
    user: { $in: followings },
  })
    .sort({ createdAt: -1 }) //descending order
    .limit(5);

  stories.forEach(
    (story) => (story.postedAgoTime = postedTime(story.createdAt))
  );

  const storyCount = stories.length();

  res.status(200).json({
    message: "Story feed fetched",
    data: { stories, storyCount },
  });
});

// search user
const searchUser = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;
  const regexPattern = new RegExp(keyword, 'i');
  const users = await User.find({$or: [
    {name: regexPattern},
    {username: regexPattern}
  ]});

  if(users && users.length !== 0){
    res.status(200).json({
      status: true,
      message: "User found",
      users: users
    })
  }else{
    res.status(404).json({
      status: false,
      message: "User not found",
    })
  }

});

// followers list for user
const followersList = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const followers = await User.findById(userId).select('followers').populate({
    path: 'followers',
    select: 'name profileImage username'
  });
  if(followers){
    res.status(200).json({
      status: true,
      message: "Users followers found",
      data: followers
    })
  }else{
    res.status(404).json({
      status: false,
      message: "Users followers not found"
    })
  }
});

const followingList = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const followers = await User.findById(userId).select('following').populate({
    path: 'following',
    select: 'name profileImage username'
  });
  if(followers){
    res.status(200).json({
      status: true,
      message: "Users followers found",
      data: followers
    })
  }else{
    res.status(404).json({
      status: false,
      message: "Users followers not found"
    })
  }
})

module.exports = {
  register: asyncRegister,
  login: userLogin,
  // profile: userProfile,
  update: editProfile,
  follow,
  unfollow,
  logout,
  viewProfile,
  changePassword,
  forgetPassword,
  resetPassword,
  addFriend,
  deleteFriend,
  deleteAllFriends,
  viewCloseFriendsList,
  acceptFollowRequest,
  declioneFollowRequest,
  viewUserStory,
  storyFeed,
  searchUser,
  followersList,
  followingList
};
