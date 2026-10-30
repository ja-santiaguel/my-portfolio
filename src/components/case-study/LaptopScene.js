"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, SoftShadows, useTexture } from "@react-three/drei";
import { TRIANGLE_LEFT, TRIANGLE_RIGHT } from "@/lib/glyphs";

// The 3D showcase: a laptop on a table in a family home, the live General
// Roofing homepage on its screen. Everything is driven by one number,
// `progress` (0..1, from the pinned section's scroll position), followed with
// a short damped lag so it glides like the rest of the site:
//
//   0.00-0.20  the lid opens; wide, high three-quarter view of the table
//   0.10-0.45  the camera glides round and in until the screen leads the view
//   0.45-0.92  the homepage scrolls in the browser window, top to bottom
//   0.92-1.00  hold, then the section releases
//
// The laptop is modelled here (no downloaded model), on the proportions of a
// 14" pro laptop (1 unit ≈ 98 mm): a unibody slab with rounded corners, a
// black keyboard well with a full Mac layout and legends, perforated speaker
// grilles, a glass trackpad, a hinge barrel, side ports, and a notched
// display showing a browser window. The screen is unlit so the site shows in
// its true colours. Light comes from one source, the window of a daylit-house
// HDRI (Poly Haven "Lebombo", CC0).

// Body
const W = 3.2;
const D = 2.2;
const H = 0.11;
const CORNER = 0.11; // plan-view corner radius
// Lid and display
const LID_H = 2.1;
const LID_T = 0.05;
const SCREEN_W = 3.07;
const SCREEN_H = 1.99;
const SCREEN_TOP = LID_H - 0.045; // thin top bezel; the notch sits in it
const CHROME_H = 0.17; // menu bar + browser toolbar
const MENU_H = 0.072; // also the notch height
const PAGE_H = SCREEN_H - CHROME_H;
const OPEN_DEG = 105;
// Keyboard (Mac layout, 14.5 key units wide)
const U = 0.188; // key pitch
const GAP = 0.025;
const KEY = U - GAP;
const FN_D = 0.09; // half-height function row
const KEY_H = 0.01;
const KB_W = 14.5 * U;
const KB_TOP = -D / 2 + 0.17;
const KB_D = FN_D + GAP + 5 * U - GAP;
const KEY_BASE = H + 0.004;
// Trackpad
const PAD_W = 1.28;
const PAD_D = 0.76;
const PAD_Z = KB_TOP + KB_D + 0.1 + PAD_D / 2;

const SCREEN_TEX = "/images/projects/general-roofing/screen-home.webp";
const TEX_W = 1440;
const TEX_H = 5140; // hero to Featured Projects (the capture ends before an empty map area)
const SITE_HOST = "generalroofing.ca";
const ENV_HDRI = "/hdri/lebombo_1k.hdr";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const range = (p, a, b) => clamp01((p - a) / (b - a));
// Smooth in/out for camera moves (critically-damped feel, no overshoot).
const ease = (t) => t * t * (3 - 2 * t);

const lidCentre = () => {
  const lean = THREE.MathUtils.degToRad(OPEN_DEG - 90);
  return new THREE.Vector3(0, H + Math.cos(lean) * (LID_H / 2), -D / 2 - Math.sin(lean) * (LID_H / 2));
};

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = w / 2 - r;
  const y = h / 2 - r;
  s.moveTo(x + r, -y);
  s.absarc(x, y, r, 0, Math.PI / 2);
  s.absarc(-x, y, r, Math.PI / 2, Math.PI);
  s.absarc(-x, -y, r, Math.PI, Math.PI * 1.5);
  s.absarc(x, -y, r, Math.PI * 1.5, Math.PI * 2);
  return s;
}

// A rounded slab lying flat: w (x) by d (z), h tall, bottom at y = 0.
function slab(w, d, h, r, bevel, curveSegments = 12) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bevel, d - 2 * bevel, Math.max(0.001, r - bevel)), {
    depth: Math.max(0.0001, h - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, bevel, 0);
  return g;
}

// The Mac layout, row by row: [legend, width in key units].
// Legend keys: c centre, t/b top/bottom pair, bl/br/tl/tr corners.
const pair = (t, b) => ({ t, b });
const ROWS = [
  [[{ bl: "esc" }, 1.5], ...Array.from({ length: 12 }, (_, i) => [{ c: `F${i + 1}`, small: true }, 1]), [{ touch: true }, 1]],
  [
    ...[["~", "`"], ["!", "1"], ["@", "2"], ["#", "3"], ["$", "4"], ["%", "5"], ["^", "6"], ["&", "7"], ["*", "8"], ["(", "9"], [")", "0"], ["_", "–"], ["+", "="]].map(([t, b]) => [pair(t, b), 1]),
    [{ br: "delete" }, 1.5],
  ],
  [[{ bl: "tab" }, 1.5], ..."QWERTYUIOP".split("").map((c) => [{ c }, 1]), [pair("{", "["), 1], [pair("}", "]"), 1], [pair("|", "\\"), 1]],
  [[{ bl: "caps lock" }, 1.75], ..."ASDFGHJKL".split("").map((c) => [{ c }, 1]), [pair(":", ";"), 1], [pair('"', "'"), 1], [{ br: "return" }, 1.75]],
  [[{ bl: "shift" }, 2.25], ..."ZXCVBNM".split("").map((c) => [{ c }, 1]), [pair("<", ","), 1], [pair(">", "."), 1], [pair("?", "/"), 1], [{ br: "shift" }, 2.25]],
  [
    [{ bl: "fn" }, 1],
    [{ tr: "⌃", bl: "control" }, 1],
    [{ tr: "⌥", bl: "option" }, 1],
    [{ tr: "⌘", bl: "command" }, 1.25],
    [{}, 5],
    [{ tl: "⌘", br: "command" }, 1.25],
    [{ tl: "⌥", br: "option" }, 1],
    [{ arrows: true }, 3],
  ],
];

// Every key as a rectangle on the deck (x, z centre; w, d size) plus its legend.
function layoutKeys() {
  const keys = [];
  const left = -KB_W / 2;
  ROWS.forEach((row, r) => {
    const rowTop = r === 0 ? KB_TOP : KB_TOP + FN_D + GAP + (r - 1) * U;
    const depth = r === 0 ? FN_D : KEY;
    let cum = 0;
    row.forEach(([legend, w]) => {
      const x0 = left + cum * U + GAP / 2;
      cum += w;
      if (legend.arrows) {
        // Inverted T: half-height left and right, up and down stacked.
        const half = (KEY - 0.008) / 2;
        const lower = rowTop + KEY - half / 2;
        const upper = rowTop + half / 2;
        keys.push({ x: x0 + KEY / 2, z: lower, w: KEY, d: half, legend: { c: TRIANGLE_LEFT, small: true } });
        keys.push({ x: x0 + U + KEY / 2, z: upper, w: KEY, d: half, legend: { c: "▲", small: true } });
        keys.push({ x: x0 + U + KEY / 2, z: lower, w: KEY, d: half, legend: { c: "▼", small: true } });
        keys.push({ x: x0 + 2 * U + KEY / 2, z: lower, w: KEY, d: half, legend: { c: TRIANGLE_RIGHT, small: true } });
        return;
      }
      const kw = w * U - GAP;
      keys.push({ x: x0 + kw / 2, z: rowTop + depth / 2, w: kw, d: depth, legend });
    });
  });
  return keys;
}

// Legends drawn once onto a transparent canvas laid over the key tops.
function legendTexture(keys) {
  const P = 1100; // pixels per unit
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(KB_W * P);
  canvas.height = Math.round(KB_D * P);
  const ctx = canvas.getContext("2d");
  const font = (size) => `500 ${Math.round(size * P)}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.fillStyle = "#e4e4e4";
  keys.forEach(({ x, z, w, d, legend: l }) => {
    const cx = (x + KB_W / 2) * P;
    const cy = (z - KB_TOP) * P;
    const hw = (w / 2) * P;
    const hd = (d / 2) * P;
    const inset = 0.017 * P;
    if (l.c) {
      ctx.font = font(l.small ? 0.024 : 0.04);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(l.c, cx, cy + 0.002 * P);
    }
    if (l.t) {
      ctx.font = font(0.03);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(l.t, cx, cy - 0.028 * P);
      ctx.fillText(l.b, cx, cy + 0.03 * P);
    }
    ctx.font = font(0.022);
    ctx.textBaseline = "alphabetic";
    if (l.bl) {
      ctx.textAlign = "left";
      ctx.fillText(l.bl, cx - hw + inset, cy + hd - inset);
    }
    if (l.br) {
      ctx.textAlign = "right";
      ctx.fillText(l.br, cx + hw - inset, cy + hd - inset);
    }
    ctx.font = font(0.03);
    ctx.textBaseline = "top";
    if (l.tl) {
      ctx.textAlign = "left";
      ctx.fillText(l.tl, cx - hw + inset, cy - hd + inset * 0.8);
    }
    if (l.tr) {
      ctx.textAlign = "right";
      ctx.fillText(l.tr, cx + hw - inset, cy - hd + inset * 0.8);
    }
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Perforated speaker grille: a staggered grid of fine holes.
function grilleTexture(w, d) {
  const P = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * P);
  canvas.height = Math.round(d * P);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  const pitch = 0.0115 * P;
  const r = 0.0034 * P;
  for (let row = 0, y = r * 1.5; y < canvas.height - r; row++, y += pitch * 0.866) {
    for (let x = r * 1.5 + (row % 2 ? pitch / 2 : 0); x < canvas.width - r; x += pitch) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Menu bar and browser toolbar above the page, drawn once.
function chromeTexture() {
  const cw = 3072;
  const ch = Math.round((cw * CHROME_H) / SCREEN_W);
  const menu = Math.round((ch * MENU_H) / CHROME_H);
  const pt = cw / 1512; // the display's logical width in points
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  const font = (size, weight = 500) => `${weight} ${Math.round(size * pt)}px -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`;
  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };

  // Menu bar
  ctx.fillStyle = "#e9e7e4";
  ctx.fillRect(0, 0, cw, menu);
  ctx.fillStyle = "#1d1d1f";
  ctx.textBaseline = "middle";
  ctx.font = font(13);
  let mx = 22 * pt;
  ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"].forEach((m) => {
    ctx.fillText(m, mx, menu / 2);
    mx += ctx.measureText(m).width + 20 * pt;
  });
  ctx.textAlign = "right";
  ctx.fillText("Thu 9:41 AM", cw - 18 * pt, menu / 2);
  // Battery and Wi-Fi
  const bx = cw - 120 * pt;
  ctx.strokeStyle = "#1d1d1f";
  ctx.lineWidth = 1.2 * pt;
  roundRect(bx, menu / 2 - 5.5 * pt, 22 * pt, 11 * pt, 3 * pt);
  ctx.stroke();
  roundRect(bx + 2 * pt, menu / 2 - 3.5 * pt, 15 * pt, 7 * pt, 1.5 * pt);
  ctx.fill();
  ctx.fillRect(bx + 23 * pt, menu / 2 - 2 * pt, 1.6 * pt, 4 * pt);
  ctx.lineWidth = 1.8 * pt;
  ctx.lineCap = "round";
  [9, 6, 3].forEach((r) => {
    ctx.beginPath();
    ctx.arc(bx - 20 * pt, menu / 2 + 5 * pt, r * pt, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  });

  // Browser toolbar
  const ty = menu;
  const th = ch - menu;
  const mid = ty + th / 2;
  ctx.fillStyle = "#f6f5f3";
  ctx.fillRect(0, ty, cw, th);
  ctx.fillStyle = "#d8d6d2";
  ctx.fillRect(0, ch - 1.5 * pt, cw, 1.5 * pt);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc((20 + i * 20) * pt, mid, 6 * pt, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = "#86868b";
  ctx.lineWidth = 1.8 * pt;
  roundRect(96 * pt, mid - 7 * pt, 20 * pt, 14 * pt, 3 * pt);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(103 * pt, mid - 7 * pt);
  ctx.lineTo(103 * pt, mid + 7 * pt);
  ctx.stroke();
  [[146, -1], [172, 1]].forEach(([x, dir]) => {
    ctx.beginPath();
    ctx.moveTo((x + 3 * dir) * pt, mid - 7 * pt);
    ctx.lineTo((x - 3 * dir) * pt, mid);
    ctx.lineTo((x + 3 * dir) * pt, mid + 7 * pt);
    ctx.stroke();
  });
  // Address field
  const aw = 560 * pt;
  const ax = (cw - aw) / 2;
  ctx.fillStyle = "#e7e5e2";
  roundRect(ax, mid - 15 * pt, aw, 30 * pt, 8 * pt);
  ctx.fill();
  ctx.font = font(13);
  ctx.textAlign = "center";
  ctx.fillStyle = "#1d1d1f";
  const textW = ctx.measureText(SITE_HOST).width;
  ctx.fillText(SITE_HOST, cw / 2 + 8 * pt, mid + 0.5 * pt);
  // Padlock
  const lx = cw / 2 - textW / 2 - 8 * pt;
  ctx.fillStyle = "#6e6e73";
  roundRect(lx - 4.5 * pt, mid - 1 * pt, 9 * pt, 7 * pt, 1.5 * pt);
  ctx.fill();
  ctx.strokeStyle = "#6e6e73";
  ctx.lineWidth = 1.4 * pt;
  ctx.beginPath();
  ctx.arc(lx, mid - 1 * pt, 3 * pt, Math.PI, 0);
  ctx.stroke();
  // Share, new tab, tab overview
  ctx.strokeStyle = "#86868b";
  ctx.lineWidth = 1.8 * pt;
  const rx = cw - 30 * pt;
  roundRect(rx - 8 * pt, mid - 6 * pt, 13 * pt, 13 * pt, 2.5 * pt);
  ctx.stroke();
  roundRect(rx - 4 * pt, mid - 10 * pt, 13 * pt, 13 * pt, 2.5 * pt);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx - 40 * pt, mid - 7 * pt);
  ctx.lineTo(rx - 40 * pt, mid + 7 * pt);
  ctx.moveTo(rx - 47 * pt, mid);
  ctx.lineTo(rx - 33 * pt, mid);
  ctx.stroke();
  roundRect(rx - 82 * pt, mid - 4 * pt, 14 * pt, 12 * pt, 2 * pt);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx - 75 * pt, mid + 2 * pt);
  ctx.lineTo(rx - 75 * pt, mid - 10 * pt);
  ctx.moveTo(rx - 79 * pt, mid - 6.5 * pt);
  ctx.lineTo(rx - 75 * pt, mid - 10 * pt);
  ctx.lineTo(rx - 71 * pt, mid - 6.5 * pt);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// A port opening on a side face: a dark rounded slot, w along the side, h tall.
function Port({ side, z, w, h, r }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(roundedRect(w, h, r), 8), [w, h, r]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={[side * (W / 2 + 0.0008), H / 2, z]} rotation={[0, side * (Math.PI / 2), 0]}>
      <meshStandardMaterial color="#0b0b0c" roughness={0.6} />
    </mesh>
  );
}

function Laptop({ progress }) {
  const lid = useRef();
  const page = useTexture(SCREEN_TEX);
  const gl = useThree((s) => s.gl);

  const parts = useMemo(() => {
    const keys = layoutKeys();
    const keyGeos = [];
    let touch = null;
    keys.forEach(({ x, z, w, d, legend }) => {
      const g = slab(w, d, KEY_H + 0.006, Math.min(0.016, d / 2 - 0.002), 0.003, 4);
      g.translate(x, KEY_BASE, z);
      if (legend.touch) touch = g;
      else keyGeos.push(g);
    });
    const keysGeo = mergeGeometries(keyGeos);
    keyGeos.forEach((g) => g.dispose());
    const grilleW = 0.15;
    return {
      body: slab(W, D, H, CORNER, 0.02),
      lid: (() => {
        const b = 0.012;
        const g = new THREE.ExtrudeGeometry(roundedRect(W - 2 * b, LID_H - 2 * b, CORNER - b), {
          depth: LID_T - 2 * b,
          bevelEnabled: true,
          bevelThickness: b,
          bevelSize: b,
          bevelSegments: 3,
          curveSegments: 12,
        });
        g.translate(0, LID_H / 2, -(LID_T - b));
        return g;
      })(),
      bezel: new THREE.ShapeGeometry(roundedRect(W - 0.03, LID_H - 0.03, CORNER - 0.015), 12),
      notch: (() => {
        // Rounded at the bottom corners only, flush with the top bezel.
        const nw = 0.32;
        const r = 0.024;
        const s = new THREE.Shape();
        s.moveTo(-nw / 2, 0);
        s.lineTo(nw / 2, 0);
        s.lineTo(nw / 2, -MENU_H + r);
        s.absarc(nw / 2 - r, -MENU_H + r, r, 0, -Math.PI / 2, true);
        s.lineTo(-nw / 2 + r, -MENU_H);
        s.absarc(-nw / 2 + r, -MENU_H + r, r, -Math.PI / 2, -Math.PI, true);
        s.closePath();
        return new THREE.ShapeGeometry(s, 8);
      })(),
      well: new THREE.ShapeGeometry(roundedRect(KB_W + 0.05, KB_D + 0.05, 0.03), 8),
      keys: keysGeo,
      touch,
      legends: legendTexture(keys),
      grille: { w: grilleW, tex: grilleTexture(grilleW, KB_D) },
      pad: new THREE.ShapeGeometry(roundedRect(PAD_W, PAD_D, 0.035), 10),
      padSeam: new THREE.ShapeGeometry(roundedRect(PAD_W + 0.008, PAD_D + 0.008, 0.039), 10),
      chrome: chromeTexture(),
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(parts).forEach((v) => v?.dispose?.());
      parts.grille.tex.dispose();
    },
    [parts]
  );

  useLayoutEffect(() => {
    const aniso = gl.capabilities.getMaxAnisotropy();
    page.colorSpace = THREE.SRGBColorSpace;
    page.anisotropy = aniso;
    page.wrapT = THREE.ClampToEdgeWrapping;
    // Show a window of the long page the shape of the browser viewport;
    // offset moves it down the page.
    page.repeat.set(1, (TEX_W * (PAGE_H / SCREEN_W)) / TEX_H);
    page.offset.set(0, 1 - page.repeat.y);
    page.needsUpdate = true;
    [parts.legends, parts.grille.tex, parts.chrome].forEach((t) => {
      t.anisotropy = aniso;
      t.needsUpdate = true;
    });
  }, [page, gl, parts]);

  useFrame(() => {
    const p = progress.current;
    const open = ease(range(p, 0, 0.2));
    const deg = 8 + (OPEN_DEG - 8) * open;
    lid.current.rotation.x = THREE.MathUtils.degToRad(90 - deg);
    const scroll = ease(range(p, 0.45, 0.92));
    page.offset.y = (1 - page.repeat.y) * (1 - scroll);
  });

  // Satin silver aluminium: light, softly reflective.
  const aluminium = <meshStandardMaterial color="#d8dce2" metalness={0.42} roughness={0.4} envMapIntensity={0.9} />;
  const flat = [-Math.PI / 2, 0, 0];
  const kbCentreZ = KB_TOP + KB_D / 2;
  const keyTop = KEY_BASE + KEY_H + 0.006;

  return (
    <group>
      {/* Unibody base */}
      <mesh geometry={parts.body} castShadow receiveShadow>
        {aluminium}
      </mesh>
      {/* Ports: MagSafe, two Thunderbolt and headphone on the left; HDMI, Thunderbolt and SD on the right */}
      <Port side={-1} z={-0.62} w={0.17} h={0.03} r={0.015} />
      <Port side={-1} z={-0.3} w={0.088} h={0.03} r={0.015} />
      <Port side={-1} z={-0.12} w={0.088} h={0.03} r={0.015} />
      <Port side={-1} z={0.62} w={0.036} h={0.036} r={0.018} />
      <Port side={1} z={-0.4} w={0.14} h={0.042} r={0.006} />
      <Port side={1} z={-0.08} w={0.088} h={0.03} r={0.015} />
      <Port side={1} z={0.48} w={0.25} h={0.014} r={0.004} />
      {/* Keyboard well, keys, legends */}
      <mesh geometry={parts.well} position={[0, H + 0.0006, kbCentreZ]} rotation={flat} receiveShadow>
        <meshStandardMaterial color="#121214" roughness={0.75} metalness={0.25} />
      </mesh>
      <mesh geometry={parts.keys} castShadow receiveShadow>
        <meshStandardMaterial color="#19191b" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh geometry={parts.touch}>
        <meshPhysicalMaterial color="#0d0d0f" roughness={0.4} clearcoat={0.4} clearcoatRoughness={0.3} envMapIntensity={0.4} />
      </mesh>
      <mesh position={[0, keyTop + 0.0008, kbCentreZ]} rotation={flat}>
        <planeGeometry args={[KB_W, KB_D]} />
        <meshBasicMaterial map={parts.legends} transparent opacity={0.85} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Speaker grilles either side of the keyboard */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (KB_W / 2 + 0.115), H + 0.0007, kbCentreZ]} rotation={flat}>
          <planeGeometry args={[parts.grille.w, KB_D]} />
          <meshBasicMaterial map={parts.grille.tex} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
      {/* Glass trackpad with its seam */}
      <mesh geometry={parts.padSeam} position={[0, H + 0.0005, PAD_Z]} rotation={flat}>
        <meshStandardMaterial color="#9a9ea4" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh geometry={parts.pad} position={[0, H + 0.0009, PAD_Z]} rotation={flat}>
        <meshPhysicalMaterial color="#d6d9de" metalness={0.3} roughness={0.32} clearcoat={0.5} clearcoatRoughness={0.25} envMapIntensity={0.8} />
      </mesh>
      {/* Hinge barrel */}
      <mesh position={[0, H - 0.022, -D / 2 + 0.004]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, W - 0.5, 32]} />
        <meshStandardMaterial color="#1e1e20" metalness={0.5} roughness={0.42} />
      </mesh>
      {/* Lid: pivots on the hinge at the back edge of the body */}
      <group ref={lid} position={[0, H, -D / 2]}>
        <mesh geometry={parts.lid} castShadow receiveShadow>
          {aluminium}
        </mesh>
        {/* Black glass bezel */}
        <mesh geometry={parts.bezel} position={[0, LID_H / 2, 0.0012]}>
          <meshPhysicalMaterial color="#060607" roughness={0.1} metalness={0} clearcoat={1} clearcoatRoughness={0.06} />
        </mesh>
        {/* Display: the browser window, unlit so the site shows in its true colours */}
        <mesh position={[0, SCREEN_TOP - CHROME_H / 2, 0.003]}>
          <planeGeometry args={[SCREEN_W, CHROME_H]} />
          <meshBasicMaterial map={parts.chrome} toneMapped={false} />
        </mesh>
        <mesh position={[0, SCREEN_TOP - CHROME_H - PAGE_H / 2, 0.003]}>
          <planeGeometry args={[SCREEN_W, PAGE_H]} />
          <meshBasicMaterial map={page} toneMapped={false} />
        </mesh>
        {/* Camera notch */}
        <mesh geometry={parts.notch} position={[0, SCREEN_TOP, 0.0042]}>
          <meshBasicMaterial color="#050506" />
        </mesh>
        <mesh position={[0, SCREEN_TOP - MENU_H / 2, 0.0046]}>
          <circleGeometry args={[0.011, 24]} />
          <meshPhysicalMaterial color="#141822" roughness={0.1} clearcoat={1} />
        </mesh>
      </group>
    </group>
  );
}

// Camera: a smooth path from a wide, high three-quarter view to straight-on
// in front of the screen, plus a little drift with the pointer.
function CameraRig({ progress, pointer }) {
  const camera = useThree((s) => s.camera);
  const { path, look } = useMemo(() => {
    const centre = lidCentre();
    const lean = THREE.MathUtils.degToRad(OPEN_DEG - 90);
    const normal = new THREE.Vector3(0, Math.sin(lean), Math.cos(lean));
    // Close enough that the screen leads, far enough that the laptop still
    // frames it (bezel and the front of the body stay in view).
    const front = centre.clone().addScaledVector(normal, 5.2);
    return {
      path: new THREE.CatmullRomCurve3([
        new THREE.Vector3(6.4, 4.6, 7.4),
        new THREE.Vector3(4.2, 3.4, 5.6),
        new THREE.Vector3(1.6, 2.5, 3.6),
        front,
      ]),
      look: [new THREE.Vector3(0, 0.45, -0.1), centre],
    };
  }, []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = progress.current;
    const move = ease(range(p, 0.1, 0.45));
    path.getPointAt(move, camera.position);
    // A slow push-in while the page scrolls keeps it alive.
    const push = range(p, 0.45, 1) * 0.07;
    target.lerpVectors(look[0], look[1], move);
    offset.subVectors(camera.position, target).multiplyScalar(1 - push);
    camera.position.copy(target).add(offset);
    camera.position.x += pointer.current.x * 0.18;
    camera.position.y += pointer.current.y * 0.12;
    camera.lookAt(target);
  });
  return null;
}

// Damped follow of the scroll progress and pointer, and on-demand rendering:
// frames are drawn only while something is still moving.
function Driver({ target, pointerTarget, progress, pointer }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const wake = () => invalidate();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", wake, { passive: true });
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", wake);
    };
  }, [invalidate]);
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-6 * Math.min(dt, 1 / 30));
    progress.current += (target.current - progress.current) * k;
    pointer.current.x += (pointerTarget.current.x - pointer.current.x) * k;
    pointer.current.y += (pointerTarget.current.y - pointer.current.y) * k;
    const moving =
      Math.abs(target.current - progress.current) > 0.0005 ||
      Math.abs(pointerTarget.current.x - pointer.current.x) > 0.001 ||
      Math.abs(pointerTarget.current.y - pointer.current.y) > 0.001;
    if (moving) invalidate();
  });
  return null;
}

// One light source: the window in the HDRI. Its brightest region (measured
// from lebombo_1k.hdr: env direction (0.807, 0.214, 0.550)) is turned to sit
// front-left of the laptop, and the only shadow-casting light shines from
// that same direction, so the reflections on the aluminium, the shading and
// the cast shadow all agree. The window is set ~32 degrees above the table
// (daylight over a sill) rather than the HDRI's 12 degree horizon, so the
// shadow falls behind and to the right instead of across the whole room.
// No ambient light and no straight-down contact shadow: the shadow's
// softness comes from PCSS (crisp where the laptop meets the table, softer
// as it falls away), and its fill from the window light bouncing round the
// room (the HDRI), which isn't shadowed.
const ENV_ROTATION = -1.616; // radians about Y: the window to front-left
const SUN = (() => {
  const elevation = THREE.MathUtils.degToRad(32);
  const h = new THREE.Vector2(-0.6, 0.8); // window azimuth after ENV_ROTATION
  return new THREE.Vector3(h.x, Math.tan(elevation), h.y).normalize().multiplyScalar(12);
})();

function Lighting() {
  return (
    <>
      <SoftShadows size={38} samples={20} focus={0.2} />
      <directionalLight
        position={SUN.toArray()}
        intensity={2.4}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={2}
        shadow-camera-far={24}
        shadow-bias={-0.0003}
        shadow-normalBias={0.015}
      />
      <Environment files={ENV_HDRI} environmentIntensity={0.85} environmentRotation={[0, ENV_ROTATION, 0]} />
    </>
  );
}

function Table() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#d8cfc4" roughness={0.85} />
      </mesh>
    </>
  );
}

export default function LaptopScene({ target, pointerTarget }) {
  const progress = useRef(target.current);
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 60, position: [6.4, 4.6, 7.4] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      shadows
      aria-hidden="true"
    >
      <color attach="background" args={["#e9e5df"]} />
      <fog attach="fog" args={["#e9e5df", 12, 26]} />
      <Lighting />
      <Table />
      <Laptop progress={progress} />
      <CameraRig progress={progress} pointer={pointer} />
      <Driver target={target} pointerTarget={pointerTarget} progress={progress} pointer={pointer} />
    </Canvas>
  );
}
