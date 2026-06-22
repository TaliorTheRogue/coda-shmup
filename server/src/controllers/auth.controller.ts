import { Request, response, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";

export async function register(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const data = registerSchema.parse(request.body);

    const user = await authService.register(data);

    response.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function login(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const data = loginSchema.parse(request.body);

    const result = await authService.login(data);

    response.status(200).json(result);
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}