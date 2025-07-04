import Phaser from 'phaser';
import { Player } from './Player';

export class Missile extends Phaser.Physics.Arcade.Sprite {
  target: Player;
  speed: number = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
    super(scene, x, y, 'missile');
    scene.physics.add.existing(this);
    this.target = target;
    this.setActive(true);
    this.setVisible(true);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.target.active) return;
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );
    this.setRotation(angle);
    this.scene.physics.velocityFromRotation(
      angle,
      this.speed,
      (this.body as Phaser.Physics.Arcade.Body).velocity
    );
  }
}
