import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MissileDefenseScene } from '../game/MissileDefenseScene';

const PhaserGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let game: Phaser.Game | null = null;
    if (gameRef.current) {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: MissileDefenseScene,
      });
    }
    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);
  return <div ref={gameRef} style={{ width: 800, height: 600 }} />;
};

export default PhaserGame;
