import { Request, Response } from "express";

import { createScoreSchema } from "../schemas/score.schema.js";
import * as scoreService from "../services/score.service.js";

export async function createScore(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: "User is not authenticated",
      });
      return;
    }

    const data = createScoreSchema.parse(req.body);

    const score = await scoreService.createScore(req.user.id, data);

    res.status(201).json({
      message: "Score created successfully",
      score,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getLeaderboard(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const leaderboard = await scoreService.getLeaderboard();

    res.status(200).json({
      leaderboard,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}