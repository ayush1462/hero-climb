import { getTopLeaderboard } from "./firebase.js";
class Leaderboard extends Phaser.Scene {
  constructor() {
    super({ key: "Leaderboard" });
  }

  preload() {
    this.load.image("background", "assets/img/home.png");
    this.load.image("back", "assets/img/back.svg");
    this.load.font("SuperGameFont", "assets/fonts/SuperFont.ttf");
  }
  create() {
    
    this.add.image(189, 336, "background").setScale(0.4);
    this.add
      .text(190, 40, "TOP RUNNERS", {
        fontSize: "32px",
        fontFamily: "SuperGameFont",
        color: "#ffffff",
      })
      .setOrigin(0.5);
      const panel = this.add.rectangle(190, 300, 350, 420, 0x000000, 0.6);
      panel.setStrokeStyle(2, 0x57015e);

    const loading = this.add
      .text(400, 300, "Loading...", { fontSize: "20px", color: "#aaa" })
      .setOrigin(0.5);

    getTopLeaderboard(10, (players) => {
      loading.destroy();

      if (!players || players.length === 0) {
        this.add
          .text(400, 300, "No data", { fontSize: "20px", color: "#f55" })
          .setOrigin(0.5);
        return;
      }

      players.forEach((p, i) => {
        this.add.text(
          60,
          120 + i * 32,
          `${i + 1}. ${p.username} - ${p.highScore}`,
          { fontSize: "20px", color: "#0fc" }
        );
      });
    });

    // Back button
    this.add
      .image(200, 540, "back").setScale(0.4)
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("StartGameScene");
      });
  }
}
export default Leaderboard;
