import { z } from "zod";

export const createScoreSchema = z.object({
  shipId: z.string().uuid("Invalid ship id"),
  value: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score must be positive"),
});

export type CreateScoreInput = z.infer<typeof createScoreSchema>;