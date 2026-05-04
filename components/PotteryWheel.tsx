"use client";

import { useEffect, useRef, useState } from "react";

export default function PotteryWheel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const spinningRef = useRef(true);

  const [isSpinning, setIsSpinning] = useState(true);

  const toggleSpinning = () => {
    setIsSpinning((prev) => {
      const next = !prev;
      spinningRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    spinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawEllipse = (
      x: number,
      y: number,
      radiusX: number,
      radiusY: number,
      fillStyle: CanvasRenderingContext2D["fillStyle"],
      strokeStyle?: string,
      lineWidth = 1
    ) => {
      ctx.beginPath();
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = fillStyle;
      ctx.fill();

      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    const drawPotBody = (
      centerX: number,
      centerY: number,
      potHeight: number,
      potWidth: number,
      rotation: number
    ) => {
      const slices = 48;
      const segments = 24;

      for (let i = 0; i < slices; i++) {
        const angle = (i / slices) * Math.PI * 2 + rotation;
        const nextAngle = ((i + 1) / slices) * Math.PI * 2 + rotation;

        const cosA = Math.cos(angle);
        const cosB = Math.cos(nextAngle);

        const light = (cosA + 1) / 2;

        const red = Math.round(210 - light * 28);
        const green = Math.round(178 - light * 22);
        const blue = Math.round(145 - light * 18);

        ctx.beginPath();

        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const y = centerY + potHeight * (t - 0.5);

          const shoulder = Math.sin(t * Math.PI) * 0.18;
          const taper = 0.35 + 0.55 * Math.pow(t, 0.65);
          const lip = t < 0.12 ? 0.14 * (1 - t / 0.12) : 0;
          const foot = t > 0.82 ? -0.12 * ((t - 0.82) / 0.18) : 0;

          const profile = Math.max(0.25, taper + shoulder + lip + foot);
          const x = centerX + potWidth * profile * cosA;

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        for (let j = segments; j >= 0; j--) {
          const t = j / segments;
          const y = centerY + potHeight * (t - 0.5);

          const shoulder = Math.sin(t * Math.PI) * 0.18;
          const taper = 0.35 + 0.55 * Math.pow(t, 0.65);
          const lip = t < 0.12 ? 0.14 * (1 - t / 0.12) : 0;
          const foot = t > 0.82 ? -0.12 * ((t - 0.82) / 0.18) : 0;

          const profile = Math.max(0.25, taper + shoulder + lip + foot);
          const x = centerX + potWidth * profile * cosB;

          ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fill();

        ctx.strokeStyle = "rgba(120, 86, 55, 0.12)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    };

    const drawWheel = (
      centerX: number,
      centerY: number,
      baseRadius: number,
      rotation: number
    ) => {
      const wheelY = centerY + baseRadius * 0.88;

      const gradient = ctx.createRadialGradient(
        centerX,
        wheelY - baseRadius * 0.04,
        0,
        centerX,
        wheelY,
        baseRadius * 0.48
      );

      gradient.addColorStop(0, "#9a8061");
      gradient.addColorStop(0.55, "#7c674d");
      gradient.addColorStop(1, "#5b4b3b");

      drawEllipse(
        centerX,
        wheelY,
        baseRadius * 0.48,
        baseRadius * 0.14,
        gradient,
        "rgba(60, 45, 32, 0.35)",
        1.5
      );

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          wheelY,
          baseRadius * (0.4 - i * 0.07),
          baseRadius * (0.11 - i * 0.018),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(235, 215, 190, ${0.22 - i * 0.035})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < 10; i++) {
        const angle = rotation * 1.8 + (i / 10) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * baseRadius * 0.12;
        const y1 = wheelY + Math.sin(angle) * baseRadius * 0.035;
        const x2 = centerX + Math.cos(angle) * baseRadius * 0.42;
        const y2 = wheelY + Math.sin(angle) * baseRadius * 0.11;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(255, 240, 220, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const drawSlipDrops = (
      centerX: number,
      centerY: number,
      potWidth: number,
      time: number
    ) => {
      for (let i = 0; i < 6; i++) {
        const angle = i * 1.15 + time * 0.0012;
        const x = centerX + Math.cos(angle) * potWidth * 0.55;
        const y = centerY - potWidth * 0.1 + Math.sin(time * 0.002 + i) * 12;
        const radius = 2.4 + Math.sin(time * 0.003 + i) * 0.9;

        drawEllipse(
          x,
          y,
          radius,
          radius * 1.15,
          "rgba(215, 230, 235, 0.55)"
        );
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.38;

      const potHeight = baseRadius * 1.08;
      const potWidth = baseRadius * 0.58;

      rotationRef.current += spinningRef.current ? 0.026 : 0.004;
      const rotation = rotationRef.current;

      const backgroundGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 1.8
      );

      backgroundGradient.addColorStop(0, "rgba(216, 199, 172, 0.34)");
      backgroundGradient.addColorStop(0.55, "rgba(235, 224, 207, 0.18)");
      backgroundGradient.addColorStop(1, "rgba(250, 247, 242, 0)");

      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, width, height);

      drawWheel(centerX, centerY, baseRadius, rotation);
      drawPotBody(centerX, centerY, potHeight, potWidth, rotation);

      drawEllipse(
        centerX,
        centerY - potHeight * 0.5,
        potWidth * 0.86,
        potWidth * 0.25,
        "rgba(232, 211, 185, 0.9)",
        "rgba(176, 130, 92, 0.55)",
        2
      );

      drawEllipse(
        centerX,
        centerY - potHeight * 0.49,
        potWidth * 0.62,
        potWidth * 0.16,
        "rgba(126, 88, 58, 0.26)"
      );

      drawEllipse(
        centerX,
        centerY - potHeight * 0.53,
        potWidth * 0.72,
        potWidth * 0.09,
        "rgba(255, 245, 225, 0.18)"
      );

      drawSlipDrops(centerX, centerY, potWidth, time);

      ctx.font = "12px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(75, 55, 40, 0.45)";
      ctx.fillText(
        spinningRef.current ? "Çark dönüyor" : "Çark durdu",
        centerX,
        height - 18
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={toggleSpinning}
        aria-label="Seramik çarkı animasyonu"
        role="img"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: 500,
          cursor: "pointer",
          display: "block",
        }}
      />

      <button
        type="button"
        onClick={toggleSpinning}
        style={{
          position: "absolute",
          left: "50%",
          bottom: 16,
          transform: "translateX(-50%)",
          border: "1px solid rgba(210, 190, 170, 0.9)",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.86)",
          color: "#4f3a2d",
          padding: "10px 16px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 10px 28px rgba(80, 55, 35, 0.16)",
          backdropFilter: "blur(10px)",
        }}
      >
        {isSpinning ? "⏸ Durdur" : "▶ Çevir"}
      </button>
    </div>
  );
}
