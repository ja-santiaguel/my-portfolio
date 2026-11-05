// Exports resume.html to PDF with the installed Firefox, then copies it to
// public/ for the site. Run from anywhere: node content/resume/print-resume.cjs
//
// Firefox runs headless with a throwaway profile, driven over WebDriver BiDi,
// and the page is served from 127.0.0.1 so its fonts load (browsers block fonts
// in a parent folder on file:// pages). Never use Chrome for this (see README).
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "../..");
const pdfPath = path.join(__dirname, "jonathan-santiaguel-resume.pdf");
const publicPath = path.join(root, "public", "jonathan-santiaguel-resume.pdf");
const FIREFOX = process.env.FIREFOX || "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
const WEB_PORT = 4000;
const BIDI_PORT = 9333;
const types = { ".html": "text/html", ".otf": "font/otf", ".ttf": "font/ttf" };

const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connect = async () => {
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    const ws = await new Promise((resolve) => {
      const s = new WebSocket(`ws://127.0.0.1:${BIDI_PORT}/session`);
      s.onopen = () => resolve(s);
      s.onerror = () => resolve(null);
    });
    if (ws) return ws;
  }
  throw new Error("Firefox's remote port never opened");
};

(async () => {
  await new Promise((r) => server.listen(WEB_PORT, "127.0.0.1", r));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "resume-ff-"));
  const firefox = spawn(FIREFOX, ["--headless", "--no-remote", "--profile", profile, `--remote-debugging-port=${BIDI_PORT}`], { stdio: "ignore" });
  const ws = await connect();

  let id = 0;
  const waiting = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (!m.id || !waiting.has(m.id)) return;
    const { resolve, reject } = waiting.get(m.id);
    waiting.delete(m.id);
    if (m.type === "error") reject(new Error(`${m.error}: ${m.message}`));
    else resolve(m.result);
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      waiting.set(n, { resolve, reject });
      ws.send(JSON.stringify({ id: n, method, params }));
    });

  try {
    await send("session.new", { capabilities: {} });
    const { contexts } = await send("browsingContext.getTree");
    const context = contexts[0].context;
    await send("browsingContext.navigate", { context, url: `http://127.0.0.1:${WEB_PORT}/content/resume/resume.html`, wait: "complete" });

    const fonts = await send("script.evaluate", {
      target: { context },
      awaitPromise: true,
      expression: `document.fonts.ready.then(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family + " " + f.weight).join(", "))`,
    });
    console.log("Fonts loaded:", fonts.result.value);
    if (!/Helvetica Neue.* 700/.test(fonts.result.value)) throw new Error("Helvetica Neue Bold didn't load");

    const pdf = await send("browsingContext.print", {
      context,
      background: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      page: { width: 21.59, height: 27.94 }, // Letter, in cm
      shrinkToFit: false,
    });
    fs.writeFileSync(pdfPath, Buffer.from(pdf.data, "base64"));
    fs.copyFileSync(pdfPath, publicPath);
    console.log(`Wrote ${path.relative(root, pdfPath)} and ${path.relative(root, publicPath)}`);
    await send("session.end").catch(() => {});
  } finally {
    ws.close();
    firefox.kill();
    server.close();
    await sleep(800);
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
  }
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
