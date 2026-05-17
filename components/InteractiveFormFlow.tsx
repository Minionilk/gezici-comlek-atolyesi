"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const formOptions = [
  {
    id: "bowl",
    label: "Çanak",
    description: "Geniş tabanlı, hacimli çanak formu.",
  },
  {
    id: "cup",
    label: "Kap",
    description: "Dengeli, sade küçük kap profili.",
  },
  {
    id: "star",
    label: "Yıldız",
    description: "Gövde çanak kalır, üst çeper beş köşeli görünür.",
  },
  {
    id: "flower",
    label: "Çiçek",
    description: "Gövde çanak kalır, rim altı yumuşak yaprak taşır.",
  },
  {
    id: "vase",
    label: "Vazo",
    description: "Geniş omuzlu, dar boyunlu vazo profili.",
  },
  {
    id: "heart",
    label: "Özgün Kalp formu",
    description: "Otomatik akış: çanak, çiçek, yıldız, kalp ve vazo.",
  },
] as const;

type FormId = (typeof formOptions)[number]["id"];
const showcaseForms: FormId[] = ["bowl", "flower", "star", "heart", "vase"];
const formLabels = new Map<FormId, string>(formOptions.map((option) => [option.id, option.label]));

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
      positions.push(Math.cos(theta) * 0.5, v * 1.32 - 0.66, Math.sin(theta) * 0.5);
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
  const foot = 0.4 + smoothstep(0, 0.2, v) * 0.14;
  const rimBand = Math.pow(smoothstep(0.72, 1, v), 1.7);
  const belly = Math.sin(v * Math.PI);
  const bowlBody = foot + Math.pow(v, 0.68) * 0.48 + belly * 0.1;

  if (form === "bowl") return bowlBody;
  if (form === "cup") return 0.46 + smoothstep(0.2, 1, v) * 0.08 + belly * 0.025;
  if (form === "star") return bowlBody + rimBand * Math.cos(theta * 5) * 0.13;
  if (form === "flower") return bowlBody + rimBand * Math.sin(theta * 6) * 0.1;
  if (form === "vase") {
    const shoulder = Math.exp(-Math.pow(v - 0.42, 2) * 9) * 0.28;
    const neck = smoothstep(0.68, 0.9, v) * 0.22;
    return 0.38 + shoulder - neck + smoothstep(0.9, 1, v) * 0.08;
  }

  const wrapped = Math.atan2(Math.sin(theta - Math.PI / 2), Math.cos(theta - Math.PI / 2));
  const lobes = Math.pow(Math.abs(Math.sin(theta)), 1.7) * 0.17;
  const point = Math.max(-Math.sin(theta), 0) * 0.1;
  const notch = Math.exp(-wrapped * wrapped * 18) * 0.24;
  return bowlBody + rimBand * (lobes + point - notch);
}

function updateGeometry(geometry: THREE.BufferGeometry, fromForm: FormId, toForm: FormId, mix: number) {
  const radialSegments = 56;
  const heightSegments = 48;
  const row = radialSegments + 1;
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const v = yIndex / heightSegments;
    const y = v * 1.32 - 0.66;

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const theta = (xIndex / radialSegments) * Math.PI * 2;
      const throwLine = Math.sin(v * 34 + theta * 1.2) * 0.006;
      const fromRadius = radiusForForm(fromForm, v, theta);
      const toRadius = radiusForForm(toForm, v, theta);
      const radius = clamp(THREE.MathUtils.lerp(fromRadius, toRadius, mix) + throwLine, 0.3, 1.06);
      const heartLift = (form: FormId) => {
        if (form !== "heart") return 0;
        const wrapped = Math.atan2(Math.sin(theta - Math.PI / 2), Math.cos(theta - Math.PI / 2));
        const topBand = smoothstep(0.72, 1, v);
        const lobes = Math.pow(Math.abs(Math.sin(theta)), 1.6) * 0.04;
        const notch = Math.exp(-wrapped * wrapped * 18) * 0.075;
        return topBand * (lobes - notch);
      };
      const fromRimLift = heartLift(fromForm);
      const toRimLift = heartLift(toForm);
      const rimLift = THREE.MathUtils.lerp(fromRimLift, toRimLift, mix);

      position.setXYZ(yIndex * row + xIndex, Math.cos(theta) * radius, y + rimLift, Math.sin(theta) * radius);
    }
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export default function InteractiveFormFlow() {
  const [selectedForm, setSelectedForm] = useState<FormId>("bowl");
  const [showcaseForm, setShowcaseForm] = useState<FormId>("bowl");
  const selectedOption = formOptions.find((option) => option.id === selectedForm) ?? formOptions[0];
  const selectedFormRef = useRef<FormId>("bowl");
  const previousFormRef = useRef<FormId>("bowl");
  const morphProgressRef = useRef(1);
  const autoShowcaseRef = useRef(false);
  const showcaseIndexRef = useRef(0);
  const showcaseLabelRef = useRef<FormId>("bowl");
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    autoShowcaseRef.current = selectedForm === "heart";
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
    scene.background = new THREE.Color("#efe0cd");

    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 90);
    camera.position.set(3.2, 2.2, 3.2);
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
      group.scale.setScalar(width < 360 ? 0.74 : width < 520 ? 0.82 : 0.9);
      renderer.setSize(width, height, false);
      const bounds = new THREE.Box3().setFromObject(group);
      const center = bounds.getCenter(new THREE.Vector3());
      const sphere = bounds.getBoundingSphere(new THREE.Sphere());
      const aspect = width / height;
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
      const fitFov = Math.min(verticalFov, horizontalFov);
      const distance = (sphere.radius / Math.sin(fitFov / 2)) * 1.28;
      camera.aspect = aspect;
      camera.near = 0.01;
      camera.far = Math.max(80, distance + sphere.radius * 8);
      camera.position.set(center.x + distance * 0.64, center.y + distance * 0.46, center.z + distance * 0.64);
      camera.lookAt(center.x, center.y - sphere.radius * 0.05, center.z);
      camera.updateProjectionMatrix();
    };

    const render = () => {
      if (autoShowcaseRef.current) {
        const elapsed = performance.now() * 0.001;
        const segment = Math.floor(elapsed / 2.2) % showcaseForms.length;
        const nextSegment = (segment + 1) % showcaseForms.length;
        const localProgress = (elapsed / 2.2) % 1;
        const easedMix = smoothstep(0, 1, localProgress);
        updateGeometry(geometry, showcaseForms[segment], showcaseForms[nextSegment], easedMix);
        if (showcaseIndexRef.current !== segment) {
          showcaseIndexRef.current = segment;
          showcaseLabelRef.current = showcaseForms[segment];
          setShowcaseForm(showcaseForms[segment]);
        }
      } else {
        morphProgressRef.current = clamp(morphProgressRef.current + 0.035, 0, 1);
        const easedMix = smoothstep(0, 1, morphProgressRef.current);
        updateGeometry(geometry, previousFormRef.current, selectedFormRef.current, easedMix);
      }
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
              onClick={() => {
                autoShowcaseRef.current = option.id === "heart";
                if (option.id !== "heart") setShowcaseForm(option.id);
                setSelectedForm(option.id);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="form-flow-description" aria-live="polite">
          <strong>{selectedForm === "heart" ? `Özgün akış: ${formLabels.get(showcaseForm)}` : selectedOption.label}</strong>
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
