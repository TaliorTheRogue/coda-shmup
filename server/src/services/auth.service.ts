import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/http-error.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";

export async function register(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (existingUser) {
    throw new HttpError(
      409,
      "Username already exists"
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      passwordHash,

      ships: {
        create: {
          customName: "MyFirstShip",
          spriteName: "default_ship",
        },
      },
    },

    include: {
      ships: true,
    },
  });

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ships: user.ships,
  };
};

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
    include: {
      ships: true,
    },
  });

  if (!user) {
    throw new HttpError(
      401,
      "Invalid Credentials"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new HttpError(
      401,
      "Invalid Credentials"
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      ships: user.ships,
    },
  };
};