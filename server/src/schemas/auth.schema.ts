import { z } from "zod";
import { containsBanword } from "../lib/banwords.js";

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters")
    .max(20, "Username must contain at most 20 characters")
    .regex(usernameRegex, "Username can only contain letters, numbers and underscores")
    .refine((value) => !containsBanword(value), {
      message: "Username contains forbidden words",
    }),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;