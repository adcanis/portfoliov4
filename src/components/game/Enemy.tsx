import React from "react";
import { useRecoilValue } from "recoil";
import { enemyPositionState } from "@/components/game/lib/GameContext";
import { v4 as uuidv4 } from "uuid";

const Enemy = () => {
  const enemies = useRecoilValue(enemyPositionState);

  return (
    <group>
      {enemies.map((enemy) => (
        <mesh position={[enemy.x, enemy.y, enemy.z]} key={uuidv4()}>
          <cylinderGeometry attach="geometry" args={[0.5, 0.5, 0.5, 6]} />
          <meshStandardMaterial color="#f2f2f2" />
        </mesh>
      ))}
    </group>
  );
};

export default Enemy;
