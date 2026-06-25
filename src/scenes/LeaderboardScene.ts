import GameConstants from "../GameConstants.ts";
import { getLeaderboard } from "../api/scoreApi.ts";

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super(GameConstants.SceneKeys.LEADERBOARD);
  }

  private rowsContainer!: Phaser.GameObjects.Container;
  private scrollIndex = 0;
  private readonly rowStartY = 400;
  private readonly rowSpacing = 220;
  private readonly visibleRows = 5;

  private createLeaderboardRow(x: number, y: number, rank: number, username: string, score: number): void {
    const rowTexture = rank === 1
      ? "leaderboardRowGold"
      : rank === 2
        ? "leaderboardRowSilver"
        : rank === 3
          ? "leaderboardRowBronze"
          : "leaderboardRowBlue";

    const row = this.add.image(x, y, rowTexture).setDisplaySize(800, 190);

    const rankText = this.add.text(x - 300, y - 45, rank.toString(), {
        fontSize: "82px",
        color: "#ffffff",
        fontFamily: "future",
      }).setOrigin(0.5);

    const userNameText = this.add.text(x - 340, y + 44, username, {
        fontSize: "48px",
        color: "#4faeff",
        fontFamily: "future",
      }).setOrigin(0, 0.5);

    const scoreText = this.add.bitmapText(
      x + 360,
      y + 30,
      "future-bmp",
      score.toString().padStart(GameConstants.MAX_SCORE_DIGITS, "0"),
      186
    ).setOrigin(1, 0.5).setTint(0x36BDF7);

    this.rowsContainer.add(row);
    this.rowsContainer.add(rankText);
    this.rowsContainer.add(userNameText);
    this.rowsContainer.add(scoreText);
  }

  private createEndLeaderboardText(x: number, y: number): void {
    const endText = this.add.text(x, y, "--- END OF LEADERBOARD ---", {
        fontFamily: "future",
        fontSize: "44px",
        color: "#ffffff",
    }).setOrigin(0.5);

    this.rowsContainer.add(endText);
  }

  private scrollLeaderboard(direction: number, totalRows: number): void {
    const maxIndex = Math.max(0, totalRows - this.visibleRows);

    this.scrollIndex = Phaser.Math.Clamp(
        this.scrollIndex + direction,
        0,
        maxIndex
    );

    this.rowsContainer.y = -this.scrollIndex * this.rowSpacing;
  }

  private createMenuButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.image(x, y, "menuButton").setScale(3);

    const buttonText = this.add.text(x, y, label, {
        fontFamily: "future",
        fontSize: "42px",
        color: "#ffffff",
        align: "center",
    }).setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });

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

  async create() {
    const centerX = this.scale.width / 2;

    this.add.tileSprite(
      0,
      0,
      this.scale.width,
      this.scale.height,
      "bg"
    ).setOrigin(0);

    this.add.text(centerX, 180, "LEADERBOARD", {
      fontSize: "72px",
      color: "#ffffff",
      fontFamily: "future",
    }).setOrigin(0.5);

    const loadingText = this.add.text(centerX, 520, "LOADING LEADERBOARD...", {
      fontSize: "28px",
      color: "#ffffff",
      fontFamily: "future",
    }).setOrigin(0.5);

    const loadingBarBg = this.add.rectangle(centerX, 580, 420, 24, 0x222222);
    const loadingBar = this.add.rectangle(centerX - 210, 580, 0, 24, 0x4faeff).setOrigin(0, 0.5);

    this.tweens.add({
      targets: loadingBar,
      width: 420,
      duration: 900,
      repeat: -1,
      yoyo: true,
    });

    try {
      const response = await getLeaderboard();
      loadingText.destroy();
      loadingBarBg.destroy();
      loadingBar.destroy();

      this.rowsContainer = this.add.container(0, 0);

      const maskShape = this.make.graphics();
      maskShape.fillStyle(0xffffff);
      maskShape.fillRect(
        0,
        300,
        this.scale.width,
        1300
      );

      this.rowsContainer.setMask(
        maskShape.createGeometryMask()
      );

      response.leaderboard.forEach((entry, index) => {
        this.createLeaderboardRow(
          centerX,
          this.rowStartY + index * this.rowSpacing,
          index + 1,
          entry.ship.user.username,
          entry.value
        );
      });

      this.createEndLeaderboardText(
        centerX,
        this.rowStartY + response.leaderboard.length * this.rowSpacing
      );

      this.input.keyboard?.on("keydown-DOWN", () => {
        this.scrollLeaderboard(1, response.leaderboard.length);
      });

      this.input.keyboard?.on("keydown-UP", () => {
        this.scrollLeaderboard(-1, response.leaderboard.length);
      });

      if (response.leaderboard.length === 0) {
        this.add.text(centerX, 600, "NO SCORE YET", {
          fontSize: "36px",
          color: "#ffffff",
          fontFamily: "future",
        }).setOrigin(0.5);
      }

    } catch (error) {
      loadingText.destroy();
      loadingBarBg.destroy();
      loadingBar.destroy();
      this.add.text(centerX, 600, "FAILED TO LOAD LEADERBOARD", {
        fontSize: "30px",
        color: "#ff4444",
        fontFamily: "future",
      }).setOrigin(0.5);

      console.error(error);
    }

    this.add.text(centerX, 1660, "UP ARROW / DOWN ARROW : SCROLL", {
      fontSize: "30px",
      color: "#ffffff",
      fontFamily: "future",
    }).setOrigin(0.5);

    this.createMenuButton(centerX, 1800, "MAIN MENU", () => {
      this.scene.start(GameConstants.SceneKeys.HOME);
    });
  }
}