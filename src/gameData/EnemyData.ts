export type EnemiesData = {
  [key: string]: EnemyData;
}

export type EnemyData = {
  type: string,
  texture: string,
  maxHealth: number,
  movementSpeed: number,
  movementAmplitude: number,
  movementFrequency: number,
  shotRate: number,
  shotAngleZone: number,
}