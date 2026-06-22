import { Request, Response } from "express";
import { createScoreSchema } from "../schemas/score.schema.js";
import * as scoreService from "../services/score.service.js";
import { HttpError } from "../utils/http-error.js";
import { ZodError } from "zod";

export async function createScore(
  request: Request,
  response: Response
): Promise<void> {
  try {
    if (!request.user) {
      response.status(401).json({
        error: "User is not authenticated",
      });
      return;
    }

    const data = createScoreSchema.parse(request.body);

    const score = await scoreService.createScore(request.user.id, data);

    response.status(201).json({
      message: "Score created successfully",
      score,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      response.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }

    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Validation error",
        details: error.issues.map((issue) => issue.message),
      });
      return;
    }
    
    response.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function getLeaderboard(
  _request: Request,
  response: Response
): Promise<void> {
  try {
    const leaderboard = await scoreService.getLeaderboard();

    response.status(200).json({
      leaderboard,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      response.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }

    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Validation error",
        details: error.issues.map((issue) => issue.message),
      });
      return;
    }

    response.status(500).json({
      error: "Internal server error",
    });
  }
}