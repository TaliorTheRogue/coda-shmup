import { apiFetch } from "./apiClient";

export type CreateScoreRequest = {
  shipId: string;
  value: number;
};

export type Score = {
  id: string;
  value: number;
  shipId: string;
  createdAt: string;
};

export type LeaderboardEntry = {
  id: string;
  value: number;
  createdAt: string;
  ship: {
    id: string;
    customName: string;
    spriteName: string;
    user: {
      id: string;
      username: string;
    };
  };
};

export type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

export async function createScore(
  data: CreateScoreRequest
): Promise<{ message: string; score: Score }> {
  return apiFetch<{ message: string; score: Score }>("/scores", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  return apiFetch<LeaderboardResponse>("/scores/leaderboard");
}