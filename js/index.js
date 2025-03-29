import StartGameScene from "./start.js";
import MainGameScene from "./game.js";
// configuration of game scene
var config = {
  type: Phaser.AUTO,
  width: 378, // perfect width for mobile game
  height: 672, // perfect height for mobile game
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT, // to fit for all screen size
    autoCenter: Phaser.Scale.CENTER_BOTH, // aligns to center
  }, // to make it responsive
  scene: [StartGameScene, MainGameScene],
};
const game = new Phaser.Game(config);
