import express from "express";

import ExternalUser from "../models/Externaluser.js";
import Post from "../models/Post.js";
import { statusCodes } from "../utils/constants.js";
import { getFakeUserData } from "../utils/script.js";
import {
  reqToDbFailed,
  validateEmail,
  validateMobile,
} from "../utils/utils.js";

const router = express.Router();

router.get("/fake/one", (req, res) => {
  const data = getFakeUserData();

  res.status(statusCodes.ok).json({
    status: true,
    data,
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

router.get("/user/posts/:userId", async (req, res) => {
  const id = req.params.userId;

  if (!id) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "User id missing",
    });
    return;
  }

  let posts;

  try {
    posts = await Post.find({ userId: id });
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

  res.status(statusCodes.ok).json({
    status: true,
    message: "User found",
    data: user,
  });
});

export default router;
