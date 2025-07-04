export interface Player {
  x: number;
  y: number;
  active: boolean;
  health: number;
}

export interface Bullet {
  x: number;
  y: number;
  speed: number;
  direction: number;
  active: boolean;
  born: number;
}

export interface Enemy {
  x: number;
  y: number;
  speed: number;
  health: number;
  active: boolean;
  target: Player | null;
}

export interface GameState {
  score: number;
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
}
