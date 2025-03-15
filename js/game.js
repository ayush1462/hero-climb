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
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var game = new Phaser.Game(config);
let wall;
let player;
let bombs;
let coin;
let bombSpeed;
let score;
let scoreText;
let addScore;
let side;
let isJumping;
let spawnBombEvent;
function preload() {
  this.load.image("background", "assets/img/bg.png");
  for (let i = 1; i <= 9; i++) {
    this.load.image(`ninja${i}`, `../assets/hero/ninja${i}.png`);
  }
  this.load.image("wall", "assets/img/wall.png");
  this.load.image("bomb", "assets/img/edge.png");
  this.load.image("star", "assets/img/star.png");
}

function create() {
  side = "left";
  bombSpeed = 300;
  this.add.image(189, 336, "background");
  score = 0;
  addScore = this.time.addEvent({
    delay: 1000,
    callback: () => {
      score += 1;
      scoreText.setText(score);
    },
    callbackScope: this,
    loop: true,
  });
  scoreText = this.add.text(280, 50, score, {
    fontSize: "30px",
  });
  player = this.physics.add.sprite(75, 500, "ninja1");
  player.setOrigin(0.5);
  player.setGravityX(0);
  player.setScale(0.2);
  player.angle = 90;
  player.setFlipX(true);
  player.setSize(500, 300);
  player.setOffset(-100, 50);
  console.log(player.x);
  const wallWidth = 32;
  const wallHeight = 400;
  const sceneHeight = 672;
  wall = this.physics.add.staticGroup();
  // Loop to stack walls vertically
  for (let y = 0; y < sceneHeight; y += wallHeight) {
    // Left wall
    wall
      .create(wallWidth, y, "wall")
      .setOrigin(0, 0)
      .setAngle(90)
      .setSize(32, 400)
      .setOffset(170, 0);

    // Right wall
    wall
      .create(378, y, "wall")
      .setOrigin(0, 0)
      .setAngle(90)
      .setSize(32, 400)
      .setOffset(170, 0);
  }
  this.physics.add.collider(player, wall);
  this.anims.create({
    key: "run",
    frames: [
      { key: "ninja1" },
      { key: "ninja2" },
      { key: "ninja3" },
      { key: "ninja4" },
      { key: "ninja5" },
      { key: "ninja6" },
      { key: "ninja7" },
      { key: "ninja8" },
      { key: "ninja9" },
    ],
    frameRate: 20,
    repeat: -1,
  });
  player.anims.play("run", true);
  isJumping = false;
  this.input.on("pointerdown", () => jump(this));
  bombs = this.physics.add.group();

  spawnBombEvent = this.time.addEvent({
    delay: 1500, // Spawn every 1.5 seconds
    callback: spawnBomb,
    callbackScope: this,
    loop: true,
  });
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.time.addEvent({
    delay: 10000, // Spawn every 1.5 seconds
    callback: () => {
      bombSpeed += 50;
    },
    callbackScope: this,
    loop: true,
  });
}
function spawnBomb() {
  let side = Phaser.Math.Between(0, 1); // 0 = Left wall, 1 = Right wall
  let xPos = side === 0 ? 66 : 312; // Near left wall (100) or right wall (980)
  let bomb = bombs.create(xPos, -50, "bomb"); // Spawn above screen
  if (side === 1) {
    bomb.setFlipX(true);
  }
  bomb.setScale(1);
  bomb.setVelocityY(bombSpeed); // Make bomb fall down
  bomb.setGravityY(0); // Apply gravity
}
function hitBomb(player, bomb) {
  bombs.setVelocityY(0);
  player.setTint(0xff0000);
  if (player.x < 540) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(-200);
  }
  player.setVelocityY(800);
  spawnBombEvent.remove();
  addScore.remove();
  let restartButton = this.add
    .text(110, 300, "RESTART", {
      fontSize: "32px",
      fill: "#fff",
      backgroundColor: "#ff0000",
      padding: { x: 10, y: 5 },
    })
    .setInteractive()
    .on("pointerdown", () => {
      this.scene.restart();
    });
  restartButton.setShadow(5, 5, "#000", 10, true, true);
}
function jump(scene) {
  if (isJumping) return;
  isJumping = true;
  console.log("player is jumping");
  const endX = side === "left" ? 305 : 75;
  const peakY = player.y - 50;
  scene.tweens.add({
    targets: player,
    x: endX,
    duration: 500,
    ease: "Cubic.easeInOut",
    onStart: () => {
      player.flipX = !player.flipX;
    },
  });
  scene.tweens.add({
    targets: player,
    y: peakY,
    duration: 250,
    ease: "Cubic.easeOut",
    yoyo: true,
    onStart: () => {
      player.angle += 180;
    },
    onComplete: () => {
      isJumping = false;
      side = side === "left" ? "right" : "left";
    },
  });
}
function update() {}
