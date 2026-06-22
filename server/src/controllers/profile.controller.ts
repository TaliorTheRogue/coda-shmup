import { Request, Response } from "express";
import * as profileService from "../services/profile.service.js";
import { HttpError } from "../utils/http-error.js";

export async function getProfile(
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

    const profile = await profileService.getProfile(request.user.id);

    response.status(200).json(profile);
  } catch (error) {
    if (error instanceof HttpError) {
      response.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }
    response.status(500).json({
      error: "Internal server error",
    });
  }
}