import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/http-error.js";

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
    throw new HttpError(
      404,
      "User not found"
    );
  }

  return user;
}