import GameConstants from "../GameConstants.ts";
import { getLeaderboard } from "../api/scoreApi.ts";

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super(GameConstants.SceneKeys.LEADERBOARD);
    }

    async create() {
        const centerX = this.scale.width / 2;

        this.add.text(centerX, 150, "LEADERBOARD", {
            fontSize: "64px",
            color: "#ffffff",
            fontFamily: "future",
        }).setOrigin(0.5);

        try {
            const response = await getLeaderboard();

            response.leaderboard.forEach((entry, index) => {
                this.add.text(
                    centerX,
                    350 + index * 80,
                    `${index + 1}. ${entry.ship.user.username} - ${entry.value}`,
                    {
                        fontSize: "32px",
                        color: "#ffffff",
                        fontFamily: "future",
                    }
                ).setOrigin(0.5);
            });
        } catch (error) {
            this.add.text(centerX, 500, "Failed to load leaderboard", {
                fontSize: "32px",
                color: "#ff6666",
            }).setOrigin(0.5);

            console.error(error);
        }

        this.add.text(centerX, 1700, "ESC : BACK", {
            fontSize: "24px",
            color: "#aaaaaa",
        }).setOrigin(0.5);

        this.input.keyboard?.once("keydown-ESC", () => {
            this.scene.start(GameConstants.SceneKeys.HOME);
        });
    }
}