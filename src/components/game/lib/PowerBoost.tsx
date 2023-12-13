import React from "react";
import * as THREE from "three";
import { Effect } from "postprocessing";
import { isBoostingState } from "./GameContext";
import { useRecoilState } from "recoil";

const shader = `
uniform float strength;

float rand2 (vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 aspectCorrection = vec2(1.0, aspect);

  vec2 dir = normalize(uv - vec2(0.5));
  float dist = length(uv - vec2(0.5));
  float positionalStrength = max(dist - 0.1, 0.0) * 0.1;
  positionalStrength = pow(positionalStrength, 1.5) * 7.0;

  vec4 accum = vec4(0.0);
  for (int i = 0; i < 7; i++) {
    vec2 offs1 = -dir * positionalStrength * strength * ((float(i) + rand2(uv * 5.0)) * 0.2);
    vec2 offs2 = dir * positionalStrength * strength * ((float(i) + rand2(uv * 5.0)) * 0.2);

    accum += texture2D(inputBuffer, uv + offs1);
    accum += texture2D(inputBuffer, uv + offs2);
  }
  accum *= 1.0 / 14.0;

	outputColor = accum;
}`;

class PowerBoostEffect extends Effect {
  constructor() {
    super("PowerBoost", shader, {
      uniforms: new Map([["strength", new THREE.Uniform(0)]]),
    });
  }
  setStrength(value: any) {
    const strengthUniform = this.uniforms.get("strength");
    if (strengthUniform) {
      strengthUniform.value = value;
    }
  }

  update(renderer: any, inputBuffer: any, deltaTime: any) {
    const strengthUniform = this.uniforms.get("strength");
    if (strengthUniform) {
      strengthUniform.value = Math.max(
        0,
        strengthUniform.value - deltaTime * 0.5
      );
    }
  }
}

const PowerBoost = React.forwardRef(({}, ref) => {
  const boostTimeoutRef = React.useRef<any>();
  const cooldownTimeoutRef = React.useRef<any>();
  const lastBoostTimeRef = React.useRef<number>(0);
  const effect = React.useMemo(() => new PowerBoostEffect(), []);
  const [isBoosting, setIsBoosting] = useRecoilState(isBoostingState);

  React.useEffect(() => {
    const handleKeyDown = (e: any) => {
      const now = Date.now();
      const timeSinceLastBoost = now - lastBoostTimeRef.current;
      if (e.code === "Space" && !isBoosting && timeSinceLastBoost >= 5000) {
        // 5 seconds cooldown
        lastBoostTimeRef.current = now;
        setIsBoosting(true);
        clearTimeout(boostTimeoutRef.current);
        boostTimeoutRef.current = setTimeout(() => {
          setIsBoosting(false);
        }, 1500);
      }
    };

    const handleKeyUp = (e: any) => {
      if (e.code === "Space") {
        setIsBoosting(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearTimeout(boostTimeoutRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(cooldownTimeoutRef.current);
    };
  }, [isBoosting, setIsBoosting]);

  React.useEffect(() => {
    if (effect) {
      effect.setStrength(isBoosting ? 1 : 0);
    }
  }, [isBoosting, effect]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

PowerBoost.displayName = "PowerBoost";
export default PowerBoost;
