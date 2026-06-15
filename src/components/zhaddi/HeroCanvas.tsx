import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uWind;
  varying vec2 vUv;
  varying float vElev;
  varying vec3 vNormalW;

  // classic simplex noise (Ashima)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865,0.366025403,-0.577350269,0.024390243);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;
    vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);
    vec3 a0=x-ox;
    m*=1.79284291-0.85373472*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }

  void main(){
    vUv=uv;
    vec3 pos=position;
    float t=uTime*0.35;
    float ripple=
      snoise(vec2(pos.x*1.2+t, pos.y*1.2-t))*0.45+
      snoise(vec2(pos.x*2.6-t*0.7, pos.y*2.2+t*0.5))*0.22;
    float mdist=distance(uv,uMouse*0.5+0.5);
    float mouseInf=smoothstep(0.5,0.0,mdist)*0.6;
    float elev=(ripple+mouseInf)*uWind;
    pos.z+=elev;
    vElev=elev;

    float eps=0.02;
    float ex=snoise(vec2((pos.x+eps)*1.2+t,pos.y*1.2-t))*0.45;
    float ey=snoise(vec2(pos.x*1.2+t,(pos.y+eps)*1.2-t))*0.45;
    vec3 nx=vec3(eps,0.0,(ex-ripple)*uWind);
    vec3 ny=vec3(0.0,eps,(ey-ripple)*uWind);
    vNormalW=normalize(cross(nx,ny));
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;
  varying float vElev;
  varying vec3 vNormalW;

  void main(){
    vec3 ivory=vec3(0.92,0.88,0.82);
    vec3 gold=vec3(0.83,0.69,0.22);
    vec3 deep=vec3(0.035,0.035,0.06);

    vec3 viewDir=vec3(0.0,0.0,1.0);
    float fres=pow(1.0-max(dot(normalize(vNormalW),viewDir),0.0),3.0);
    float sheen=smoothstep(-0.1,0.55,vElev);

    vec3 col=mix(deep,ivory,sheen*0.4);
    col=mix(col,gold,fres*0.55);
    float streak=sin((vUv.y*40.0)+uTime*0.6+vElev*8.0)*0.5+0.5;
    col+=gold*streak*0.05*sheen;
    float vignette=smoothstep(1.2,0.15,distance(vUv,vec2(0.5)));
    col*=vignette;
    col=mix(deep,col,0.92);
    gl_FragColor=vec4(col,1.0);
  }
`;

function Silk() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uWind: { value: 0.6 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!matRef.current || !mesh.current) return;
    uniforms.uTime.value += delta;
    const px = state.pointer.x;
    const py = state.pointer.y;
    mouse.current.lerp(new THREE.Vector2(px, py), 0.05);
    uniforms.uMouse.value.copy(mouse.current);
    mesh.current.rotation.z = Math.sin(uniforms.uTime.value * 0.1) * 0.04;
  });

  const scale = Math.max(viewport.width, viewport.height) * 1.15;

  return (
    <mesh ref={mesh} rotation={[-0.55, 0, 0]} scale={scale}>
      <planeGeometry args={[2, 2, 180, 180]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 2.4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#0a0a0f"]} />
      <Silk />
    </Canvas>
  );
}
