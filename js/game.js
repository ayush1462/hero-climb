// configuration of game scene
var config = {
  type: Phaser.AUTO,
  width: 1080, // perfect width for mobile game
  height: 1920, // perfect height for mobile game
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
let bombSpeed = 1000;
let score = 0;
let side;
let isJumping;
let spawnBombEvent;
function preload() {
  this.load.image("background", "assets/img/background.png");
  this.load.spritesheet("player", "assets/img/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("wall", "assets/img/wall.png");
  this.load.image("bomb", "assets/img/bomb.png");
  this.load.image("star", "assets/img/star.png");
}

function create() {
  side = "left"
  this.add.image(540, 960, "background");
  player = this.physics.add.sprite(135, 1620, "player");
  player.setGravityX(0);
  player.setScale(3.5);
  player.angle = 90;
  player.body.setSize(50, 30);
  player.body.setOffset(-10, 10);

  const wallWidth = 32;
  const wallHeight = 400;
  const sceneHeight = 1920;
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
      .create(1080, y, "wall")
      .setOrigin(0, 0)
      .setAngle(90)
      .setSize(32, 400)
      .setOffset(170, 0);
  }
  this.physics.add.collider(player, wall);
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  player.anims.play("left");
  this.anims.create({
    key: "turn",
    frames: [{ key: "player", frame: 4 }],
    frameRate: 20,
  });
  isJumping = false;
  this.input.on("pointerdown", ()=> jump(this));
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
      bombSpeed +=50;
    },
    callbackScope: this,
    loop: true,
  });
}
function spawnBomb() {
  let side = Phaser.Math.Between(0, 1); // 0 = Left wall, 1 = Right wall
  let xPos = side === 0 ? 100 : 980; // Near left wall (100) or right wall (980)

  let bomb = bombs.create(xPos, -50, "bomb"); // Spawn above screen
  bomb.setScale(4);
  bomb.setVelocityY(bombSpeed); // Make bomb fall down
  bomb.setGravityY(0); // Apply gravity
}
function hitBomb(player, bomb) {
  bombs.setVelocityY(0);
  player.setTint(0xff0000);
  if (player.x < 540) {
    player.setVelocityX(200);
  
  }
  else {
    player.setVelocityX(-200)
  }
  player.setVelocityY(800);
  spawnBombEvent.remove();
  let restartButton = this.add.text(350, 960, "RESTART", {
    fontSize: '82px',
    fill: '#fff',
    backgroundColor: '#ff0000'
  }).setInteractive().on('pointerdown', () => {
    this.scene.restart();
  });
}
function jump(scene) {
  console.log("jump");
  if (isJumping) return;
  isJumping = true;
  console.log("player is jumping")
  const startX = side === "left" ? 130 : 950;
  const endX = side === "left" ? 950 : 130;
  const peakY = player.y - 150;
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
    }
  });
}
function update() {}
