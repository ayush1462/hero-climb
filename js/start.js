import { createUserIfNeeded } from "./firebase.js";
let highScore;
class StartGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/back2.png");
    this.load.image("board", "assets/img/scoreBoard.png");
    this.load.image("lb", "assets/img/lb.png");
    this.load.font("SuperGameFont", "assets/fonts/SuperFont.ttf");
  }
  create() {
    // Create Firebase user
    createUserIfNeeded();
    const username = localStorage.getItem("username") || "Player";
    highScore =
      "High Score:" + " " + Number(localStorage.getItem("highScore")) || 0;
    this.add.image(189, 336, "background").setScale(0.35);
    this.add.text(30, 45, username, {
      fontSize: "20px",
      fill: "#000",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });
    this.add.text(30, 70, highScore, {
      fontSize: "20px",
      fill: "#000",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });
    this;
    this.add.text(60, 150, "WALL RUNNER", {
      fontFamily: "SuperGameFont",
      fontSize: "30px",
      fontStyle: "bold", // <-- THIS sets the font weight
      color: "#ffffff",
    });
    this.add
      .image(330, 70, "lb")
      .setScale(0.1)
      .setInteractive()
      .on("pointerdown", () => {
        this.cameras.main.fadeOut(150);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("Leaderboard");
        });
      });
    this.add.image(190, 570, "board");
    this.add
      .text(130, 550, "START", {
        fontSize: "32px",
        fill: "#cc6600",
        fontStyle: "bold",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.cameras.main.fadeOut(150);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("MainGameScene");
        });
      });
  }
}
export default StartGameScene;
