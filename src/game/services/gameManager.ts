import { spawnMissileWave } from './missileSpawner';
import { UIManager } from './uiManager';
import { getNextWaveMissileCount } from './waveService';

export class GameManager {
  private scene: any;
  private ui: UIManager;
  private player: any;
  private missiles: any;
  private gameWidth: number;
  private gameHeight: number;
  public wave: number = 1;
  public missilesThisWave: number = 9;
  public score: number = 0;
  public gameOver: boolean = false;

  constructor(
    scene: any,
    ui: UIManager,
    player: any,
    missiles: any,
    gameWidth: number,
    gameHeight: number
  ) {
    this.scene = scene;
    this.ui = ui;
    this.player = player;
    this.missiles = missiles;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
  }

  startGame() {
    this.wave = 1;
    this.missilesThisWave = 9;
    this.score = 0;
    this.gameOver = false;
    this.scene.physics.resume();
    this.ui.updateScore(0);
    this.ui.updateWave(1);
    spawnMissileWave(
      this.scene,
      this.missiles,
      this.player,
      this.missilesThisWave,
      this.gameWidth,
      this.gameHeight
    );
  }

  nextWave() {
    this.wave++;
    this.missilesThisWave = getNextWaveMissileCount(this.missilesThisWave);
    this.ui.updateWave(this.wave);
    spawnMissileWave(
      this.scene,
      this.missiles,
      this.player,
      this.missilesThisWave,
      this.gameWidth,
      this.gameHeight
    );
  }

  addScore(amount: number) {
    this.score += amount;
    this.ui.updateScore(this.score);
  }

  setGameOver(onRetry: () => void) {
    this.gameOver = true;
    this.scene.physics.pause();
    this.ui.showGameOver(this.wave, this.gameWidth, this.gameHeight, onRetry);
  }
}
