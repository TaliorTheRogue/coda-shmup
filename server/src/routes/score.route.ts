import { Router } from "express";

import {
  createScore,
  getLeaderboard,
} from "../controllers/score.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createScore);

router.get("/leaderboard", getLeaderboard);

export default router;