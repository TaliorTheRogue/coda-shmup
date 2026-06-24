import GameConstants from "../GameConstants.ts";
import { register } from "../api/authApi.ts";
import { AuthManager } from "../managers/AuthManager.ts";
import { createScore } from "../api/scoreApi.ts";
import SaveConstants from "../SaveConstants.ts";
import SaveManager from "../managers/SaveManager.ts";

type AuthMode = "login" | "register";

export default class AuthScene extends Phaser.Scene {
    private mode: AuthMode = "login";

    constructor() {
        super(GameConstants.SceneKeys.AUTH);
    }

    init(data: { mode?: AuthMode }) {
        this.mode = data.mode ?? "login";
    }

    private async savePendingScoreIfExists(): Promise<void> {
      const saveManager = this.plugins.get(SaveManager.PLUGIN_KEY) as SaveManager;
      const pendingScore = saveManager.getData(SaveConstants.Keys.PLAYER_PENDING_SCORE);

      if (!pendingScore) {
        return;
      }

      const user = AuthManager.getInstance().getUser();
      const ship = user?.ships[0];

      if (!ship) {
        return;
      }

      await createScore({
        shipId: ship.id,
        value: Number(pendingScore),
      });

      saveManager.setData(
        SaveConstants.Keys.PLAYER_PENDING_SCORE,
        null
      );

      console.log("Pending score saved online:", pendingScore);
    }

    create() {
        const centerX = this.scale.width / 2;

        const isLogin = this.mode === "login";

        this.add.text(centerX, 300, isLogin ? "LOGIN" : "REGISTER", {
            fontSize: "72px",
            color: "#ffffff",
            fontFamily: "future",
        }).setOrigin(0.5);

        const form = this.add.dom(centerX, 750).createFromHTML(`
            <div style="display:flex; flex-direction:column; gap:20px; width:460px;">
                <input id="username" type="text" placeholder="Username" style="font-size:28px; padding:16px;" />
                <input id="password" type="password" placeholder="Password" style="font-size:28px; padding:16px;" />
                <button id="submitButton" style="font-size:28px; padding:16px; cursor:pointer;">
                    ${isLogin ? "Login" : "Register"}
                </button>
                <button id="switchButton" style="font-size:22px; padding:12px; cursor:pointer;">
                    ${isLogin ? "No account? Register" : "Already registered? Login"}
                </button>
            </div>
        `);

        const message = this.add.text(centerX, 1150, "", {
            fontSize: "28px",
            color: "#ff6666",
        }).setOrigin(0.5);

        form.addListener("click");

        form.on("click", async (event: Event) => {
            const target = event.target as HTMLElement;

            if (target.id === "switchButton") {
                this.scene.restart({
                    mode: isLogin ? "register" : "login",
                });
                return;
            }

            if (target.id !== "submitButton") {
                return;
            }

            const usernameInput = form.getChildByID("username") as HTMLInputElement;
            const passwordInput = form.getChildByID("password") as HTMLInputElement;

            try {
                if (this.mode === "register") {
                    await register({
                        username: usernameInput.value,
                        password: passwordInput.value,
                    });
                }

                await AuthManager.getInstance().login(
                    usernameInput.value,
                    passwordInput.value
                );

                this.scene.start(GameConstants.SceneKeys.HOME);
                await this.savePendingScoreIfExists();
            } catch (error) {
                message.setText(error instanceof Error ? error.message : "Authentication failed");
            }
        });

        this.input.keyboard?.once("keydown-ESC", () => {
            this.scene.start(GameConstants.SceneKeys.HOME);
        });
    }
}