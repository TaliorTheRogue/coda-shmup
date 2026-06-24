import {Loader} from "phaser";
import GameConstants from "../GameConstants.ts";
import { AuthManager } from "../managers/AuthManager.ts";

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super(GameConstants.SceneKeys.HOME);
    }

    preload() {
        const width: number = this.scale.width;
        const y: number = this.scale.height / 2;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(0, y, width, 64);
        this.load.on(Loader.Events.PROGRESS, function (value: number) { // 0-1
            console.log("Loading : " + value);

            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(0, y, width * value, 64);
        });
        this.load.on(Loader.Events.COMPLETE, function () {
            console.log("Loading complete");

            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.setPath('assets');

        this.load.image('title', 'UI/CODA_SHMUP_title.png');
        this.load.image('menuButton', 'UI/bar_round_gloss_large.png');
        this.load.image('UIPanel', 'UI/button_square_header_small_rectangle.png');
        this.load.image('bg', 'Backgrounds/darkPurple.png');
        this.load.image('planet', 'Planets/planet00.png');
        this.load.atlas('sprites', 'Spritesheet/gameSprites.png', 'Spritesheet/gameSprites.json');
        this.load.bitmapFont('future-bmp', 'Fonts/kenvector_future.png', 'Fonts/kenvector_future.xml');
        this.load.font('future', 'Fonts/kenvector_future.ttf');
        this.load.json('playerShips', 'Data/playerShips.json');
        this.load.json('enemies', 'Data/enemies.json');
        this.load.audio('sfx_laser1', 'Sounds/sfx_laser1.ogg');
        this.load.audio('sfx_laser2', 'Sounds/sfx_laser2.ogg');
    }

    private createMenuButton(x: number, y: number, label: string, action: () => void): void {
        const button = this.add.image(x, y, 'menuButton');
        button.setScale(3);

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

    private logout(): void {
        AuthManager.getInstance().logout();
        this.scene.restart();
    }

    create() {
        const authManager = AuthManager.getInstance();
        const user = authManager.getUser();
        const centerX = this.scale.width / 2;

        this.add.tileSprite(
            0,
            0,
            this.scale.width,
            this.scale.height,
            'bg'
        ).setOrigin(0);

        this.add.image(centerX, 460, 'title').setScale(0.45);


        const menuItems = user
            ? [
                { label: "PLAY", action: () => this.startGame() },
                { label: "LEADERBOARD", action: () => this.scene.start(GameConstants.SceneKeys.LEADERBOARD) },
                { label: "MY HANGAR", action: () => console.log("Hangar not implemented yet") },
                { label: "LOGOUT", action: () => this.logout() },
            ]
            : [
                { label: "PLAY", action: () => this.startGame() },
                { label: "LEADERBOARD", action: () => this.scene.start(GameConstants.SceneKeys.LEADERBOARD) },
                { label: "LOGIN / REGISTER", action: () => this.scene.start(GameConstants.SceneKeys.AUTH, { mode: "login" }) },
            ];

            menuItems.forEach((item, index) => {
                this.createMenuButton(
                    centerX,
                    840 + index * 200,
                    item.label,
                    item.action
                );
            });

        if (user) {
            this.add.text(centerX, this.scale.height - 180, `Connected as ${user.username}`, {
                fontSize: "28px",
                color: "#aaaaaa",
                fontFamily: "future",
            }).setOrigin(0.5);
        }
    }
}