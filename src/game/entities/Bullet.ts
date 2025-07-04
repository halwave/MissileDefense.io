import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  lifetime = 2000; // milliseconds
  spawnTime = 0;

  // No custom constructor: use group.create() in the scene
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (time - this.spawnTime > this.lifetime) {
      this.destroy();
    }
  }
}
