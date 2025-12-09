let highScore;
class StartGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/home.png");
    this.load.image("board", "assets/img/scoreBoard.png");
    this.load.font("SuperGameFont", "assets/fonts/SuperFont.ttf");
  }
  create() {
    // Create Firebase user
    createUserIfNeeded();
    highScore = "High Score:" + " " + Number(localStorage.getItem("highScore")) || 0;
    this.add.image(189, 336, "background");
    this.add.text(30, 50, highScore, {
      fontSize: "20px",
      fill: "#000",
      align: 1,
      fontStyle: "bold",
      padding: { x: 10, y: 5 },
    });
    this.add.text(60, 200, "WALL RUNNER", {
      fontFamily: "SuperGameFont",
      fontSize: "30px",
      fontStyle: "bold", // <-- THIS sets the font weight
      color: "#ffffff",
    });
    this.add.image(190, 320, "board");
    this.add
      .text(130, 300, "START", {
        fontSize: "32px",
        fill: "#cc6600",
        fontStyle: "bold",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainGameScene");
      });
  }
}
export default StartGameScene;
