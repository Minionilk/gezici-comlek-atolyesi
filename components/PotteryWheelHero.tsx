"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return x * x * (3 - 2 * x);
}

function createClayGeometry(radialSegments: number, heightSegments: number) {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const v = yIndex / heightSegments;

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const u = xIndex / radialSegments;
      const theta = u * Math.PI * 2;
      positions.push(Math.cos(theta) * 0.62, v * 1.7 - 0.85, Math.sin(theta) * 0.62);
      normals.push(Math.cos(theta), 0, Math.sin(theta));
      uvs.push(u, v);
    }
  }

  const row = radialSegments + 1;
  for (let yIndex = 0; yIndex < heightSegments; yIndex += 1) {
    for (let xIndex = 0; xIndex < radialSegments; xIndex += 1) {
      const a = yIndex * row + xIndex;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function updateClayShape(geometry: THREE.BufferGeometry, morph: number) {
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const radialSegments = 64;
  const heightSegments = 56;
  const row = radialSegments + 1;

  const bowlPhase = smoothstep(0.1, 0.58, morph);
  const heartPhase = smoothstep(0.55, 0.96, morph);

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const v = yIndex / heightSegments;
    const y = v * 1.72 - 0.86;
    const baseFoot = 0.46 + smoothstep(0, 0.2, v) * 0.16;
    const cylinderRadius = 0.58 + Math.sin(v * Math.PI) * 0.035;
    const bowlRadius = baseFoot + Math.pow(v, 0.72) * 0.62 + Math.sin(v * Math.PI) * 0.08;
    const neckTuck = heartPhase * smoothstep(0.58, 0.86, v) * (1 - smoothstep(0.9, 1, v)) * 0.16;
    const rimBand = smoothstep(0.72, 1, v);

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const index = yIndex * row + xIndex;
      const theta = (xIndex / radialSegments) * Math.PI * 2;
      const rimWave = Math.sin(theta * 2) * 0.025 * bowlPhase * smoothstep(0.42, 1, v);
      const lobe = Math.pow(Math.max(Math.sin(theta), 0), 2) * 0.28;
      const lowerPoint = Math.max(-Math.sin(theta), 0) * 0.2;
      const notch = Math.exp(-Math.pow(theta - Math.PI / 2, 2) * 16) * 0.22;
      const heartContour = (lobe + lowerPoint - notch) * heartPhase * rimBand;
      const radius = THREE.MathUtils.lerp(cylinderRadius, bowlRadius, bowlPhase) - neckTuck + rimWave + heartContour;
      const rimLift = heartPhase * rimBand * (lobe * 0.12 - notch * 0.18);
      const wetThrowLines = Math.sin(v * 44 + theta * 1.4) * 0.009 * (0.35 + bowlPhase);

      position.setXYZ(
        index,
        Math.cos(theta) * (radius + wetThrowLines),
        y + rimLift,
        Math.sin(theta) * (radius + wetThrowLines),
      );
    }
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export default function PotteryWheelHero() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = prefersReducedMotion();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff7ec");

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 1.05, 5.1);
    camera.lookAt(0, 0.22, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#fff4e6", 2.1);
    const keyLight = new THREE.DirectionalLight("#fff7ef", 2.7);
    keyLight.position.set(3.2, 4.4, 3.6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    const fillLight = new THREE.DirectionalLight("#d8865f", 0.65);
    fillLight.position.set(-3, 1.8, 2);
    scene.add(ambientLight, keyLight, fillLight);

    const wheelGroup = new THREE.Group();
    scene.add(wheelGroup);

    const clayGeometry = createClayGeometry(64, 56);
    const clayMaterial = new THREE.MeshStandardMaterial({
      color: "#f8f1e8",
      metalness: 0.02,
      roughness: 0.34,
      envMapIntensity: 0.7,
    });
    const clay = new THREE.Mesh(clayGeometry, clayMaterial);
    clay.position.y = 0.18;
    clay.castShadow = true;
    clay.receiveShadow = true;
    wheelGroup.add(clay);

    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: "#d7bba2",
      metalness: 0.08,
      roughness: 0.45,
    });
    const wheelTop = new THREE.Mesh(new THREE.CylinderGeometry(1.58, 1.68, 0.18, 96), wheelMaterial);
    wheelTop.position.y = -0.78;
    wheelTop.castShadow = true;
    wheelTop.receiveShadow = true;
    wheelGroup.add(wheelTop);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.24, 1.52, 0.58, 96),
      new THREE.MeshStandardMaterial({ color: "#caa98d", roughness: 0.52, metalness: 0.04 }),
    );
    base.position.y = -1.14;
    base.castShadow = true;
    base.receiveShadow = true;
    wheelGroup.add(base);

    const platform = new THREE.Mesh(
      new THREE.CircleGeometry(3.1, 96),
      new THREE.ShadowMaterial({ color: "#6c4a38", opacity: 0.13 }),
    );
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -1.45;
    platform.receiveShadow = true;
    scene.add(platform);

    let frameId = 0;
    const clock = new THREE.Clock();

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(rect.width, 280);
      const height = Math.max(rect.height, 300);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const morph = reduceMotion ? 0.72 : (Math.sin(elapsed * 0.58 - Math.PI / 2) + 1) / 2;
      updateClayShape(clayGeometry, morph);

      clay.rotation.y += reduceMotion ? 0 : 0.024;
      wheelTop.rotation.y += reduceMotion ? 0 : 0.038;
      wheelGroup.rotation.x = -0.06;
      wheelGroup.rotation.z = Math.sin(elapsed * 0.42) * 0.012;

      renderer.render(scene, camera);
      if (!reduceMotion) frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) window.cancelAnimationFrame(frameId);
      mount.removeChild(renderer.domElement);
      clayGeometry.dispose();
      clayMaterial.dispose();
      wheelTop.geometry.dispose();
      wheelMaterial.dispose();
      base.geometry.dispose();
      (base.material as THREE.Material).dispose();
      platform.geometry.dispose();
      (platform.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="hero-art pottery-hero"
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      <div
        aria-label="Seramik tornasında dönen beyaz çamurun çanak ve kalp formuna dönüşen Three.js animasyonu"
        className="pottery-hero-canvas"
        ref={mountRef}
        role="img"
      />
      <div className="pottery-hero-caption">
        <span>Beyaz çamur</span>
        <span>Çömlekçi çarkı</span>
        <span>Canlı form akışı</span>
      </div>
    </motion.div>
  );
}
