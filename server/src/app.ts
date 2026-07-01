import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import scoreRoutes from './routes/score.route.js';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // autorise les requêtes sans origine (ex: Postman, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "CODA_SHMUP API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes)
app.use("/scores", scoreRoutes);

export default app;