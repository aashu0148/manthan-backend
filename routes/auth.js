import express from "express";

import {
  comparePassword,
  hashPassword,
  reqToDbFailed,
  validateEmail,
} from "../utils/utils.js";
import { signToken, verifyToken } from "../utils/authToken.js";
import { statusCodes } from "../utils/constants.js";
import UserModel from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: `Missing fields -${password ? "" : "password,"} ${
        email ? "" : "email"
      }`,
    });
    return;
  }

  if (!validateEmail(email)) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid email`,
    });
    return;
  }

  let user;

  try {
    user = await UserModel.findOne({ email: email });
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }

  if (!user) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid email, can't find user`,
    });
    return;
  }

  const hashedPassword = user.password;

  if (!comparePassword(password, hashedPassword)) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid credentails, can't find user`,
    });
    return;
  }

  const token = signToken({
    id: user._id,
  });
  user.authToken = token;

  user
    .save()
    .then(() => {
      res.status(statusCodes.ok).json({
        status: true,
        message: `User found`,
        data: user,
      });
    })
    .catch((err) => {
      res.status(statusCodes.somethingWentWrong).json({
        status: false,
        message: `Error loggin in`,
        error: err,
      });
      return;
    });
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: `Missing fields - ${firstName ? "" : "first name,"} ${
        lastName ? "" : "last name,"
      } ${password ? "" : "password,"} ${email ? "" : "email"}`,
    });
    return;
  }

  if (!validateEmail(email)) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Invalid email`,
    });
    return;
  }

  const hashedPassword = hashPassword(password);

  let userWithEmail;
  try {
    userWithEmail = await UserModel.findOne({
      email: String(email).toLowerCase(),
    });
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }
  if (userWithEmail) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: `Email already exists. Try loggin in`,
    });
    return;
  }

  const newUser = new UserModel({
    firstName,
    lastName,
    email: String(email).toLowerCase(),
    password: hashedPassword,
  });

  const token = signToken({
    id: newUser._id,
  });
  newUser.authToken = token;

  newUser
    .save()
    .then((response) => {
      res.status(statusCodes.created).json({
        status: true,
        message: `New user created`,
        data: response,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(statusCodes.somethingWentWrong).json({
        status: false,
        message: `Error creating user`,
        error: err,
      });
      return;
    });
});

router.get("/authenticate", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(statusCodes.missingInfo).json({
      status: false,
      message: "Authorization failed, token not found.",
    });
    return;
  }

  const result = verifyToken(token);
  if (!result) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: "Authorization failed, invalid token.",
    });
    return;
  }

  const id = result.id;

  let user;
  try {
    user = await UserModel.findOne({ _id: id });
  } catch (err) {
    reqToDbFailed(res, err);
    return;
  }
  if (!user) {
    res.status(statusCodes.invalidDataSent).json({
      status: false,
      message: "Authorization failed, user not found",
    });
    return;
  }

  res.status(statusCodes.ok).json({
    status: true,
    message: "User authenticated",
  });
});

export default router;
