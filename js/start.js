import { createUserIfNeeded } from "./firebase.js";
let highScore;
class StartGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/newbg.png");
    this.load.image("board", "assets/img/scoreBoard.png");
    this.load.image("lb", "assets/img/lb.png");
    this.load.image("start", "assets/img/image.png");
    this.load.font("SuperGameFont", "assets/fonts/SuperFont.ttf");
  }
  create() {
    createUserIfNeeded();
    const username = localStorage.getItem("username") || "Player";
    highScore =
      "High Score:" + " " + Number(localStorage.getItem("highScore")) || 0;
    this.add.image(189, 336, "background").setScale(0.5);
    this.add.text(30, 45, username, {
      fontSize: "18px",
      fill: "#000",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });
    this.add.text(30, 70, highScore, {
      fontSize: "18px",
      fill: "#000",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });
    this;
    // this.add.text(60, 150, "WALL RUNNER", {
    //   fontFamily: "SuperGameFont",
    //   fontSize: "30px",
    //   fontStyle: "bold",
    //   color: "#ffffff",
    // });
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
    // const panel = this.add.graphics();
    // panel.fillStyle(0x081a2f);
    // panel.fillRoundedRect(110, 525, 170, 50, 32);  
    // panel.lineStyle(2, 0x3ddcff, 1);
    // panel.strokeRoundedRect(110, 525, 170, 50, 32);
    
    // const btn = this.add
    //   .text(200, 550, "START", {
    //     fontFamily: "SuperGameFont",
    //     fontSize: "32px",
    //     color: "#5fdcff",
    //     stroke: "#5fdcff",
    //     strokeThickness: 2,
    //   });
    this.add.image(200, 550, "start")
      .setScale(0.25)
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
