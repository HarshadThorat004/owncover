"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

type CardSpec = {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  scan?: boolean;
};

const CARDS: CardSpec[] = [
  {
    url: "/brand/features/claim-pack.png",
    position: [0.08, 0.04, 0.62],
    rotation: [-0.06, 0.2, 0.02],
    size: [2.4, 1.35],
    scan: true,
  },
  {
    url: "/brand/features/gst-scan.png",
    position: [-1.5, 0.24, -0.5],
    rotation: [-0.02, 0.55, 0.05],
    size: [1.72, 0.97],
  },
  {
    url: "/brand/features/timeline.png",
    position: [1.46, -0.16, -0.2],
    rotation: [0.04, -0.5, -0.04],
    size: [1.58, 0.89],
  },
];

function Scan({ width }: { width: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const wave = Math.sin(clock.elapsedTime * 0.9);
    group.position.y = wave * 0.46;
    const beam = group.children[0] as THREE.Mesh;
    (beam.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.abs(wave) * 0.35;
  });

  return (
    <group ref={ref} position={[0, 0, 0.03]}>
      <mesh>
        <planeGeometry args={[width, 0.012]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[width, 0.09]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

class HoloTextureLoader extends THREE.TextureLoader {
  override load(
    url: string,
    onLoad?: (data: THREE.Texture<HTMLImageElement>) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void
  ): THREE.Texture<HTMLImageElement> {
    return super.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        onLoad?.(texture);
      },
      onProgress,
      onError
    );
  }
}

function HoloCard({ url, position, rotation, size, scan }: CardSpec) {
  const texture = useLoader(HoloTextureLoader, url);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[size[0] + 0.045, size[1] + 0.045]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.28} />
      </mesh>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {scan ? <Scan width={size[0] * 0.9} /> : null}
    </group>
  );
}

const DUST_POSITIONS = (() => {
  const count = 72;
  const positions = new Float32Array(count * 3);
  let seed = 17;
  const rand = () => {
    seed = (seed * 48271) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rand() - 0.5) * 6.4;
    positions[i * 3 + 1] = (rand() - 0.5) * 3.6;
    positions[i * 3 + 2] = (rand() - 0.5) * 3.4;
  }
  return positions;
})();

function Dust() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(DUST_POSITIONS, 3)
    );
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#7dd3fc"
        size={0.018}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Stage({
  cards,
  onReady,
}: {
  cards: CardSpec[];
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame((state, delta) => {
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.045;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.045;
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y =
        Math.sin(t * 0.22) * 0.34 + pointer.current.x * 0.32;
      group.current.rotation.x =
        pointer.current.y * 0.14 + Math.sin(t * 0.16) * 0.04;
      group.current.position.y = Math.sin(t * 0.55) * 0.07;
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <>
      <Dust />
      <group ref={ring} position={[0, -0.05, 0]} rotation={[1.15, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[1.95, 0.006, 12, 120]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[0, 0, 0.9]}>
          <torusGeometry args={[1.55, 0.004, 12, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
        <circleGeometry args={[1.35, 48]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
      <group ref={group}>
        {cards.map((card) => (
          <HoloCard key={card.url} {...card} />
        ))}
      </group>
    </>
  );
}

type Props = {
  active: boolean;
  lite: boolean;
  onReady: () => void;
};

export default function VaultScene({ active, lite, onReady }: Props) {
  const cards = lite ? CARDS.slice(0, 2) : CARDS;

  return (
    <Canvas
      className="absolute inset-0 !h-full !w-full"
      style={{ touchAction: "pan-y" }}
      frameloop={active ? "always" : "never"}
      dpr={lite ? [1, 1.25] : [1, 1.6]}
      camera={{ position: [0, 0.12, 4.7], fov: 34 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <Stage cards={cards} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
