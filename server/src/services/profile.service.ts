import { prisma } from "../lib/prisma.js";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
      ships: {
        select: {
          id: true,
          customName: true,
          spriteName: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}