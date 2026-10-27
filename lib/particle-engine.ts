// Particle Engine — RAWKC Portfolio
// High-performance Fibonacci sphere + depth-aware rendering + smooth inertia physics

export interface ParticleEngineOptions {
  canvas: HTMLCanvasElement;
  particleCount?: number;
  sphereRadius?: number;
  isMobile?: boolean;
}

interface Particle {
  // Base coordinates on sphere surface
  bx: number;
  by: number;
  bz: number;

  // Current screen/projected coordinates
  x: number;
  y: number;
  z: number;

  // Smooth displacement from mouse interaction
  dx: number;
  dy: number;

  // Intrinsic visual properties (fixed per particle, no per-frame jitter)
  baseSize: number;
  size: number;
  brightness: number; // 0–1
  opacity: number;
  cluster: boolean; // bright cluster particle
  phase: number; // turbulence phase offset
  speed: number; // turbulence speed multiplier
}

interface MouseState {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
  vx: number;
  vy: number;
  prevX: number;
  prevY: number;
  active: boolean;
}

interface Ripple {
  x: number;
  y: number;
  t: number;
}

// Fibonacci sphere distribution: evenly spaces points across 3D spherical surface
function fibonacciSphere(n: number, radius: number, noiseAmt: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden ratio angle (~2.3999 rad)
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; // -1 to 1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    const noise = 1 + (Math.random() - 0.5) * noiseAmt;
    const depth = radius * (0.86 + Math.random() * 0.28) * noise;
    pts.push([Math.cos(theta) * r * depth, y * depth, Math.sin(theta) * r * depth]);
  }
  return pts;
}

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private clusterParticles: Particle[] = [];
  private rafId: number | null = null;
  private lastTime: number = 0;
  private time: number = 0;
  private introProgress: number = 0; // 0 to 1 smooth fade-in
  private isMobile: boolean;
  private particleCount: number;
  private sphereRadius: number;

  private mouse: MouseState = {
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    vx: 0,
    vy: 0,
    prevX: 0,
    prevY: 0,
    active: false,
  };

  private rotX: number = 0;
  private rotY: number = 0;
  private targetRotX: number = 0;
  private targetRotY: number = 0;

  private resizeObserver: ResizeObserver | null = null;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseLeave: () => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundClick: (e: MouseEvent) => void;
  private boundVisibility: () => void;
  private clickRipples: Ripple[] = [];
  private hidden: boolean = false;

  constructor(options: ParticleEngineOptions) {
    this.canvas = options.canvas;
    this.ctx = options.canvas.getContext('2d', { alpha: false })!;
    this.isMobile = options.isMobile ?? false;
    // Balanced count for ultra-smooth 60-120fps performance
    this.particleCount = options.particleCount ?? (this.isMobile ? 1800 : 3800);
    this.sphereRadius = options.sphereRadius ?? 0;

    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundClick = this.onClick.bind(this);
    this.boundVisibility = this.onVisibilityChange.bind(this);

    this.init();
  }

  private init() {
    this.resize();
    this.buildParticles();
    this.attachEvents();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.offsetWidth || window.innerWidth;
    const h = this.canvas.offsetHeight || window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const minDim = Math.min(w, h);
    this.sphereRadius = minDim * (this.isMobile ? 0.35 : 0.37);

    if (this.mouse.smoothX === 0 && this.mouse.smoothY === 0) {
      this.mouse.smoothX = w / 2;
      this.mouse.smoothY = h / 2;
      this.mouse.x = w / 2;
      this.mouse.y = h / 2;
    }
  }

  private buildParticles() {
    this.particles = [];
    this.clusterParticles = [];
    const pts = fibonacciSphere(this.particleCount, this.sphereRadius, 0.20);

    for (let i = 0; i < pts.length; i++) {
      const [bx, by, bz] = pts[i];
      const depth = (bz + this.sphereRadius) / (2 * this.sphereRadius); // 0=back, 1=front
      const isCluster = Math.random() < 0.038;
      const baseSize = isCluster
        ? Math.random() * 1.4 + 1.1
        : Math.random() * 0.85 + 0.35;

      const p: Particle = {
        bx,
        by,
        bz,
        x: bx,
        y: by,
        z: bz,
        dx: 0,
        dy: 0,
        baseSize,
        size: baseSize,
        brightness: isCluster ? 0.85 + Math.random() * 0.15 : depth * 0.5 + Math.random() * 0.5,
        opacity: depth * 0.6 + 0.15 + Math.random() * 0.25,
        cluster: isCluster,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.65,
      };

      this.particles.push(p);
      if (isCluster) {
        this.clusterParticles.push(p);
      }
    }
  }

  private attachEvents() {
    window.addEventListener('mousemove', this.boundMouseMove, { passive: true });
    window.addEventListener('mouseleave', this.boundMouseLeave, { passive: true });
    window.addEventListener('touchmove', this.boundTouchMove, { passive: true });
    window.addEventListener('click', this.boundClick, { passive: true });
    document.addEventListener('visibilitychange', this.boundVisibility);

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.buildParticles();
    });
    this.resizeObserver.observe(this.canvas);
  }

  private onMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    this.mouse.vx = nx - this.mouse.prevX;
    this.mouse.vy = ny - this.mouse.prevY;
    this.mouse.prevX = nx;
    this.mouse.prevY = ny;
    this.mouse.x = nx;
    this.mouse.y = ny;
    this.mouse.active = true;
  }

  private onMouseLeave() {
    this.mouse.active = false;
  }

  private onTouchMove(e: TouchEvent) {
    if (e.touches.length < 1) return;
    const t = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const nx = t.clientX - rect.left;
    const ny = t.clientY - rect.top;

    this.mouse.vx = nx - this.mouse.prevX;
    this.mouse.vy = ny - this.mouse.prevY;
    this.mouse.prevX = nx;
    this.mouse.prevY = ny;
    this.mouse.x = nx;
    this.mouse.y = ny;
    this.mouse.active = true;
  }

  private onClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.clickRipples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: 0,
    });
    if (this.clickRipples.length > 3) this.clickRipples.shift();
  }

  private onVisibilityChange() {
    this.hidden = document.hidden;
    if (!this.hidden && !this.rafId) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  private loop(now: number) {
    if (this.hidden) {
      this.rafId = null;
      return;
    }
    this.rafId = requestAnimationFrame(this.loop.bind(this));

    // Calculate delta time clamped to [0.005s, 0.05s] for jitter-free animation
    const rawDt = (now - (this.lastTime || now)) / 1000;
    const dt = Math.max(0.005, Math.min(rawDt, 0.05));
    this.lastTime = now;
    const timeScale = dt * 60; // normalized to 60fps unit

    this.update(dt, timeScale);
    this.draw();
  }

  private update(dt: number, timeScale: number) {
    this.time += 0.004 * timeScale;
    if (this.introProgress < 1) {
      this.introProgress = Math.min(1, this.introProgress + 0.025 * timeScale);
    }

    const w = this.canvas.offsetWidth || window.innerWidth;
    const h = this.canvas.offsetHeight || window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    // Smooth mouse coordinates and velocity decay
    const mouseLerp = 1 - Math.pow(0.005, dt);
    this.mouse.smoothX += (this.mouse.x - this.mouse.smoothX) * mouseLerp;
    this.mouse.smoothY += (this.mouse.y - this.mouse.smoothY) * mouseLerp;

    const velDecay = Math.pow(0.90, timeScale);
    this.mouse.vx *= velDecay;
    this.mouse.vy *= velDecay;

    // Continuous celestial rotation
    this.targetRotY += 0.00065 * timeScale;

    // Subtle responsive tilt toward cursor
    if (this.mouse.active) {
      const nx = (this.mouse.smoothX - cx) / w;
      const ny = (this.mouse.smoothY - cy) / h;
      this.targetRotY += nx * 0.0018 * timeScale;
      this.targetRotX = ny * 0.22;
    } else {
      this.targetRotX = 0;
    }

    // Exponential smoothing for spherical rotation
    const rotLerp = 1 - Math.pow(0.06, dt);
    this.rotX += (this.targetRotX - this.rotX) * rotLerp;
    this.rotY += (this.targetRotY - this.rotY) * rotLerp;

    const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);

    // Mouse interaction parameters
    const mRadius = this.isMobile ? 130 : 190;
    const mRadiusSq = mRadius * mRadius;
    const mouseSpeed = Math.sqrt(this.mouse.vx * this.mouse.vx + this.mouse.vy * this.mouse.vy);
    const mForce = Math.min(mouseSpeed * 0.10, 6.0);

    const fov = 920;
    const dispDecay = Math.pow(0.91, timeScale);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Organic continuous turbulence
      const t = this.time * p.speed;
      const turbAmp = p.cluster ? 0.35 : 1.1;
      const nx = p.bx + Math.sin(t + p.phase) * turbAmp;
      const ny = p.by + Math.cos(t * 0.73 + p.phase) * turbAmp;
      const nz = p.bz + Math.sin(t * 0.53 + p.phase * 1.3) * turbAmp;

      // Rotate Y then X
      const rx = nx * cosY + nz * sinY;
      const ry = ny;
      const rz = -nx * sinY + nz * cosY;

      const fx = rx;
      const fy = ry * cosX - rz * sinX;
      const fz = ry * sinX + rz * cosX;

      // Perspective projection
      const scale = fov / (fov + fz + this.sphereRadius * 1.15);
      p.x = cx + fx * scale;
      p.y = cy + fy * scale;
      p.z = fz;

      // Mouse repulsion and gentle swirl
      if (this.mouse.active) {
        const distX = p.x - this.mouse.smoothX;
        const distY = p.y - this.mouse.smoothY;
        const distSq = distX * distX + distY * distY;

        if (distSq < mRadiusSq && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const influence = (1 - dist / mRadius);
          const depth = Math.max(0.2, (fz + this.sphereRadius * 1.2) / (this.sphereRadius * 2.4));
          const force = mForce * influence * depth;

          // Repulsion
          p.dx += (distX / dist) * force * 0.65;
          p.dy += (distY / dist) * force * 0.65;
          // Swirl
          p.dx += this.mouse.vx * influence * 0.06;
          p.dy += this.mouse.vy * influence * 0.06;
        }
      }

      // Smooth displacement decay
      p.dx *= dispDecay;
      p.dy *= dispDecay;
      p.x += p.dx;
      p.y += p.dy;

      // Depth-based sizing & subtle breathing wave (zero random flicker)
      const depthFactor = (fz + this.sphereRadius * 1.35) / (this.sphereRadius * 2.7);
      const sizeScale = 0.55 + depthFactor * 0.85;
      const breathe = 1 + 0.06 * Math.sin(this.time * 2 + p.phase);
      p.size = p.baseSize * sizeScale * breathe;
      p.opacity = Math.max(0.06, depthFactor * 0.55 + p.brightness * 0.35) * this.introProgress;
    }

    // Age click ripples
    for (let i = 0; i < this.clickRipples.length; i++) {
      this.clickRipples[i].t += 0.035 * timeScale;
    }
    this.clickRipples = this.clickRipples.filter(r => r.t < 1);
  }

  private draw() {
    const w = this.canvas.offsetWidth || window.innerWidth;
    const h = this.canvas.offsetHeight || window.innerHeight;
    const ctx = this.ctx;

    // Pure deep black background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    // ─── High Performance Batched Core Particle Layers ───────────────
    // Instead of 4000 individual fill calls, we sort particles into 4 depth buckets
    // and draw each bucket with a SINGLE path batch. This gives 60-120fps smoothness!
    const bucket0: Particle[] = []; // Deep background
    const bucket1: Particle[] = []; // Mid background
    const bucket2: Particle[] = []; // Mid foreground
    const bucket3: Particle[] = []; // Sharp foreground

    const threshold = this.sphereRadius * 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.z < -threshold) {
        bucket0.push(p);
      } else if (p.z < 0) {
        bucket1.push(p);
      } else if (p.z < threshold) {
        bucket2.push(p);
      } else {
        bucket3.push(p);
      }
    }

    // Render Deep Background (soft dim dots)
    ctx.beginPath();
    for (let i = 0; i < bucket0.length; i++) {
      const p = bucket0[i];
      ctx.moveTo(p.x + p.size, p.y);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fillStyle = `rgba(150, 165, 195, ${0.20 * this.introProgress})`;
    ctx.fill();

    // Render Mid Background
    ctx.beginPath();
    for (let i = 0; i < bucket1.length; i++) {
      const p = bucket1[i];
      ctx.moveTo(p.x + p.size, p.y);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fillStyle = `rgba(180, 195, 225, ${0.40 * this.introProgress})`;
    ctx.fill();

    // Render Mid Foreground
    ctx.beginPath();
    for (let i = 0; i < bucket2.length; i++) {
      const p = bucket2[i];
      ctx.moveTo(p.x + p.size, p.y);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fillStyle = `rgba(215, 228, 255, ${0.68 * this.introProgress})`;
    ctx.fill();

    // Render Sharp Foreground
    ctx.beginPath();
    for (let i = 0; i < bucket3.length; i++) {
      const p = bucket3[i];
      ctx.moveTo(p.x + p.size, p.y);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fillStyle = `rgba(245, 248, 255, ${0.92 * this.introProgress})`;
    ctx.fill();

    // ─── Cluster Particle Ambient Glows (Selective ~100 particles) ───
    for (let i = 0; i < this.clusterParticles.length; i++) {
      const p = this.clusterParticles[i];
      if (p.opacity < 0.2) continue;
      const glowR = p.size * 3.6;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
      grd.addColorStop(0, `rgba(215, 235, 255, ${p.opacity * 0.45})`);
      grd.addColorStop(0.5, `rgba(180, 210, 255, ${p.opacity * 0.12})`);
      grd.addColorStop(1, 'rgba(180, 210, 255, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    // ─── Batched Constellation Network Lines ──────────────────────────
    // Only connect foreground particles within screen radius, single stroke call!
    const connDist = this.isMobile ? 32 : 44;
    const connDistSq = connDist * connDist;
    const lineCandidates = bucket3; // Sharp foreground only for clean aesthetic
    const maxLines = this.isMobile ? 120 : 260;
    let lineCount = 0;

    ctx.beginPath();
    for (let i = 0; i < lineCandidates.length && lineCount < maxLines; i += 2) {
      const a = lineCandidates[i];
      for (let j = i + 1; j < lineCandidates.length && lineCount < maxLines; j += 2) {
        const b = lineCandidates[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < connDistSq) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          lineCount++;
        }
      }
    }
    if (lineCount > 0) {
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = `rgba(195, 215, 245, ${0.11 * this.introProgress})`;
      ctx.stroke();
    }

    // ─── Cursor Atmosphere Glow ───────────────────────────────────────
    if (this.mouse.active) {
      const glowRadius = this.isMobile ? 90 : 130;
      const grd = ctx.createRadialGradient(
        this.mouse.smoothX,
        this.mouse.smoothY,
        0,
        this.mouse.smoothX,
        this.mouse.smoothY,
        glowRadius
      );
      grd.addColorStop(0, 'rgba(198, 255, 77, 0.045)');
      grd.addColorStop(0.5, 'rgba(198, 255, 77, 0.012)');
      grd.addColorStop(1, 'rgba(198, 255, 77, 0)');

      ctx.beginPath();
      ctx.arc(this.mouse.smoothX, this.mouse.smoothY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    // ─── Click Ripples ────────────────────────────────────────────────
    for (let i = 0; i < this.clickRipples.length; i++) {
      const r = this.clickRipples[i];
      const maxR = 130;
      const currentR = r.t * maxR;
      const alpha = (1 - r.t) * 0.22 * this.introProgress;

      ctx.beginPath();
      ctx.arc(r.x, r.y, currentR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(198, 255, 77, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  public destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseleave', this.boundMouseLeave);
    window.removeEventListener('touchmove', this.boundTouchMove);
    window.removeEventListener('click', this.boundClick);
    document.removeEventListener('visibilitychange', this.boundVisibility);
    this.resizeObserver?.disconnect();
  }
}
