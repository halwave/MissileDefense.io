import Phaser from 'phaser';

export class UIManager {
  private scene: Phaser.Scene;
  private waveText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private retryButton?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, gameWidth: number) {
    this.scene = scene;
    this.waveText = scene.add
      .text(16, 16, 'Wave: 1', { fontSize: '24px', color: '#000' })
      .setScrollFactor(0)
      .setDepth(1000);
    this.scoreText = scene.add
      .text(gameWidth - 16, 16, 'Score: 0', { fontSize: '24px', color: '#000' })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000);
  }

  updateScore(score: number) {
    this.scoreText.setText('Score: ' + score);
  }

  updateWave(wave: number) {
    this.waveText.setText('Wave: ' + wave);
  }

  showGameOver(
    wave: number,
    gameWidth: number,
    gameHeight: number,
    onRetry: () => void
  ) {
    this.waveText.setText('GAME OVER - Wave: ' + wave);
    this.retryButton = this.scene.add
      .text(gameWidth / 2, gameHeight / 2, 'Retry', {
        fontSize: '32px',
        color: '#fff',
        backgroundColor: '#222',
        padding: { left: 16, right: 16, top: 8, bottom: 8 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    this.scene.children.bringToTop(this.retryButton);
    if (this.retryButton.input) this.retryButton.input.enabled = true;
    this.retryButton.on('pointerdown', () => {
      this.retryButton?.destroy();
      onRetry();
    });
  }
}
