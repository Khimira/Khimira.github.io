import React, { useEffect, useRef } from 'react';

export function MatrixRain({ onExit }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops = new Array(columns).fill(1);

    const chars = 'アイウエオカキクケコサシスセソ0123456789ABCDEFXYZ$#@%&';

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }
    window.addEventListener('resize', handleResize);

    function handleScroll() {
      onExit?.();
    }
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    let frameId;
    function draw() {
      ctx.fillStyle = 'rgba(10, 14, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#4ade80';
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frameId = requestAnimationFrame(draw);
    }
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [onExit]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1500] bg-black"
      aria-label="Efeito visual Matrix — role a tela ou digite exit para sair"
    />
  );
}
