import express from "express";

import ExternalUser from "../models/Externaluser.js";
import Post from "../models/Post.js";
import { hateSpeech, statusCodes, dbTypes } from "../utils/constants.js";
import {
  generatePosts,
  generateUsers,
  getFakePostData,
  getFakeUserData,
} from "../utils/script.js";
import {
  reqToDbFailed,
  validateEmail,
  validateMobile,
} from "../utils/utils.js";

const router = express.Router();

router.get("/fake/one", (req, res) => {
  const data = getFakeUserData();
  const postData = getFakePostData();

  res.status(statusCodes.ok).json({
    status: true,
    data,
    postData,
  });
});

router.get("/user/find", async (req, res) => {
  const { email, mobile } = req.query;

  if (!email && !mobile) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "email or mobile required",
    });
    return;
  }

  if (email && !validateEmail(email)) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid email`,
    });
    return;
  }

  if (mobile && !validateMobile(mobile)) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid mobile`,
    });
    return;
  }

  let users;

  const filter = {};
  if (email) filter.email = email;
  else if (mobile) filter.mobile = mobile;

  try {
    users = await ExternalUser.find(filter);
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }

  if (users.length == 0) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Can't find ${
        email ? "email - " + email : "mobile - " + mobile
      }`,
    });
    return;
  }

  res.status(statusCodes.ok).json({
    status: true,
    message: "User found",
    data: users,
  });
});

router.get("/user/posts/:userId/:dbType", async (req, res) => {
  const id = req.params.userId;
  const dbType = req.params.dbType;

  if (!id) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "User id missing",
    });
    return;
  }

  if (!dbType) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "User dbType missing",
    });
    return;
  }

  let posts;

  try {
    posts = await Post.find({ userId: id, dbTypes: { $in: [dbType] } });
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }

  if (posts.length == 0) {
    res.status(statusCodes.noDataAvailable).json({
      status: false,
      message: "No Post found",
    });
    return;
  }

  res.status(statusCodes.ok).json({
    status: true,
    message: "Posts found",
    data: posts,
  });
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "Id missing",
    });
    return;
  }
  let user;

  try {
    user = await ExternalUser.findOne({ _id: id });
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }

  if (!user) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: "Invalid Id",
    });
    return;
  }

  const posts = await Post.find({ userId: id });

  if (posts.length == 0) {
    res.status(statusCodes.ok).json({
      status: true,
      message: "User found",
      data: user,
      flag: {
        [dbTypes.fb]: 0,
        [dbTypes.insta]: 0,
        [dbTypes.twitter]: 0,
      },
    });
    return;
  }

  const regex = new RegExp(hateSpeech.join("|"), "gi");

  const fbFlags = [];
  const instaFlags = [];
  const twitterFlags = [];
  posts.forEach((item) => {
    const description = item.desc;
    const count = description?.match(regex)?.length;

    if (count >= 15) {
      switch (item.dbType) {
        case dbTypes.fb: {
          fbFlags.push(-3);
          break;
        }
        case dbTypes.insta: {
          instaFlags.push(-3);
          break;
        }
        case dbTypes.twitter: {
          twitterFlags.push(-3);
          break;
        }
      }
    } else if (count >= 10) {
      switch (item.dbType) {
        case dbTypes.fb: {
          fbFlags.push(-2);
          break;
        }
        case dbTypes.insta: {
          instaFlags.push(-2);
          break;
        }
        case dbTypes.twitter: {
          twitterFlags.push(-2);
          break;
        }
      }
    } else if (count >= 5) {
      switch (item.dbType) {
        case dbTypes.fb: {
          fbFlags.push(-1);
          break;
        }
        case dbTypes.insta: {
          instaFlags.push(-1);
          break;
        }
        case dbTypes.twitter: {
          twitterFlags.push(-1);
          break;
        }
      }
    } else {
      switch (item.dbType) {
        case dbTypes.fb: {
          fbFlags.push(0);
          break;
        }
        case dbTypes.insta: {
          instaFlags.push(0);
          break;
        }
        case dbTypes.twitter: {
          twitterFlags.push(0);
          break;
        }
      }
    }
  });
  console.log(fbFlags, instaPosts, twitterPosts);
});

// router.get("/generate", async (req, res) => {
//   await generatePosts();
// });

export default router;
