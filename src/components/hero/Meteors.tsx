import React from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Vector3 } from "three";

type BoxProps = {
  color: string;
  key: number;
};

const getInitialPosition = () => {
  let v = new Vector3(
    (Math.random() * 2 - 1) * 3,
    Math.random() * 2.5 + 0.1,
    (Math.random() * 2 - 1) * 15
  );
  if (v.x < 0) v.x -= 1.75;
  if (v.x > 0) v.x += 1.75;

  return v;
};

const Meteor = ({ color }: BoxProps) => {
  const boxRef = React.useRef<Mesh>(null);
  const timeRef = React.useRef<number>(0);
  const [position, setPosition] = React.useState<Vector3>(getInitialPosition());
  const [xRotateSpeed] = React.useState(() => Math.random());
  const [yRotateSpeed] = React.useState(() => Math.random());
  const [scale] = React.useState(
    () => Math.pow(Math.random(), 2.0) * 0.025 + 0.05
  );

  const resetPosition = () => {
    let v = new Vector3(
      (Math.random() * 2 - 1) * 3,
      Math.random() * 2.5 + 0.1,
      Math.random() * 10 + 10
    );
    if (v.x < 0) v.x -= 1.75;
    if (v.x > 0) v.x += 1.75;

    setPosition(v);
  };

  useFrame((state, delta) => {
    timeRef.current += delta * 0.075;
    let newZ = position.z - timeRef.current;

    if (newZ < -10) {
      resetPosition();
      timeRef.current = 0;
    }

    if (boxRef.current) {
      boxRef.current.position.set(position.x, position.y, newZ);
      boxRef.current.rotation.x += delta * xRotateSpeed;
      boxRef.current.rotation.y += delta * yRotateSpeed;
    }
  });

  return (
    <mesh ref={boxRef} rotation-x={Math.PI * 0.5} scale={scale} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.5, 6]} />
      <meshStandardMaterial color={color} envMapIntensity={0.15} />
    </mesh>
  );
};

const Meteors = () => {
  const containerRef = React.useRef<Group>(null);
  const colors = ["#889293", "#CCD6D8"];

  const [boxes] = React.useState<BoxProps[]>(() =>
    new Array(1500).fill(null).map((_, i) => ({
      key: i,
      color: colors[i % 2 === 0 ? colors.length - 1 : colors.length - 2],
    }))
  );

  return (
    <group ref={containerRef}>
      {boxes.map((box) => (
        <Meteor key={box.key} color={box.color} />
      ))}
    </group>
  );
};

export default Meteors;
