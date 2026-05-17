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
    description: "Dolgun gövdeli, hafif toparlanan ağızlı küçük kap profili.",
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
    description: "Geniş omuzlu, dengeli boyunlu ve hafif açık ağızlı vazo profili.",
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
const heartMaxAbsX = 16;
const heartMaxAbsZ = 17;

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

function baseRadiusForForm(form: FormId, t: number, theta: number) {
  const topBand = smoothstep(0.68, 1, t);
  const bowlBase = 0.5;
  const bowlCurve = 0.42;
  const bowlBody = bowlBase + bowlCurve * Math.pow(t, 1.55);

  if (form === "bowl" || form === "heart") return bowlBody;
  if (form === "cup") {
    const cupCore = 0.56 + 0.3 * Math.pow(t, 1.35);
    const cupNeckPull = 0.1 * smoothstep(0.45, 0.88, t);
    const cupLipOpen = 0.05 * smoothstep(0.86, 1, t);
    return cupCore - cupNeckPull + cupLipOpen;
  }
  if (form === "star") {
    const starWave = Math.cos(theta * 5);
    return bowlBody * clamp(1 + topBand * 0.16 * starWave, 0.82, 1.2);
  }
  if (form === "flower") {
    const wave = Math.sin(theta * 6) * 0.7 + Math.sin(theta * 12) * 0.15;
    return bowlBody * clamp(1 + topBand * 0.12 * wave, 0.86, 1.16);
  }
  if (form === "vase") {
    const altRadius = 0.52;
    const bodyBulge = 0.34 * Math.exp(-Math.pow((t - 0.48) / 0.23, 2));
    const neckPull = 0.13 * Math.exp(-Math.pow((t - 0.82) / 0.12, 2));
    const lipOpen = 0.09 * smoothstep(0.9, 1, t);
    return altRadius + bodyBulge - neckPull + lipOpen;
  }

  return bowlBody;
}

function heightScaleForForm(form: FormId) {
  return form === "cup" ? 0.9 : 1;
}

function heartRimPoint(theta: number, radius: number) {
  const u = theta;
  const hx = 16 * Math.sin(u) ** 3;
  const hz = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
  const heartX = (hx / heartMaxAbsX) * radius * 1.04;
  const heartZ = (hz / heartMaxAbsZ) * radius * 1.02 - radius * 0.02;

  return { x: heartX, z: heartZ };
}

function pointForForm(form: FormId, t: number, theta: number) {
  const radius = baseRadiusForForm(form, t, theta);
  const circleX = Math.cos(theta) * radius;
  const circleZ = Math.sin(theta) * radius;
  const topBand = smoothstep(0.68, 1, t);

  if (form !== "heart") {
    return { x: circleX, z: circleZ, yLift: 0 };
  }

  const heart = heartRimPoint(theta, radius);
  const heartStrength = 0.92;
  const mix = topBand * heartStrength;
  const wrapped = Math.atan2(Math.sin(theta), Math.cos(theta));
  const notchLift = Math.exp(-wrapped * wrapped * 18) * -0.06;
  const lobeLift = Math.pow(Math.abs(Math.sin(theta)), 1.6) * 0.035;

  return {
    x: THREE.MathUtils.lerp(circleX, heart.x, mix),
    z: THREE.MathUtils.lerp(circleZ, heart.z, mix),
    yLift: topBand * (lobeLift + notchLift),
  };
}

function updateGeometry(geometry: THREE.BufferGeometry, fromForm: FormId, toForm: FormId, mix: number) {
  const radialSegments = 56;
  const heightSegments = 48;
  const row = radialSegments + 1;
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const t = yIndex / heightSegments;
    const baseY = t * 1.32 - 0.66;

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const theta = (xIndex / radialSegments) * Math.PI * 2;
      const throwLine = Math.sin(t * 34 + theta * 1.2) * 0.006;
      const fromPoint = pointForForm(fromForm, t, theta);
      const toPoint = pointForForm(toForm, t, theta);
      const yScale = THREE.MathUtils.lerp(heightScaleForForm(fromForm), heightScaleForForm(toForm), mix);
      const y = baseY * yScale;
      const x = THREE.MathUtils.lerp(fromPoint.x, toPoint.x, mix);
      const z = THREE.MathUtils.lerp(fromPoint.z, toPoint.z, mix);
      const length = Math.hypot(x, z);
      const lineScale = length > 0 ? (length + throwLine) / length : 1;
      const yLift = THREE.MathUtils.lerp(fromPoint.yLift, toPoint.yLift, mix);

      position.setXYZ(yIndex * row + xIndex, x * lineScale, y + yLift, z * lineScale);
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
  const showcaseStartRef = useRef(0);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    autoShowcaseRef.current = selectedForm === "heart";
    if (selectedForm === "heart") {
      showcaseStartRef.current = performance.now() * 0.001;
      showcaseIndexRef.current = 0;
    }
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
    scene.background = new THREE.Color("#ead7c1");

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
    camera.position.set(3.6, 2.4, 4.2);
    camera.lookAt(0, 0.45, 0);

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
    const material = new THREE.MeshStandardMaterial({
      color: "#f8f1e8",
      roughness: 0.38,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
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
        const elapsed = performance.now() * 0.001 - showcaseStartRef.current;
        const segmentDuration = 2.8;
        const segment = Math.floor(elapsed / segmentDuration) % showcaseForms.length;
        const nextSegment = (segment + 1) % showcaseForms.length;
        const localProgress = (elapsed / segmentDuration) % 1;
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
                if (option.id === "heart") {
                  showcaseStartRef.current = performance.now() * 0.001;
                  showcaseIndexRef.current = 0;
                  setShowcaseForm(showcaseForms[0]);
                } else {
                  setShowcaseForm(option.id);
                }
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
