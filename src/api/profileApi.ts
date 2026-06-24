import { apiFetch } from "./apiClient";

export type Ship = {
  id: string;
  customName: string;
  spriteName: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  username: string;
  createdAt: string;
  ships: Ship[];
};

export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/profile");
}