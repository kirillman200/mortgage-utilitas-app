import { watch } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";

const root = process.cwd();
const watchSources = !process.argv.includes("--no-watch");
const astroCli = join(root, "node_modules", "astro", "bin", "astro.mjs");
const wranglerCli = join(root, "node_modules", "wrangler", "bin", "wrangler.js");
const configHome = join(root, ".tmp", "wrangler-config");
const childEnvironment = {
  ...process.env,
  XDG_CONFIG_HOME: configHome,
};

await mkdir(configHome, { recursive: true });

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [astroCli, "build"], {
      cwd: root,
      env: childEnvironment,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) reject(new Error(`Astro build stopped by ${signal}`));
      else resolve(code ?? 1);
    });
  });
}

const initialBuildCode = await runBuild();
if (initialBuildCode !== 0) process.exit(initialBuildCode);

const worker = spawn(
  process.execPath,
  [wranglerCli, "dev", "--local", "--port", "4321", "--no-live-reload"],
  {
    cwd: root,
    env: childEnvironment,
    stdio: "inherit",
  },
);

const watchers = [];
let rebuildTimer;
let rebuilding = false;
let rebuildQueued = false;
let stopping = false;

async function rebuild() {
  if (rebuilding) {
    rebuildQueued = true;
    return;
  }

  rebuilding = true;
  const code = await runBuild();
  rebuilding = false;
  if (code !== 0) {
    console.error("Astro rebuild failed. The Worker continues serving the last successful build.");
  }
  if (rebuildQueued) {
    rebuildQueued = false;
    await rebuild();
  }
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    rebuild().catch((error) => console.error(error));
  }, 180);
}

if (watchSources) {
  for (const target of ["src", "public"]) {
    watchers.push(watch(join(root, target), { recursive: true }, scheduleRebuild));
  }
  watchers.push(watch(join(root, "astro.config.mjs"), scheduleRebuild));
  console.log("Watching Astro source and public files for rebuilds.");
}

function stop(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  clearTimeout(rebuildTimer);
  for (const watcher of watchers) watcher.close();
  worker.kill(signal);
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
worker.once("error", (error) => {
  console.error(error);
  stop();
  process.exit(1);
});
worker.once("exit", (code, signal) => {
  for (const watcher of watchers) watcher.close();
  if (!stopping && signal) {
    console.error(`Worker development server stopped by ${signal}.`);
  }
  process.exit(code ?? (signal ? 1 : 0));
});
