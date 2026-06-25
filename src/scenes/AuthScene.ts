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
    }

    private createMenuButton(x: number, y: number, label: string, action: () => void): void {
        const button = this.add.image(x, y, 'menuButton').setScale(3);

        const buttonText = this.add.text(x, y, label,
            {
                fontFamily: "future",
                fontSize: "42px",
                color: "#ffffff",
                align: "center",
            }
        ).setOrigin(0.5);

        button.setInteractive({
            useHandCursor: true,
        });

        button.on("pointerover", () => {
            button.setScale(3.40);
            buttonText.setScale(1.10);
        });

        button.on("pointerout", () => {
            button.setScale(3);
            buttonText.setScale(1);
        });

        button.on("pointerdown", () => {
            button.setScale(2.80);
            buttonText.setScale(0.95);
        });

        button.on("pointerup", () => {
            button.setScale(3.40);
            buttonText.setScale(1.05);

            action();
        });
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        const isLogin = this.mode === "login";

        this.add.tileSprite(
            0,
            0,
            this.scale.width,
            this.scale.height,
            "bg"
        ).setOrigin(0);

        this.add.text(centerX, 180, isLogin ? "PILOT\nAUTHENTICATION" : "PILOT\nREGISTRATION", {
            fontSize: "72px",
            color: "#ffffff",
            fontFamily: "future",
            align: "center",
        }).setOrigin(0.5);

        const form = this.add.dom(centerX, centerY).createFromHTML(`
            <div class="auth-container">
                <input
                    id="username"
                    class="auth-input"
                    type="text"
                    placeholder="Username"
                />

                <input
                    id="password"
                    class="auth-input"
                    type="password"
                    placeholder="Password"
                />
                ${!isLogin ? `
                <input
                    id="confirmPassword"
                    class="auth-input"
                    type="password"
                    placeholder="Confirm password"
                />

                <p class="auth-help">
                    Username: 3-20 characters (letters, numbers and "_")<br>
                    Password: minimum 8 characters
                </p>
                ` : ""}

                <label class="auth-checkbox">
                    <input id="showPassword" type="checkbox">
                        Reveal password
                </label>

                <button
                    id="submitButton"
                    class="auth-button"
                >
                ${isLogin ? "Login" : "Register"}
                </button>

                <button
                    id="switchButton"
                    class="auth-switch-button"
                >
                ${isLogin ? "No account? Register" : "Already registered? Login"}
                </button>
            </div>
        `);

        const message = this.add.text(centerX, form.y + form.height/2 + 30, "", {
            fontSize: "26px",
            color: "#ff6666",
            fontFamily: "future",
        }).setOrigin(0.5);

        this.createMenuButton(centerX, 1800, "MAIN MENU", () => {
            this.scene.start(GameConstants.SceneKeys.HOME);
        });

        form.addListener("click");

        form.on("click", async (event: Event) => {
            const target = event.target as HTMLElement;

            if (target.id === "showPassword") {
                const passwordInput = form.getChildByID("password") as HTMLInputElement;
                const confirmPasswordInput = form.getChildByID("confirmPassword") as HTMLInputElement | null;

                const shouldShowPassword = (target as HTMLInputElement).checked;

                passwordInput.type = shouldShowPassword ? "text" : "password";

                if (confirmPasswordInput) {
                    confirmPasswordInput.type = shouldShowPassword ? "text" : "password";
                }

                return;
            }

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

            const usernameRegex = /^[a-zA-Z0-9_]+$/;

            if (usernameInput.value.length < 3 || usernameInput.value.length > 20) {
                message.setText("Username must contain 3 to 20 characters");
                return;
            }

            if (!usernameRegex.test(usernameInput.value)) {
                message.setText("Username can only contain letters, numbers and _");
                return;
            }

            if (passwordInput.value.length < 8) {
                message.setText("Password must contain at least 8 characters");
                return;
            }

            try {
                if (this.mode === "register") {
                    const confirmPasswordInput = form.getChildByID("confirmPassword") as HTMLInputElement | null;

                    if (!confirmPasswordInput || passwordInput.value !== confirmPasswordInput.value) {
                        message.setText("Passwords do not match");
                        return;
                    }

                    await register({
                        username: usernameInput.value,
                        password: passwordInput.value,
                    });
                }

                await AuthManager.getInstance().login(
                    usernameInput.value,
                    passwordInput.value
                );

                await this.savePendingScoreIfExists();

                this.scene.start(GameConstants.SceneKeys.HOME);
            } catch (error) {
                message.setText(error instanceof Error ? error.message : "Authentication failed");
            }
        });
    }
}