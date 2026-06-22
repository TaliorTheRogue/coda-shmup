import { Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";
import { ZodError } from "zod";
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

export async function login(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const data = loginSchema.parse(request.body);

    const result = await authService.login(data);

    response.status(200).json(result);
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