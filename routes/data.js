import express from "express";

import { statusCodes } from "../utils/constants.js";
import { getFakeData } from "../utils/script.js";

const router = express.Router();

router.get("/fake/one", (req, res) => {
  const data = getFakeData();

  res.status(statusCodes.ok).json({
    status: true,
    data,
  });
});

export default router;
