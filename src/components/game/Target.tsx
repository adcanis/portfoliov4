import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CrossHair from "@/assets/target.png";

const Target = ({ mousePosition }: { mousePosition: THREE.Vector3 }) => {
  const ref = React.useRef<any>();
  const texture = React.useMemo(
    () => new THREE.TextureLoader().load(CrossHair.src),
    []
  );

  useFrame(() => {
    if (ref.current) {
      const targetYOffset = 3.33;
      const targetX = mousePosition.x * 6;
      const targetY = mousePosition.y * 2 + targetYOffset;

      ref.current.position.lerp(new THREE.Vector3(targetX, targetY, -5), 0.1);
    }
  });

  return (
    <group>
      <sprite ref={ref} position={[0, 0, 0]} scale={[0.25, 0.25, 0.25]}>
        <spriteMaterial attach="material" map={texture} />
      </sprite>
    </group>
  );
};

export default Target;
