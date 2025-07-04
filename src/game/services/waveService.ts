// Service for wave management
export function getNextWaveMissileCount(current: number): number {
  return current + Math.floor(Math.random() * 6) + 4; // +4 to +9
}
