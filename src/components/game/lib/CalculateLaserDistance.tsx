export const CalculateLaserDistance = (laser: any, enemy: any) => {
  const dx = enemy.x - laser.x;
  const dy = enemy.y - laser.y;
  const dz = enemy.z - laser.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
