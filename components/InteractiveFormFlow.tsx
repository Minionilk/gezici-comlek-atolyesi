"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const formOptions = [
  {
    id: "bowl",
    label: "Çanak",
    description: "Çamur merkezlenir, üst kısım yavaşça açılarak geniş ağızlı çanak formu oluşturulur.",
  },
  {
    id: "cup",
    label: "Kap",
    description: "Çamur dikey yükseltilir, duvarlar sade ve kulpsuz küçük kap formuna getirilir.",
  },
  {
    id: "star",
    label: "Yıldız",
    description: "Üst çeper beş köşeli ritimde dışa-içe yönlendirilerek dekoratif yıldız etkisi verilir.",
  },
  {
    id: "flower",
    label: "Çiçek",
    description: "Üst kısım yumuşak dalgalarla altı yapraklı çiçek formuna yaklaştırılır.",
  },
  {
    id: "vase",
    label: "Vazo",
    description: "Gövde genişletilir, boyun kısmı daraltılır ve ağız dengeli biçimde açılır.",
  },
  {
    id: "heart",
    label: "Özgün Kalp formu",
    description: "Üst çeper kalp karakterine yaklaşacak şekilde kıvrılır, alt taban tornada dengeli kalır.",
  },
] as const;

type FormId = (typeof formOptions)[number]["id"];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function createGeometry(radialSegments = 56, heightSegments = 48) {
  const positions: number[] = [];
  const indices: number[] = [];

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const v = yIndex / heightSegments;

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const theta = (xIndex / radialSegments) * Math.PI * 2;
      positions.push(Math.cos(theta) * 0.5, v * 1.45 - 0.72, Math.sin(theta) * 0.5);
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
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function radiusForForm(form: FormId, v: number, theta: number) {
  const foot = 0.36 + smoothstep(0, 0.18, v) * 0.08;
  const topBand = smoothstep(0.62, 1, v);
  const belly = Math.sin(v * Math.PI);

  if (form === "bowl") return foot + Math.pow(v, 0.78) * 0.52 + belly * 0.06;
  if (form === "cup") return 0.46 + smoothstep(0.2, 1, v) * 0.08 + belly * 0.025;
  if (form === "star") return 0.47 + topBand * Math.cos(theta * 5) * 0.11 + belly * 0.03;
  if (form === "flower") return 0.47 + topBand * Math.sin(theta * 6) * 0.09 + belly * 0.035;
  if (form === "vase") {
    const shoulder = Math.exp(-Math.pow(v - 0.42, 2) * 9) * 0.28;
    const neck = smoothstep(0.68, 0.9, v) * 0.22;
    return 0.38 + shoulder - neck + smoothstep(0.9, 1, v) * 0.08;
  }

  const lobes = Math.pow(Math.max(Math.sin(theta), 0), 2) * 0.22;
  const point = Math.max(-Math.sin(theta), 0) * 0.12;
  const notch = Math.exp(-Math.pow(theta - Math.PI / 2, 2) * 16) * 0.18;
  return 0.45 + belly * 0.04 + topBand * (lobes + point - notch);
}

function updateGeometry(geometry: THREE.BufferGeometry, fromForm: FormId, toForm: FormId, mix: number) {
  const radialSegments = 56;
  const heightSegments = 48;
  const row = radialSegments + 1;
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const v = yIndex / heightSegments;
    const y = v * 1.45 - 0.72;

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const theta = (xIndex / radialSegments) * Math.PI * 2;
      const throwLine = Math.sin(v * 34 + theta * 1.2) * 0.006;
      const fromRadius = radiusForForm(fromForm, v, theta);
      const toRadius = radiusForForm(toForm, v, theta);
      const radius = clamp(THREE.MathUtils.lerp(fromRadius, toRadius, mix) + throwLine, 0.28, 0.86);
      const fromRimLift = fromForm === "heart" ? smoothstep(0.72, 1, v) * Math.sin(theta) * 0.035 : 0;
      const toRimLift = toForm === "heart" ? smoothstep(0.72, 1, v) * Math.sin(theta) * 0.035 : 0;
      const rimLift = THREE.MathUtils.lerp(fromRimLift, toRimLift, mix);

      position.setXYZ(yIndex * row + xIndex, Math.cos(theta) * radius, y + rimLift, Math.sin(theta) * radius);
    }
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export default function InteractiveFormFlow() {
  const [selectedForm, setSelectedForm] = useState<FormId>("bowl");
  const selectedOption = formOptions.find((option) => option.id === selectedForm) ?? formOptions[0];
  const selectedFormRef = useRef<FormId>("bowl");
  const previousFormRef = useRef<FormId>("bowl");
  const morphProgressRef = useRef(1);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedFormRef.current !== selectedForm) {
      previousFormRef.current = selectedFormRef.current;
      morphProgressRef.current = 0;
    }
    selectedFormRef.current = selectedForm;
  }, [selectedForm]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff8ef");

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(2.75, 1.85, 3.05);
    camera.lookAt(0, -0.08, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight("#fff4e7", 2.2));
    const keyLight = new THREE.DirectionalLight("#fffaf3", 2.5);
    keyLight.position.set(2.4, 3.2, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight("#d38a62", 0.55);
    fillLight.position.set(-2.4, 1.2, 2);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = createGeometry();
    updateGeometry(geometry, previousFormRef.current, selectedFormRef.current, morphProgressRef.current);
    const material = new THREE.MeshStandardMaterial({ color: "#f8f1e8", roughness: 0.38, metalness: 0.02 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.02;
    group.add(mesh);

    const wheelMaterial = new THREE.MeshStandardMaterial({ color: "#d7bba2", roughness: 0.48, metalness: 0.06 });
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.14, 0.14, 72), wheelMaterial);
    wheel.position.y = -0.72;
    group.add(wheel);

    let frameId = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(rect.width, 260);
      const height = Math.max(rect.height, 280);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      group.scale.setScalar(width < 360 ? 0.86 : 0.96);
      renderer.setSize(width, height, false);
    };

    const render = () => {
      morphProgressRef.current = clamp(morphProgressRef.current + 0.035, 0, 1);
      const easedMix = smoothstep(0, 1, morphProgressRef.current);
      updateGeometry(geometry, previousFormRef.current, selectedFormRef.current, easedMix);
      mesh.rotation.y += reducedMotion ? 0 : 0.026;
      wheel.rotation.y += reducedMotion ? 0 : 0.04;
      group.rotation.x = -0.03;
      renderer.render(scene, camera);
      if (!reducedMotion) frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) window.cancelAnimationFrame(frameId);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      wheel.geometry.dispose();
      wheelMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="form-flow-panel">
      <div className="form-flow-copy">
        <p className="section-kicker">Canlı Form Akışı</p>
        <h3>Çarkta şekil değiştiren beyaz çamur</h3>
        <p>Butonlardan bir form seçin; mini torna üzerindeki beyaz çamur aynı alanda dönerken yeni profile geçer.</p>
        <div className="form-flow-buttons" aria-label="Seramik form seçimi">
          {formOptions.map((option) => (
            <button
              aria-pressed={selectedForm === option.id}
              className={selectedForm === option.id ? "is-active" : ""}
              key={option.id}
              onClick={() => setSelectedForm(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="form-flow-description" aria-live="polite">
          <strong>{selectedOption.label}</strong>
          <p>{selectedOption.description}</p>
        </div>
      </div>
      <div
        aria-label="Seçilen forma göre morph eden beyaz çamur mini Three.js animasyonu"
        className="form-flow-canvas"
        ref={mountRef}
        role="img"
      />
    </div>
  );
}
