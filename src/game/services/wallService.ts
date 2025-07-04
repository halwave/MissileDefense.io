// Service for wall generation
import Phaser from 'phaser';

export function generateWalls(
  scene: Phaser.Scene,
  walls: Phaser.Physics.Arcade.StaticGroup,
  border: number = 100
) {
  const wallImages = ['wall1', 'wall2'];
  const numWalls = Phaser.Math.Between(4, 7);
  for (let i = 0; i < numWalls; i++) {
    let wx, wy;
    const edge = Phaser.Math.Between(0, 3);
    if (edge === 0) {
      wx = Phaser.Math.Between(border, 800 - border);
      wy = Phaser.Math.Between(10, border);
    } else if (edge === 1) {
      wx = Phaser.Math.Between(border, 800 - border);
      wy = Phaser.Math.Between(600 - border, 590);
    } else if (edge === 2) {
      wx = Phaser.Math.Between(10, border);
      wy = Phaser.Math.Between(border, 600 - border);
    } else {
      wx = Phaser.Math.Between(800 - border, 790);
      wy = Phaser.Math.Between(border, 600 - border);
    }
    const wimg = wallImages[Phaser.Math.Between(0, wallImages.length - 1)];
    walls.create(wx, wy, wimg).setScale(1).refreshBody();
  }
}
