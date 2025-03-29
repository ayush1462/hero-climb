class StartGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/bg.png");
  }
  create() {
    this.add.image(189, 336, "background");
    let startButton = this.add
      .text(130, 300, "START", {
        fontSize: "32px",
        fill: "#fff",
        backgroundColor: "#ff0000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainGameScene");
      });
    startButton.setShadow(5, 5, "#000", 10, true, true);
  }
}
export default StartGameScene;
