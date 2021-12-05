import express from "express";

import ExternalUser from "../models/Externaluser.js";
import Post from "../models/Post.js";
import { statusCodes } from "../utils/constants.js";
import { getFakePostData, getFakeUserData } from "../utils/script.js";
import { reqToDbFailed } from "../utils/utils.js";

const router = express.Router();

router.get("/fake/one", (req, res) => {
  const data = getFakeUserData();

  res.status(statusCodes.ok).json({
    status: true,
    data,
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
    user = ExternalUser.findOne({ _id: id });
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

router.get("/user/:email/:mobile", async (req, res) => {
  const { email, mobile } = req.params;

  if (!email && !mobile) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "email or mobile required",
    });
    return;
  }
  let user;

  const filter = {};
  if (email) filter.email = email;
  else if (mobile) filter.mobile = mobile;

  try {
    user = ExternalUser.findOne(filter);
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }

  if (!user) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid ${email ? email : mobile}`,
    });
    return;
  }

  res.status(statusCodes.ok).json({
    status: true,
    message: "User found",
    data: user,
  });
});

router.get("/user/posts/:userId", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "User id missing",
    });
    return;
  }

  let posts;

  try {
    posts = Post.find({ userId: id });
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

export default router;
