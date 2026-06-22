import { Request, Response } from "express";

import * as profileService from "../services/profile.service.js";

export async function getProfile(
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

    const profile = await profileService.getProfile(req.user.id);

    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}