import { createUserIfNeeded } from "./firebase.js";
let highScore;
class StartGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/newbg.png");
    this.load.image("lb_board", "assets/img/lb_board.png");
    this.load.image("board", "assets/img/scoreBoard.png");
    this.load.image("lb", "assets/img/lb.svg");
    this.load.image("start", "assets/img/image.png");
    this.load.font("SuperGameFont", "assets/fonts/SuperFont.ttf");
  }
  create() {
    createUserIfNeeded();
    const username = localStorage.getItem("username") || "Player";
    highScore =
      "High Score:" + " " + Number(localStorage.getItem("highScore")) || 0;
    this.add.image(189, 336, "background").setScale(0.5);
    this.add.image(330, 70, "lb_board").setScale(0.7);
    this.add.image(130, 70, "board").setScale(0.4);
    this.add.text(30, 45, username, {
      fontSize: "18px",
      fill: "#fff",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });
    this.add.text(30, 65, highScore, {
      fontSize: "18px",
      fill: "#fff",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });

    this.add
      .image(330, 70, "lb")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.cameras.main.fadeOut(150);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("Leaderboard");
        });
      });
    this.add
      .image(200, 550, "start")
      .setScale(0.2)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.cameras.main.fadeOut(150);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("MainGameScene");
        });
      });
  }
}
export default StartGameScene;
