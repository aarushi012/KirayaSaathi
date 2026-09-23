import React, { useEffect, useRef } from 'react';

export default function NexusLiveBackground() {
  const shaderCanvasRef = useRef(null);
  const particlesCanvasRef = useRef(null);
  const depthLayerRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ================================================================
    // 1. WEBGL SHADER BACKGROUND (Direct from NEXUS index.js)
    // ================================================================
    let glAnimId = null;
    let cleanupShader = () => {};

    const shaderCanvas = shaderCanvasRef.current;
    if (shaderCanvas) {
      const gl = shaderCanvas.getContext('webgl');
      if (gl) {
        const vsSource = `
          attribute vec4 aPos;
          void main() { gl_Position = aPos; }
        `;

        const fsSource = `
          precision highp float;
          uniform vec2 iRes;     // Canvas resolution passed from JavaScript.
          uniform float iTime;   // Seconds elapsed, used to animate movement.
          const float overallSpeed = 0.2;       // Master speed multiplier.
          const float gridSmoothWidth = 0.015;  // Soft edge size for grid lines.
          const float axisWidth = 0.05;         // Reserved axis width value.
          const float majorLineWidth = 0.025;   // Reserved major grid line width.
          const float minorLineWidth = 0.0125;  // Reserved minor grid line width.
          const float majorLineFrequency = 5.0; // Reserved spacing for large lines.
          const float minorLineFrequency = 1.0; // Reserved spacing for small lines.
          const float scale = 5.0;              // Zoom level of the shader world.
          const vec4 lineColor = vec4(0.18, 0.83, 0.75, 1.0); // Teal RGBA line color.
          const float minLineWidth = 0.01;      // Thinnest animated plasma line.
          const float maxLineWidth = 0.2;       // Thickest animated plasma line.
          const float lineSpeed = 1.0 * overallSpeed; // How fast lines travel.
          const float lineAmplitude = 1.0;      // How tall the wave movement is.
          const float lineFrequency = 0.2;      // How often the wave changes.
          const float warpSpeed = 0.2 * overallSpeed; // Speed of background warping.
          const float warpFrequency = 0.5;      // Density of the warp pattern.
          const float warpAmplitude = 1.0;      // Strength of the warp distortion.
          const float offsetFrequency = 0.5;    // Horizontal offset variation.
          const float offsetSpeed = 1.33 * overallSpeed; // Speed of line offsets.
          const float minOffsetSpread = 0.6;    // Minimum distance between lines.
          const float maxOffsetSpread = 2.0;    // Maximum distance between lines.
          const int linesPerGroup = 12;         // Number of line groups drawn.

          #define drawSmoothLine(pos, hw, t) smoothstep(hw, 0.0, abs(pos - (t)))
          #define drawCrispLine(pos, hw, t) smoothstep(hw + gridSmoothWidth, hw, abs(pos - (t)))
          #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))
          #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))

          // Pseudo-random wave function.
          float random(float t) {
            return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
          }

          // Returns the animated Y position for one plasma line at a given X.
          float getPlasmaY(float x, float hFade, float offset) {
            return random(x * lineFrequency + iTime * lineSpeed) * hFade * lineAmplitude + offset;
          }

          // main() runs once for every pixel being drawn.
          void main() {
            vec2 uv = gl_FragCoord.xy / iRes.xy;
            vec2 space = (gl_FragCoord.xy - iRes.xy / 2.0) / iRes.x * 2.0 * scale;
            float hFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
            float vFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);
            space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + hFade);
            space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * hFade;
            vec4 lines = vec4(0.0);
            vec4 bg1 = vec4(0.008, 0.031, 0.09, 1.0);
            vec4 bg2 = vec4(0.02, 0.055, 0.12, 1.0);
            for (int l = 0; l < linesPerGroup; l++) {
              float nli = float(l) / float(linesPerGroup);
              float offTime = iTime * offsetSpeed;
              float offPos = float(l) + space.x * offsetFrequency;
              float rand = random(offPos + offTime) * 0.5 + 0.5;
              float hw = mix(minLineWidth, maxLineWidth, rand * hFade) / 2.0;
              float offset = random(offPos + offTime * (1.0 + nli)) * mix(minOffsetSpread, maxOffsetSpread, hFade);
              float lp = getPlasmaY(space.x, hFade, offset);
              float line = drawSmoothLine(lp, hw, space.y) / 2.0 + drawCrispLine(lp, hw * 0.15, space.y);
              float cx = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
              vec2 cp = vec2(cx, getPlasmaY(cx, hFade, offset));
              float circle = drawCircle(cp, 0.01, space) * 4.0;
              lines += (line + circle) * lineColor * rand;
            }
            vec4 col = mix(bg1, bg2, uv.x);
            col *= vFade;
            col.a = 1.0;
            col += lines;
            gl_FragColor = col;
          }
        `;

        function compileShader(type, src) {
          const shader = gl.createShader(type);
          gl.shaderSource(shader, src);
          gl.compileShader(shader);
          return shader;
        }

        const prog = gl.createProgram();
        gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
        gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(prog, 'aPos');
        const resLoc = gl.getUniformLocation(prog, 'iRes');
        const timeLoc = gl.getUniformLocation(prog, 'iTime');

        function resizeShader() {
          if (!shaderCanvas) return;
          shaderCanvas.width = window.innerWidth;
          shaderCanvas.height = window.innerHeight;
          gl.viewport(0, 0, shaderCanvas.width, shaderCanvas.height);
        }

        window.addEventListener('resize', resizeShader);
        resizeShader();

        const start = Date.now();

        function renderShader() {
          const t = (Date.now() - start) / 1000;
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(prog);
          gl.uniform2f(resLoc, shaderCanvas.width, shaderCanvas.height);
          gl.uniform1f(timeLoc, prefersReducedMotion ? 0.0 : t);

          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(posLoc);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          if (!prefersReducedMotion) {
            glAnimId = requestAnimationFrame(renderShader);
          }
        }

        glAnimId = requestAnimationFrame(renderShader);

        cleanupShader = () => {
          window.removeEventListener('resize', resizeShader);
          if (glAnimId) cancelAnimationFrame(glAnimId);
        };
      }
    }

    // ================================================================
    // 2. SPARKLES PARTICLES (Direct from NEXUS index.js)
    // ================================================================
    let particleAnimId = null;
    let cleanupParticles = () => {};

    const particlesCanvas = particlesCanvasRef.current;
    if (particlesCanvas) {
      const ctx = particlesCanvas.getContext('2d');
      if (ctx) {
        let particles = [];
        const isMobile = window.innerWidth < 768;
        const COUNT = isMobile ? 80 : 120;

        function resizeParticles() {
          if (!particlesCanvas) return;
          particlesCanvas.width = window.innerWidth;
          particlesCanvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeParticles);
        resizeParticles();

        class Particle {
          constructor() { this.reset(true); }

          reset(init = false) {
            this.x = Math.random() * particlesCanvas.width;
            this.y = init ? Math.random() * particlesCanvas.height : particlesCanvas.height + 10;
            this.size = Math.random() * 2 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = -(Math.random() * 0.6 + 0.2);
            this.opacity = Math.random();
            this.opacityDir = Math.random() > 0.5 ? 0.01 : -0.01;
            this.opacitySpeed = Math.random() * 0.015 + 0.004;
          }

          update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.opacityDir * this.opacitySpeed * 4;

            if (this.opacity >= 1) { this.opacity = 1; this.opacityDir = -1; }
            if (this.opacity <= 0) { this.opacity = 0; this.opacityDir = 1; }

            if (this.y < -10) this.reset();
          }

          draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity * 0.7;
            ctx.fillStyle = '#2DD4BF';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#2DD4BF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        function animateParticles() {
          ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
          particles.forEach(p => { p.update(); p.draw(); });
          if (!prefersReducedMotion) {
            particleAnimId = requestAnimationFrame(animateParticles);
          }
        }

        if (!prefersReducedMotion) {
          particleAnimId = requestAnimationFrame(animateParticles);
        } else {
          particles.forEach(p => p.draw());
        }

        // Click to burst: exactly from NEXUS
        const handleClick = (e) => {
          if (prefersReducedMotion) return;
          for (let i = 0; i < 8; i++) {
            const p = new Particle();
            p.x = e.clientX + (Math.random() - 0.5) * 40;
            p.y = e.clientY + (Math.random() - 0.5) * 40;
            p.speedY = -(Math.random() * 2 + 1);
            p.speedX = (Math.random() - 0.5) * 2;
            p.opacity = 1;
            particles.push(p);
            if (particles.length > COUNT + 50) particles.shift();
          }
        };

        document.addEventListener('click', handleClick);

        cleanupParticles = () => {
          window.removeEventListener('resize', resizeParticles);
          document.removeEventListener('click', handleClick);
          if (particleAnimId) cancelAnimationFrame(particleAnimId);
        };
      }
    }

    // ================================================================
    // 3. 3D AMBIENT DEPTH SYSTEM (Parallax on Mouse Move)
    // ================================================================
    let mouseAnimId = null;
    const handleMouseMove = (e) => {
      if (prefersReducedMotion || !depthLayerRef.current || window.innerWidth < 768) return;
      cancelAnimationFrame(mouseAnimId);
      mouseAnimId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        if (depthLayerRef.current) {
          depthLayerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cleanupShader();
      cleanupParticles();
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseAnimId) cancelAnimationFrame(mouseAnimId);
    };
  }, []);

  return (
    <>
      {/* 1. WebGL Plasma Lines Shader Layer */}
      <canvas
        id="shader-canvas"
        ref={shaderCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Sparkles Particle Layer */}
      <canvas
        id="particles-canvas"
        ref={particlesCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* 3. 3D Floating Geometry & Ambient Depth Accents */}
      <div 
        ref={depthLayerRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[1] transition-transform duration-700 ease-out"
      >
        {/* Floating 3D Geometric Ring (Top Right) */}
        <div className="absolute top-[8%] right-[6%] w-72 h-72 rounded-full border border-indigo-500/10 [transform:rotateX(60deg)_rotateZ(25deg)] opacity-40 animate-pulseSlow" />
        <div className="absolute top-[8%] right-[6%] w-56 h-56 rounded-full border border-cyan-500/10 [transform:rotateX(60deg)_rotateZ(45deg)] opacity-30" />

        {/* Floating 3D Geometric Ring (Bottom Left) */}
        <div className="absolute bottom-[12%] left-[4%] w-80 h-80 rounded-full border border-cyan-500/10 [transform:rotateX(55deg)_rotateZ(-30deg)] opacity-35" />

        {/* Ambient Depth Light Refraction Nodes */}
        <div className="absolute top-[20%] left-[15%] w-96 h-96 bg-indigo-600/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-[25%] right-[10%] w-[450px] h-[450px] bg-cyan-600/5 rounded-full blur-[160px]" />
      </div>
    </>
  );
}
