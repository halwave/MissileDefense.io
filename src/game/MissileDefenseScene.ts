import Phaser from 'phaser';
import { Player } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { Missile } from './entities/Missile';
import { generateWalls } from './services/wallService';
import { UIManager } from './services/uiManager';
import { GameManager } from './services/gameManager';
import {
  handleBulletMissileCollision,
  handlePlayerMissileCollision,
} from './services/collisionHandlers';

// === Game Constants ===
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const WALL_BORDER = 100;
const PLAYER_START_X = GAME_WIDTH / 2;
const PLAYER_START_Y = GAME_HEIGHT / 2;
const PLAYER_SPEED = 200;
const BULLET_SPEED = 400;
const BULLET_FIRE_RATE = 200; // ms
const EXPLOSION_FRAME_WIDTH = 180;
const EXPLOSION_FRAME_HEIGHT = 180;

export class MissileDefenseScene extends Phaser.Scene {
  player!: Player;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  bullets!: Phaser.Physics.Arcade.Group;
  lastFired = 0;
  walls!: Phaser.Physics.Arcade.StaticGroup;
  missiles!: Phaser.Physics.Arcade.Group;
  uiManager!: UIManager;
  gameManager!: GameManager;
  reticle!: Phaser.GameObjects.Image;
  countdownText?: Phaser.GameObjects.Text;
  countdownTimer?: Phaser.Time.TimerEvent;
  isCountingDown: boolean = false;
  waveText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MissileDefenseScene' });
  }

  preload() {
    this.load.image('player', 'assets/tank.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('missile', 'assets/missile.png');
    this.load.image('road', 'assets/road.jpg');
    this.load.image('reticle', 'assets/reticle.png');
    this.load.image('wall1', 'assets/wall1.png');
    this.load.image('wall2', 'assets/wall2.png');
    this.load.spritesheet('explosion', 'assets/explosion.png', {
      frameWidth: EXPLOSION_FRAME_WIDTH,
      frameHeight: EXPLOSION_FRAME_HEIGHT,
    });
  }

  create() {
    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'road')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.setupPlayer();
    this.setupGroups();
    this.setupWalls();
    this.reticle = this.add.image(
      this.input.activePointer.worldX,
      this.input.activePointer.worldY,
      'reticle'
    );
    this.reticle.setDepth(10);
    this.input.setDefaultCursor('none');
    this.uiManager = new UIManager(this, GAME_WIDTH);
    this.gameManager = new GameManager(
      this,
      this.uiManager,
      this.player,
      this.missiles,
      GAME_WIDTH,
      GAME_HEIGHT
    );
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameManager.gameOver) {
        this.shoot(pointer.worldX, pointer.worldY);
      }
    });
    this.setupColliders();
    this.createExplosionAnim();
    this.startWaveCountdown();
  }

  // === Setup Methods ===
  private setupPlayer() {
    this.player = new Player(this, PLAYER_START_X, PLAYER_START_Y);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.addKeys('W,S,A,D');
  }

  private setupGroups() {
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.walls = this.physics.add.staticGroup();
    this.missiles = this.physics.add.group({
      classType: Missile,
      runChildUpdate: true,
    });
  }

  private setupWalls() {
    generateWalls(this, this.walls, WALL_BORDER);
  }

  private createExplosionAnim() {
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', {
        start: 0,
        end: 7,
      }),
      frameRate: 24,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  // === Game Logic ===
  shoot(targetX: number, targetY: number) {
    const now = this.time.now;
    if (now - this.lastFired < BULLET_FIRE_RATE) return;
    this.lastFired = now;
    const angle = Phaser.Math.RadToDeg(
      Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY)
    );
    const bullet = this.bullets.create(
      this.player.x,
      this.player.y,
      'bullet'
    ) as Bullet;
    bullet.setActive(true).setVisible(true);
    bullet.setAngle(angle);
    const rad = Phaser.Math.DegToRad(angle);
    this.physics.velocityFromRotation(
      rad,
      BULLET_SPEED,
      (bullet.body as Phaser.Physics.Arcade.Body).velocity
    );
    bullet.spawnTime = this.time.now;
  }

  private setupColliders() {
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.overlap(this.bullets, this.missiles, ((
      bulletObj: Phaser.GameObjects.GameObject,
      missileObj: Phaser.GameObjects.GameObject
    ) => {
      handleBulletMissileCollision(
        this.gameManager,
        this,
        this.missiles,
        bulletObj,
        missileObj
      );
    }) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
    this.physics.add.overlap(
      this.player as Phaser.GameObjects.GameObject,
      this.missiles,
      ((
        playerObj: Phaser.GameObjects.GameObject,
        missileObj: Phaser.GameObjects.GameObject
      ) => {
        handlePlayerMissileCollision(this.gameManager, playerObj, missileObj);
      }) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
    );
  }

  startWaveCountdown(callback?: () => void) {
    this.isCountingDown = true;
    const countdownValues = ['3', '2', '1', 'Start!'];
    let index = 0;
    if (this.countdownText) this.countdownText.destroy();
    if (this.waveText) this.waveText.destroy();
    // Show next wave number above countdown
    let nextWaveNum = 1;
    if (this.gameManager && this.gameManager.wave > 0) {
      nextWaveNum = this.gameManager.wave + (callback ? 1 : 0);
    }
    this.waveText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, `Wave: ${nextWaveNum}`, {
        fontSize: '28px',
        color: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.countdownText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, countdownValues[index], {
        fontSize: '64px',
        color: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: countdownValues.length - 1,
      callback: () => {
        index++;
        if (index < countdownValues.length) {
          this.countdownText!.setText(countdownValues[index]);
        }
        if (index === countdownValues.length - 1) {
          // Last value, remove after 1s
          this.time.delayedCall(1000, () => {
            this.countdownText?.destroy();
            this.waveText?.destroy();
            this.isCountingDown = false;
            if (callback) callback();
            else this.gameManager.startGame();
          });
        }
      },
    });
  }

  update() {
    if (this.gameManager.gameOver) return;
    if (!this.player) return;
    this.player.handleInput(this.cursors, this.input.keyboard!, PLAYER_SPEED);
    this.reticle.setPosition(
      this.input.activePointer.worldX,
      this.input.activePointer.worldY
    );
    // Only start next wave after countdown
    if (!this.isCountingDown && this.missiles.countActive(true) === 0) {
      this.startWaveCountdown(() => this.gameManager.nextWave());
    }
  }
}
