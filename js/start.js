class StartGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/bg.png");
    this.load.image("board", "assets/img/scoreBoard.png");
  }
  create() {
    this.add.image(189, 336, "background");
    this.add.text(50, 200, "WALL RUNNER", {
      fontFamily: "Comic Sans MS",
      fontSize: "36px",
      fontStyle: "bold", // <-- THIS sets the font weight
      color: "#ffffff",
    });
    this.add.image(190, 320, "board")
    let startButton = this.add
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
