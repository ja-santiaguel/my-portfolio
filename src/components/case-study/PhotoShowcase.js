"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CaseStudy.module.css";

// The pinned photographic showcase (2026-10-19, replacing General Roofing's
// 3D laptop): a thematic mockup photo, full width, that plays through a
// camera move as you scroll. The section is tall and its stage sticks;
// native scroll drives it (keyboard, scrollbar and reverse scrolling all
// keep working), then the stage releases.
//
//   1. Depth push-in: the photo is drawn by a small WebGL shader with a depth
//      map drawn from the scene's geometry (wall far, plinth near, laptop in
//      between), so nearer surfaces grow faster than the wall as the camera
//      moves towards the screen: a real camera move, not a flat zoom.
//   2. The real screen: the homepage capture sits on the laptop's screen,
//      warped to the photo's perspective (a CSS matrix3d from the screen's
//      four corners), and scrolls top to bottom; it follows the laptop's
//      depth exactly, so it stays glued to the screen.
//
//   `screen` is optional: without it (Aether) the photo's own screen stays
//   and only the camera moves. `start` frames a centred subject off-centre
//   at first ({ zoom, at }: a slight zoom, the focus shown at `at`), so the
//   push-in also pans, like the off-centre laptops.
//
// Phones, small windows and reduced motion get the still photo.

const VERT = `#version 300 es
in vec2 p;
out vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

// Output pixel -> image pixel: zoom about the focus by a factor that grows
// with depth (two passes, so the depth is read where the pixel comes from).
const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uImg;
uniform sampler2D uDepth;
uniform vec2 uCover;
uniform vec2 uFocus;
uniform vec2 uTarget;
uniform float uZoom;
uniform float uDepthZoom;
vec2 source(vec2 uv, float d) {
  return uFocus + (uv - uTarget) / (1.0 + uZoom + uDepthZoom * d);
}
void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  uv = 0.5 + (uv - 0.5) * uCover;
  float d = texture(uDepth, source(uv, 0.3)).r;
  d = texture(uDepth, source(uv, d)).r;
  o = texture(uImg, source(uv, d));
}`;

const DRIFT = [0.64, 0.5]; // default: the screen centre travels towards the middle-right
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// 3x3 homography taking the 4 src points to the 4 dst points.
function homography(src, dst) {
  const A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      B[r] -= f * B[c];
    }
  }
  return B.map((b, i) => b / A[i][i]);
}

const matrix3d = (h) =>
  `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;

export default function PhotoShowcase({ scene }) {
  const { image, depth, screen, focus, corners, label, drift = DRIFT, start, zoom = 0.18 } = scene;
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const screenRef = useRef(null);
  const pageRefs = useRef([]); // the full capture, then its pre-shrunk levels
  const [mode, setMode] = useState("pending"); // pending | motion | still

  useEffect(() => {
    const big = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(big.matches && !reduce.matches ? "motion" : "still");
    decide();
    big.addEventListener("change", decide);
    reduce.addEventListener("change", decide);
    return () => {
      big.removeEventListener("change", decide);
      reduce.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (mode !== "motion") return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setMode("still");
      return;
    }

    // Camera: zoom 0 -> ZOOM (+ depth), the focus (screen centre) drifting
    // slightly towards the middle of the frame. The screen's box matches the
    // aspect the photo's screen was composited at, so the first frame lines
    // up with the baked one.
    // zoom: how far the push-in goes (per scene; 0.18 by default).
    const ZOOM = zoom, DEPTH_ZOOM = 0.12, LID = 0.38;
    const START_ZOOM = start ? start.zoom : 0;
    const q = (corners || [[0, 0], [1, 0], [1, 1], [0, 1]]).map(([x, y]) => [x / image.width, y / image.height]);
    const [tl, tr, br, bl] = corners || [[0, 0], [1, 0], [1, 1], [0, 1]]; // image px, as the compositor measured them
    const quadW = (Math.hypot(tr[0] - tl[0], tr[1] - tl[1]) + Math.hypot(br[0] - bl[0], br[1] - bl[1])) / 2;
    const quadH = (Math.hypot(bl[0] - tl[0], bl[1] - tl[1]) + Math.hypot(br[0] - tr[0], br[1] - tr[1])) / 2;
    const boxW = screen ? screen.width : 0;
    // The box takes the aspect the photo's screen was composited at.
    const boxH = screen ? Math.round((boxW * quadH) / quadW) : 0;
    const fx = focus[0] / image.width, fy = focus[1] / image.height;

    // A mipmap chain for the screen (2026-10-21): the GPU shrinks a warped
    // image without filtering, so a 2880px capture drawn 500-1000px wide came
    // out jagged. The box shows whichever pre-shrunk level (largest first) is
    // closest to the screen's size on screen, at its natural size, so the warp
    // never shrinks it by more than ~1.5x. A level loads the first time it's
    // needed; the current one stays up until the next has decoded.
    const levels = screen
      ? pageRefs.current.map((el, i) => {
          const w = i === 0 ? screen.width : screen.levels[i - 1];
          return { el, w, h: Math.round((screen.height * w) / screen.width), state: "idle" };
        })
      : [];
    let level = -1;
    const showLevel = (i) => {
      const l = levels[i];
      levels.forEach((o, k) => (o.el.style.visibility = k === i ? "visible" : "hidden"));
      screenRef.current.style.width = `${(boxW * l.w) / screen.width}px`;
      screenRef.current.style.height = `${(boxH * l.w) / screen.width}px`;
      level = i;
    };
    const wantLevel = (i) => {
      const l = levels[i];
      if (l.state === "ready") return showLevel(i);
      if (l.state === "idle") {
        l.state = "loading";
        l.el.src = l.el.dataset.src;
        l.el.decode().then(() => {
          l.state = "ready";
          if (alive && ready) draw(current);
        }, () => (l.state = "idle"));
      }
    };
    const pickLevel = (px) => {
      // The smallest level at least as wide as the screen is drawn; going
      // down a level only once it's 15% clear, so it doesn't flicker at a
      // boundary.
      let i = 0;
      while (i + 1 < levels.length && levels[i + 1].w >= px) i++;
      if (level >= 0 && i > level && levels[i].w < px * 1.15) i = level;
      return i;
    };

    // GL setup.
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setMode("still");
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(prog, n);
    const uCover = u("uCover"), uFocus = u("uFocus"), uTarget = u("uTarget"), uZoom = u("uZoom"), uDepthZoom = u("uDepthZoom");
    gl.uniform1i(u("uImg"), 0);
    gl.uniform1i(u("uDepth"), 1);
    gl.uniform2f(uFocus, fx, fy);
    gl.uniform1f(uDepthZoom, DEPTH_ZOOM);

    const texture = (unit, src) =>
      new Promise((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          const t = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, t);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          resolve();
        };
        img.src = src;
      });

    let cover = [1, 1], W = 0, H = 0, ready = false, alive = true;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const va = W / H, ia = image.width / image.height;
      cover = va > ia ? [1, ia / va] : [va / ia, 1];
      gl.uniform2f(uCover, cover[0], cover[1]);
    };

    // Scroll -> progress over the section's whole pass through the screen
    // (2026-10-19): from its top entering at the bottom to its bottom leaving
    // at the top, not just the pinned part. The camera winds up as the photo
    // scrolls in, before it pins, and winds down as it scrolls away after
    // release, so there is no hard start or stop at either edge; the page on
    // the screen scrolls only while pinned. [pinFrom, pinTo] is the pinned
    // stretch within the pass. Followed with inertia (see tick).
    let target = 0, current = 0, frame = 0, pinFrom = 0.25, pinTo = 0.75;
    const measure = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      const pass = r.height + vh;
      pinFrom = vh / pass;
      pinTo = (vh + travel) / pass;
      target = clamp01((vh - r.top) / pass);
    };
    const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

    const draw = (p) => {
      const pz = smoother(p); // the push-in, soft at both ends of the pass
      const pin = clamp01((p - pinFrom) / (pinTo - pinFrom));
      const ps = ease(clamp01((pin - 0.08) / 0.84)); // the screen scroll
      // drift: where the screen centre travels to in the frame (image uv),
      // chosen per scene so the photo never runs out at an edge.
      const sx = start ? start.at[0] : fx, sy = start ? start.at[1] : fy;
      const tx = sx + (drift[0] - sx) * pz, ty = sy + (drift[1] - sy) * pz;
      gl.uniform2f(uTarget, tx, ty);
      gl.uniform1f(uZoom, START_ZOOM + ZOOM * pz);
      // The depth term grows with the push-in too.
      gl.uniform1f(uDepthZoom, DEPTH_ZOOM * pz);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!screen) return;
      // The screen, moved exactly like the laptop lid.
      const s = 1 + START_ZOOM + ZOOM * pz + DEPTH_ZOOM * pz * LID;
      const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
      const dst = q.map(([x, y]) => {
        // Outside the measured corners (they sit just inside the bezel), so
        // the baked screen underneath never shows at an edge:
        // 1.2% past them (2026-10-20): at full zoom a hair of the baked screen
        // showed along the bezel; the live page now overlaps it all round.
        const ix = cx + (x - cx) * 1.012, iy = cy + (y - cy) * 1.012;
        const zx = tx + (ix - fx) * s, zy = ty + (iy - fy) * s;
        return [((zx - 0.5) / cover[0] + 0.5) * W, ((zy - 0.5) / cover[1] + 0.5) * H];
      });
      // The screen's widest edge on screen, in device pixels.
      const px = Math.max(Math.hypot(dst[1][0] - dst[0][0], dst[1][1] - dst[0][1]), Math.hypot(dst[2][0] - dst[3][0], dst[2][1] - dst[3][1])) * (window.devicePixelRatio || 1);
      const want = pickLevel(px);
      if (want !== level) wantLevel(want);
      if (level < 0) return;
      const l = levels[level], k = l.w / screen.width, bw = boxW * k, bh = boxH * k;
      screenRef.current.style.transform = matrix3d(homography([[0, 0], [bw, 0], [bw, bh], [0, bh]], dst));
      l.el.style.transform = `translateY(${-ps * (l.h - bh)}px)`;
    };

    // Inertia (2026-10-19, "a little too stiff"): an exponential follow with
    // a time constant, so it glides behind the scroll and settles softly the
    // same on 60 and 120 Hz screens. TAU 0.32 s (was about 0.11 s).
    const TAU = 0.32;
    let last = 0;
    const tick = (now) => {
      frame = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      current += (target - current) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(target - current) < 0.0002) current = target;
      if (ready) draw(current);
      if (current !== target) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      resize();
      wake();
      if (ready) draw(current);
    };

    resize();
    measure();
    current = target;
    Promise.all([texture(0, image.src), texture(1, depth)]).then(() => {
      if (!alive) return;
      ready = true;
      draw(current);
      section.dataset.ready = "";
    });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, image, depth, screen, focus, corners, drift, start, zoom]);

  if (mode === "still") {
    return (
      <figure className={styles.photoShowcaseStill}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="100vw" className={styles.photo} />
      </figure>
    );
  }

  return (
    <section ref={sectionRef} className={styles.photoShowcase} aria-label={label}>
      <div className={styles.photoStage} role="img" aria-label={label}>
        {/* The still sits under the canvas until the textures are ready. */}
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="100vw"
          className={styles.photoStageStill}
          aria-hidden="true"
          style={
            start
              ? {
                  transformOrigin: `${(focus[0] / image.width) * 100}% ${(focus[1] / image.height) * 100}%`,
                  transform: `translate(${(start.at[0] - focus[0] / image.width) * 100}%, ${(start.at[1] - focus[1] / image.height) * 100}%) scale(${1 + start.zoom})`,
                }
              : undefined
          }
        />
        <canvas ref={canvasRef} className={styles.photoCanvas} />
        {screen && (
          <div ref={screenRef} className={styles.photoScreen} aria-hidden="true">
            {[screen.width, ...(screen.levels || [])].map((w, i) => {
              const src = i === 0 ? screen.src : screen.src.replace(/\.webp$/, `-w${w}.webp`);
              return (
                // eslint-disable-next-line @next/next/no-img-element -- warped by matrix3d, needs its natural size
                <img
                  key={w}
                  ref={(el) => (pageRefs.current[i] = el)}
                  data-src={src}
                  width={w}
                  height={Math.round((screen.height * w) / screen.width)}
                  alt=""
                  className={styles.photoPage}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
