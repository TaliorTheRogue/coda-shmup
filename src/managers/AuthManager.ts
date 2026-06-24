import { login } from "../api/authApi";
import { getProfile, type UserProfile } from "../api/profileApi";

export class AuthManager {
  private static instance: AuthManager;

  private token: string | null = null;
  private user: UserProfile | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }

    return AuthManager.instance;
  }

  public isAuthenticated(): boolean {
    return this.token !== null;
  }

  public getUser(): UserProfile | null {
    return this.user;
  }

  public async login(
    username: string,
    password: string
  ): Promise<void> {
    const result = await login({
      username,
      password,
    });

    this.token = result.token;

    localStorage.setItem(
      "token",
      result.token
    );

    await this.loadProfile();
  }

  public logout(): void {
    this.token = null;
    this.user = null;

    localStorage.removeItem("token");
  }

  public async loadProfile(): Promise<void> {
    this.user = await getProfile();
  }
}