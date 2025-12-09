let wall;
let player;
let bombs;
let coins;
let bombSpeed;
let score;
let scoreText;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let side;
let isJumping;
let spawnBombEvent;
let spawnCoinEvent;
let home;
const WALL_WIDTH = 32;
const WALL_HEIGHT = 32;
const SCREEN_HEIGHT = 672;
class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
  }
  preload() {
    this.load.image("background", "assets/img/7.png");
    for (let i = 1; i <= 5; i++) {
      this.load.image(`bg${i}`, `../assets/city/${i}.png`);
    }
    for (let i = 1; i <= 9; i++) {
      this.load.image(`ninja${i}`, `../assets/hero/ninja${i}.png`);
    }
    this.load.image("wall", "assets/img/wickedstone13z.jpg");
    this.load.image("home", "assets/img/home.svg");
    this.load.image("bomb", "assets/img/obs1.png");
    this.load.image("coin", "assets/img/star.png");
    this.load.image("board", "assets/img/scoreBoard.png");
  }

  create() {
    side = "left";
    bombSpeed = 300;
    this.wallMoving = true;
    // this.add.image(189, 336, "background");
    this.add.image(189, 336, "bg1").setScrollFactor(0);
    this.add.image(189, 336, "bg2").setScrollFactor(0.03);
    this.add.image(189, 336, "bg3").setScrollFactor(0.07);
    this.add.image(189, 336, "bg4").setScrollFactor(0.15);
    this.add.image(189, 336, "bg5").setScrollFactor(0.3);
    score = 0;
    player = this.physics.add.sprite(75, 550, "ninja1");
    player.setOrigin(0.5);
    player.setGravityX(0);
    player.setScrollFactor(0);
    player.setScale(0.2);
    player.angle = 90;
    player.setFlipX(true);
    player.setSize(500, 300);
    player.setOffset(-100, 50);
    console.log(player.x);
    // Create static group for walls
    wall = this.physics.add.staticGroup();
    // Generate enough walls + extra for smooth looping
    for (let y = 0; y <= SCREEN_HEIGHT + WALL_HEIGHT; y += WALL_HEIGHT) {
      wall
        .create(WALL_WIDTH, y, "wall")
        .setOrigin(0, 0)
        .setAngle(90)
        .setScrollFactor(0);
      wall
        .create(378, y, "wall")
        .setOrigin(0, 0)
        .setAngle(90)
        .setScrollFactor(0);
    }

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
      frameRate: 25,
      repeat: -1,
    });
    player.anims.play("run", true);
    isJumping = false;
    this.input.on("pointerdown", () => jump(this));
    bombs = this.physics.add.group();
    coins = this.physics.add.group();

    spawnBombEvent = this.time.addEvent({
      delay: 2500, // Spawn every 2.5 seconds
      callback: spawnBomb,
      callbackScope: this,
      loop: true,
    });
    spawnCoinEvent = this.time.addEvent({
      delay: 2000, // Spawn every 2 seconds
      callback: spawnCoin,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    let incSpeed = this.time.addEvent({
      delay: 10000, // Spawn every 1.5 seconds
      callback: () => {
        bombSpeed += 50;
      },
      callbackScope: this,
      loop: true,
    });
    if (bombSpeed === 700) {
      incSpeed.remove();
    }
    function spawnBomb() {
      let side = Phaser.Math.Between(0, 1); // 0 = Left wall, 1 = Right wall
      let xPos = side === 0 ? 70 : 310; // Near left wall (100) or right wall (980)
      let bomb = bombs.create(xPos, -50, "bomb"); // Spawn above screen
      if (side === 1) {
        bomb.setFlipX(true);
      }
      bomb.setScale(0.2);
      bomb.setVelocityY(bombSpeed); // Make bomb fall down
      bomb.setGravityY(0); // Apply gravity
      bomb.setScrollFactor(0);
    }
    function spawnCoin() {
      let xPos = Phaser.Math.Between(66, 312);
      let coin = coins.create(xPos, -50, "coin"); // Spawn above screen
      coin.setScale(1);
      coin.setVelocityY(200); // Make coin fall down
      coin.setGravityY(0); // Apply gravity
      coin.setScrollFactor(0);
    }
    function hitBomb(player, bombs) {
      updatehighScore(score);
      bombs.setVelocityY(0);
      coins.setVelocityY(0);
      this.wallMoving = false;
      player.setTint(0xff0000);
      if (player.x < 300) {
        player.setVelocityX(200);
      } else {
        player.setVelocityX(-200);
      }
      player.setVelocityY(400);
      spawnBombEvent.remove();
      spawnCoinEvent.remove();
      home = this.add
        .image(53, 33, "home")
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.start("StartGameScene");
        });

      home.setScale(0.3);
      home.setScrollFactor(0);
      this.add.image(190, 320, "board").setScrollFactor(0);
      let restartButton = this.add
        .text(110, 300, "RESTART", {
          fontSize: "32px",
          fill: "#000",
          align: 1,
          fontStyle: "bold",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.restart();
        });
      restartButton.setScrollFactor(0);
      if (score > highScore || highScore === null) {
        localStorage.setItem("highScore", score);
      }
    }
    function collectCoin(player, coin) {
      coin.disableBody(true, true);
      score += 5;
      console.log(score);
      scoreText.setText(score);
    }
    this.add.image(280, 30, "board").setScale(0.7).setScrollFactor(0);
    scoreText = this.add.text(220, 14, "score: 0", {
      fontSize: "32px",
      fill: "#000",
      align: "Right",
    });
    scoreText.setText(score);
    scoreText.setScrollFactor(0);
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
  }
  update() {
    if (this.wallMoving === false) return; // Stop movement when player is hit
    wall.children.iterate((wallSprite) => {
      wallSprite.y += 4; // Move down

      // If a wall goes off-screen, move it back to the top
      if (wallSprite.y >= SCREEN_HEIGHT) {
        wallSprite.y -= SCREEN_HEIGHT + WALL_HEIGHT;
      }
    });
    this.cameras.main.scrollY -= 1; // Move camera down
  }
}
export default MainGameScene;
