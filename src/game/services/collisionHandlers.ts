import { destroyMissileWithSplash } from './explosionService';
import { GameManager } from './gameManager';

export function handleBulletMissileCollision(
  gameManager: GameManager,
  scene: Phaser.Scene,
  missiles: Phaser.Physics.Arcade.Group,
  bulletObj: Phaser.GameObjects.GameObject,
  missileObj: Phaser.GameObjects.GameObject
) {
  (bulletObj as any).destroy();
  const destroyed = destroyMissileWithSplash(
    scene,
    missiles,
    missileObj as any
  );
  let scoreAdd = 0;
  for (let i = 1; i <= destroyed; i++) scoreAdd += i;
  gameManager.addScore(scoreAdd);
}

export function handlePlayerMissileCollision(
  gameManager: GameManager,
  playerObj: Phaser.GameObjects.GameObject,
  missileObj: Phaser.GameObjects.GameObject
) {
  const missile = missileObj as any;
  const player = playerObj as any;
  const missileBounds = missile.getBounds();
  const playerBounds = player.getBounds();
  const shrink = 0.7;
  const mx = missileBounds.centerX;
  const my = missileBounds.centerY;
  const mw = missileBounds.width * shrink;
  const mh = missileBounds.height * shrink;
  const shrunkMissileRect = new Phaser.Geom.Rectangle(
    mx - mw / 2,
    my - mh / 2,
    mw,
    mh
  );
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, shrunkMissileRect)
  ) {
    gameManager.setGameOver(() => gameManager.startGame());
  }
}
