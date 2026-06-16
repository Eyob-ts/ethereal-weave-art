import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COUNT = 6000;

/** Sample point cloud from a glyph drawn to an offscreen canvas. */
function useGlyphTargets(glyph: string) {
  return useMemo(() => {
    const targets = new Float32Array(COUNT * 3);
    if (typeof document === "undefined") return targets;
    const c = document.createElement("canvas");
    const W = 220;
    const H = 220;
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.font = "700 170px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, W / 2, H / 2 + 8);
    const data = ctx.getImageData(0, 0, W, H).data;
    const hits: [number, number][] = [];
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (data[(y * W + x) * 4 + 3] > 128) hits.push([x, y]);
      }
    }
    for (let i = 0; i < COUNT; i++) {
      const [x, y] = hits.length ? hits[Math.floor(Math.random() * hits.length)] : [W / 2, H / 2];
      targets[i * 3] = (x / W - 0.5) * 6;
      targets[i * 3 + 1] = -(y / H - 0.5) * 6;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return targets;
  }, [glyph]);
}

const vertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aSeed;
  uniform float uTime;
  uniform float uForm;
  varying float vMix;
  void main(){
    // drifting flow-field position
    vec3 flow=aSeed;
    flow.x+=sin(uTime*0.5+aSeed.y*2.0)*1.4;
    flow.y+=cos(uTime*0.4+aSeed.x*2.0)*1.4;
    flow.z+=sin(uTime*0.3+aSeed.z*3.0)*0.6;
    float m=smoothstep(0.0,1.0,uForm);
    vMix=m;
    vec3 pos=mix(flow,aTarget,m);
    vec4 mv=modelViewMatrix*vec4(pos,1.0);
    gl_PointSize=(2.0+m*1.6)*(300.0/-mv.z);
    gl_Position=projectionMatrix*mv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying float vMix;
  void main(){
    vec2 uv=gl_PointCoord-0.5;
    float d=length(uv);
    if(d>0.5) discard;
    float a=smoothstep(0.5,0.0,d);
    vec3 dim=vec3(0.55,0.42,0.14);
    vec3 bright=vec3(0.95,0.8,0.35);
    vec3 col=mix(dim,bright,vMix);
    gl_FragColor=vec4(col,a*(0.5+vMix*0.5));
  }
`;

function Threads() {
  const targets = useGlyphTargets("Z");
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const form = useRef(0);
  const scatter = useRef(0);

  const seeds = useMemo(() => {
    const s = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) s[i] = (Math.random() - 0.5) * 9;
    return s;
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uForm: { value: 0 } }), []);

  useEffect(() => {
    const onClick = () => {
      scatter.current = 1;
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, []);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    if (scatter.current > 0) scatter.current = Math.max(0, scatter.current - delta * 0.6);
    form.current += (1 - form.current) * delta * 0.7;
    uniforms.uForm.value = form.current * (1 - scatter.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[targets, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ThreadParticles() {
  const [key] = useState(0);
  return (
    <Canvas
      key={key}
      className="!absolute inset-0"
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
    >
      <Threads />
    </Canvas>
  );
}
