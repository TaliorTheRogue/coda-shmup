export type EnemiesData = {
  [key: string]: EnemyData;
}

export type EnemyData = {
  type: string,
  texture: string,
  shootAnimation: string,
  maxHealth: number,
  movementType: string,
  movementSpeed: number,
  movementAmplitude: number,
  movementFrequency: number,
  projectileCount: number,
  shotAngleZone: number,
}