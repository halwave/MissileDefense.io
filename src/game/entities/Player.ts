import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDamping(true);
    this.setDrag(0.95);
    this.setMaxVelocity(200);
  }

  handleInput(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin,
    speed: number
  ) {
    let vx = 0,
      vy = 0;
    let angle = this.angle;
    if (cursors.left.isDown || keyboard.addKey('A').isDown) {
      vx = -speed;
      angle = 180;
    }
    if (cursors.right.isDown || keyboard.addKey('D').isDown) {
      vx = speed;
      angle = 0;
    }
    if (cursors.up.isDown || keyboard.addKey('W').isDown) {
      vy = -speed;
      angle = 270;
    }
    if (cursors.down.isDown || keyboard.addKey('S').isDown) {
      vy = speed;
      angle = 90;
    }
    if (vx !== 0 || vy !== 0) {
      angle = Phaser.Math.RadToDeg(Math.atan2(vy, vx));
      this.setAngle(angle);
    }
    this.setVelocity(vx, vy);
  }
}
