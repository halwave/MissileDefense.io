// Service for explosion and splash logic
import Phaser from 'phaser';
import { Missile } from '../entities/Missile';

export function spawnExplosion(
  scene: Phaser.Scene,
  x: number,
  y: number
): Phaser.GameObjects.Sprite {
  const explosion = scene.add.sprite(x, y, 'explosion').setDepth(999);
  explosion.setScale(0.5);
  explosion.setOrigin(0.5, 0.5);
  explosion.play('explode');
  return explosion;
}

export function destroyMissileWithSplash(
  scene: Phaser.Scene,
  missiles: Phaser.Physics.Arcade.Group,
  missile: Missile,
  chain: number = 1
): number {
  if (!missile.active) return 0;
  const explosion = spawnExplosion(scene, missile.x, missile.y);
  missile.destroy();
  let destroyed = 1;
  if (chain > 10) return destroyed;
  const explosionBounds = explosion.getBounds();
  missiles.children.each((other: Phaser.GameObjects.GameObject) => {
    const otherMissile = other as Missile;
    if (!otherMissile.active || otherMissile === missile) return false;
    const otherBounds = otherMissile.getBounds();
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(explosionBounds, otherBounds)
    ) {
      destroyed += destroyMissileWithSplash(
        scene,
        missiles,
        otherMissile,
        chain + 1
      );
    }
    return false;
  }, scene);
  return destroyed;
}
