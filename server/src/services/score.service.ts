import { prisma } from "../lib/prisma.js";
import type { CreateScoreInput } from "../schemas/score.schema.js";

export async function createScore(userId: string, data: CreateScoreInput) {
  const ship = await prisma.ship.findFirst({
    where: {
      id: data.shipId,
      userId,
    },
  });

  if (!ship) {
    throw new Error("Ship not found for this user");
  }

  const score = await prisma.score.create({
    data: {
      value: data.value,
      shipId: data.shipId,
    },
  });

  return score;
}

export async function getLeaderboard() {
  const scores = await prisma.score.findMany({
    orderBy: {
      value: "desc",
    },
    take: 10,
    select: {
      id: true,
      value: true,
      createdAt: true,
      ship: {
        select: {
          id: true,
          customName: true,
          spriteName: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return scores;
}