import {GameObjects, Scenes, Scene} from "phaser";
import Health from "../components/Health.ts";
import Player from "../entities/Player.ts";
import GameConstants from "../GameConstants.ts";
import RegistryConstants from "../RegistryConstants.ts";

export default class MainUIScene extends Scene {
    private _playerHealthText: GameObjects.BitmapText;
    private _scoreText: GameObjects.BitmapText;

    constructor() {
        super(GameConstants.SceneKeys.MAIN_UI);
    }

    // noinspection JSUnusedGlobalSymbols
    init() {
        this.game.events.on(GameConstants.Events.PLAYER_SPAWNED_EVENT, this.onPlayerSpawned, this);
        this.registry.events.on(RegistryConstants.Events.PLAYER_SCORE_CHANGE, this.onPlayerScoreChanged, this);

        this.events.once(Scenes.Events.SHUTDOWN, () => {
            this.game.events.off(GameConstants.Events.PLAYER_SPAWNED_EVENT, this.onPlayerSpawned, this);
            this.registry.events.off(RegistryConstants.Events.PLAYER_SCORE_CHANGE, this.onPlayerScoreChanged, this);
        }, this);
    }

    private createHealthPanel() {
        this.add.image(48, 38, "gameUITopPanel").setDisplaySize(470, 80);
        const playerHealthIcon = this.add.image(90, 20, "sprites", "playerLife1_blue")
            .setOrigin(0, 0).setScale(1.5);
        const playerHealthTextX = playerHealthIcon.x + playerHealthIcon.displayWidth + 16;
        this._playerHealthText = this.add.bitmapText(playerHealthTextX, playerHealthIcon.y, "future-bmp", "x0", 154).setTint(0x36BDF7);
    }

    private createScorePanel() {
        this.add.image(this.scale.width - 48, 38, "gameUITopPanel").setDisplaySize(500, 80).setFlipX(true);
        let scoreStr: string = "".padStart(GameConstants.MAX_SCORE_DIGITS, "0");
        if (this.registry.has(RegistryConstants.Keys.PLAYER_SCORE))
            scoreStr = this.registry.get(RegistryConstants.Keys.PLAYER_SCORE).toString()
                .padStart(GameConstants.MAX_SCORE_DIGITS, "0");
        this._scoreText = this.add.bitmapText(this.scale.width - 64, 20, "future-bmp", scoreStr, 136)
            .setOrigin(1, 0)
            .setTint(0x36BDF7);
    }

    private createTopHUD() {
        this.createHealthPanel();
        this.createScorePanel();
    }

    private createBottomHUD() {
        // Add images for Bottom UI panels
        this.add.image(this.scale.width / 2, this.scale.height, "UIPanel").setDisplaySize(this.scale.width + 200, 200);
        this.add.image(96, this.scale.height - 78, "gameUIBottomPanel").setDisplaySize(440, 200);
        this.add.image(this.scale.width - 96, this.scale.height - 78, "gameUIBottomPanel").setDisplaySize(440, 200).setFlipX(true);

        // Add text for Bottom UI indications
        this.add.text(56, this.scale.height - 100,"MISSING\nMODULE",
            {
                fontFamily: "future",
                fontSize: "19px",
                fontStyle: "bold",
                align: "center",
                color: "#ff4444",
            }
        ).setOrigin(0.5);
        this.add.text(136, this.scale.height - 34,"UNDER DEVELOPMENT",
            {
                fontFamily: "future",
                fontSize: "19px",
                fontStyle: "bold",
                align: "center",
                color: "#ff4444",
            }
        ).setOrigin(0.5);
        this.add.text(this.scale.width / 2, this.scale.height - 72,"MAIN WEAPON SYSTEM",
            {
                fontFamily: "future",
                fontSize: "19px",
                fontStyle: "bold",
                align: "center",
                color: "#ffffff",
            }
        ).setOrigin(0.5);
        this.add.text(this.scale.width - 56, this.scale.height - 100,"FLIGHT\nCONTROL",
            {
                fontFamily: "future",
                fontSize: "19px",
                fontStyle: "bold",
                align: "center",
                color: "#167DA8",
            }
        ).setOrigin(0.5);

        // Add images for bottom UI Keys
        this.add.image(this.scale.width / 2 - 47 , this.scale.height - 22, "gameUISpacebarKeyLeft").setScale(3);
        this.add.image(this.scale.width / 2, this.scale.height - 22, "gameUISpacebarKeyMiddle").setScale(3);
        this.add.image(this.scale.width / 2 + 47, this.scale.height - 22, "gameUISpacebarKeyRight").setScale(3);
        this.add.image(this.scale.width - 160, this.scale.height - 32, "gameUILeftArrowKey").setScale(4);
        this.add.image(this.scale.width - 80, this.scale.height - 32, "gameUIRightArrowKey").setScale(4);
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.createTopHUD();
        this.createBottomHUD();
        this.scene.bringToTop();

    }

    private onPlayerScoreChanged(_: any, value: number) {
        const scoreStr: string = value.toString().padStart(GameConstants.MAX_SCORE_DIGITS, "0");
        this._scoreText.setText(scoreStr);
    }

    private onPlayerSpawned(player: Player) {
        this._playerHealthText.setText("x" + player.getComponent(Health)?.current);

        player.getComponent(Health)?.on(Health.CHANGE_EVENT, (current: number) => {
            this._playerHealthText.setText("x" + current);
            this._playerHealthText.setTint(current === 1 ? 0xff4444 : 0x36BDF7);
        }, this);
    }
}