import Phaser from 'phaser';
import { Missile } from '../entities/Missile';
import { Player } from '../entities/Player';

export function spawnMissileWave(
  scene: Phaser.Scene,
  missiles: Phaser.Physics.Arcade.Group,
  player: Player,
  count: number,
  gameWidth: number,
  gameHeight: number
) {
  missiles.clear(true, true);
  for (let i = 0; i < count; i++) {
    const edge = Phaser.Math.Between(0, 3);
    let x = 0,
      y = 0;
    if (edge === 0) {
      x = Phaser.Math.Between(-50, 0);
      y = Phaser.Math.Between(0, gameHeight);
    } else if (edge === 1) {
      x = Phaser.Math.Between(gameWidth, gameWidth + 50);
      y = Phaser.Math.Between(0, gameHeight);
    } else if (edge === 2) {
      x = Phaser.Math.Between(0, gameWidth);
      y = Phaser.Math.Between(-50, 0);
    } else {
      x = Phaser.Math.Between(0, gameWidth);
      y = Phaser.Math.Between(gameHeight, gameHeight + 50);
    }
    const missile = missiles.create(x, y, 'missile') as Missile;
    missile.target = player;
    missile.setActive(true).setVisible(true);
  }
}
