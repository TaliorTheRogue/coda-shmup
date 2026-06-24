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

            this.add.text(
                this.scale.width / 2,
                this.scale.height - 360,
                "Login or register to save your score",
                {
                    fontSize: "28px",
                    color: "#ffffff",
                    align: "center",
                }
            ).setOrigin(0.5);

            this.add.text(
                this.scale.width / 2,
                this.scale.height - 320,
                "L: Login | R: Register",
                {
                    fontSize: "24px",
                    color: "#aaaaaa",
                    align: "center",
                }
            ).setOrigin(0.5);

            this.input.keyboard?.once("keydown-L", () => {
                this.scene.start(GameConstants.SceneKeys.AUTH, {
                    mode: "login",
                });
            });

            this.input.keyboard?.once("keydown-R", () => {
                this.scene.start(GameConstants.SceneKeys.AUTH, {
                    mode: "register",
                });
            });

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
            console.log("Score saved online:", score);
        } catch (error) {
            console.error("Failed to save score online:", error);
        }
    }

    create() {
        this.scene.stop(GameConstants.SceneKeys.MAIN_UI);

        const screenCenterX: number = this.scale.width / 2;
        this.add.text(screenCenterX, this.scale.width / 2, 'GAME OVER',
            {fontSize: '96px', color: '#fff', align: 'center'}).setOrigin(0.5);
        this.add.text(screenCenterX, 32, "SCORE",
            {fontSize: '48px', align: 'center'}).setOrigin(0.5);

        this.add.text(screenCenterX, 72, this.registry.get(RegistryConstants.Keys.PLAYER_SCORE).toString(),
            {fontSize: '32px', color: '#fff', align: 'center'}).setOrigin(0.5);

        this.add.text(screenCenterX, this.scale.height - 256, 'Press SPACE to play again',
            {fontSize: '32px', color: '#fff', align: 'center'}).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start(GameConstants.SceneKeys.HOME);
        });

        this.handleScoreSaving();

        console.log("GameOverScene created");
    }
}