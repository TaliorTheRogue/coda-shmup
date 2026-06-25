import GameConstants from "../GameConstants.ts";
import RegistryConstants from "../RegistryConstants.ts";
import SaveConstants from "../SaveConstants.ts";
import { AuthManager } from "../managers/AuthManager.ts";
import { createScore } from "../api/scoreApi.ts";
import SaveManager from "../managers/SaveManager.ts";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super(GameConstants.SceneKeys.GAME_OVER);
    }

    private async handleScoreSaving(): Promise<void> {
        const score = this.registry.get(RegistryConstants.Keys.PLAYER_SCORE) as number;

        const authManager = AuthManager.getInstance();
        const user = authManager.getUser();

        if (!user) {
            const saveManager = this.plugins.get(SaveManager.PLUGIN_KEY) as SaveManager;
            saveManager.setData(
                SaveConstants.Keys.PLAYER_PENDING_SCORE,
                score
            );

            return;
        }

        const ship = user.ships[0];

        if (!ship) {
            console.warn("No ship found, score not saved online");
            return;
        }

        try {
            await createScore({
                shipId: ship.id,
                value: score,
            });
        } catch (error) {
            console.error("Failed to save score online:", error);
        }
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

    private startGame(): void {
        this.scene.launch(GameConstants.SceneKeys.MAIN_UI);
        this.scene.start(GameConstants.SceneKeys.MAIN_GAME);
    }

    create() {
        this.scene.stop(GameConstants.SceneKeys.MAIN_UI);
        const centerX: number = this.scale.width / 2;
        const authManager = AuthManager.getInstance();
        const user = authManager.getUser();

        this.add.tileSprite(
            0,
            0,
            this.scale.width,
            this.scale.height,
            'bg'
        ).setOrigin(0);

        this.add.text(
            centerX,
            300,
            "SHIP DESTROYED...",
            {
                fontFamily: "future",
                fontSize: "32px",
                color: "#ff4444",
            }
        ).setOrigin(0.5);

        this.add.text(
            centerX,
            420,
            "GAME OVER",
            {
                fontFamily: "future",
                fontSize: "84px",
                color: "#ffffff",
                align: "center",
            }
        ).setOrigin(0.5);

        this.add.image(
            centerX,
            720,
            'UIPanel'
        ).setScale(2);

        this.add.text(
            centerX,
            630,
            "YOUR SCORE",
            {
                fontFamily: "future",
                fontSize: "32px",
                color: "#ffffff",
                align: "center",
            }
        ).setOrigin(0.5);

        const score = this.registry.get(RegistryConstants.Keys.PLAYER_SCORE) as number;

        const scoreStr = score.toString().padStart(GameConstants.MAX_SCORE_DIGITS, "0");
        this.add.bitmapText(
            centerX,
            820,
            "future-bmp",
            scoreStr,
            186
        ).setOrigin(0.5).setTint(0x36BDF7);

        if (!user) {
            this.add.text(centerX, 960, "LOGIN OR REGISTER TO SAVE YOUR SCORE", {
                fontFamily: "future",
                fontSize: "32px",
                color: "#ff4444",
                align: "center",
            }).setOrigin(0.5);
        }

        const menuItems = user
            ? [
                { label: "RETRY", action: () => this.startGame() },
                { label: "LEADERBOARD", action: () => this.scene.start(GameConstants.SceneKeys.LEADERBOARD) },
                { label: "MAIN MENU", action: () => this.scene.start(GameConstants.SceneKeys.HOME) },
            ]
            : [
                { label: "LOGIN / REGISTER", action: () => this.scene.start(GameConstants.SceneKeys.AUTH, { mode: "login" }) },
                { label: "RETRY", action: () => this.startGame() },
                { label: "MAIN MENU", action: () => this.scene.start(GameConstants.SceneKeys.HOME) },
            ];

            menuItems.forEach((item, index) => {
                this.createMenuButton(
                    centerX,
                    1100 + index * 200,
                    item.label,
                    item.action
                );
            });

        this.handleScoreSaving();
    }
}