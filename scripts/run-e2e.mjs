import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const astroCli = "./node_modules/astro/bin/astro.mjs";
const wranglerCli = "./node_modules/wrangler/bin/wrangler.js";
const playwrightCli = "./node_modules/@playwright/test/cli.js";
const previewUrl = "http://127.0.0.1:4321";
const configHome = join(process.cwd(), ".tmp", "wrangler-e2e-config");
await mkdir(configHome, { recursive: true });
const childEnvironment = { ...process.env, XDG_CONFIG_HOME: configHome };

function run(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      ...options
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) reject(new Error(`Command stopped by ${signal}`));
      else resolve(code ?? 1);
    });
  });
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) return;
    } catch {
      // The preview process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Production preview did not become ready.");
}

const buildCode = await run([astroCli, "build"]);
if (buildCode !== 0) process.exit(buildCode);

const preview = spawn(
  process.execPath,
  [wranglerCli, "dev", "--local", "--host", "127.0.0.1", "--port", "4321", "--no-live-reload"],
  { stdio: "inherit", env: childEnvironment }
);

let exitCode = 1;
try {
  await waitForPreview();
  exitCode = await run([playwrightCli, "test"], {
    env: { ...childEnvironment, PLAYWRIGHT_EXTERNAL_SERVER: "1" }
  });
} finally {
  preview.kill("SIGTERM");
}

process.exit(exitCode);
