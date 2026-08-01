#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const outputDir = process.env.DATASET_OUTPUT_DIR ?? "dist/kv";
const configPath = process.env.WRANGLER_CONFIG ?? "worker/wrangler.jsonc";
const binding = process.env.DATASET_KV_BINDING ?? "DATASET";

function requireEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required to publish the production dataset`);
  return value;
}

function wrangler(args) {
  const executable = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(
    executable,
    ["--no-install", "wrangler", ...args, "--config", configPath],
    { stdio: "inherit", env: process.env },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Wrangler command failed with exit code ${result.status}`);
}

try {
  requireEnvironment("CLOUDFLARE_API_TOKEN");
  requireEnvironment("CLOUDFLARE_ACCOUNT_ID");

  const version = (await readFile(`${outputDir}/current-version.txt`, "utf8")).trim();
  if (!version) throw new Error("current-version.txt is empty; run npm run build:dataset first");

  console.log(`Uploading versioned dataset ${version} to KV binding ${binding}...`);
  wrangler([
    "kv",
    "bulk",
    "put",
    `${outputDir}/versioned.json`,
    "--binding",
    binding,
    "--remote",
  ]);

  console.log("Switching stable and preview dataset pointers after all versioned entries completed...");
  for (const pointer of ["dataset:current", "dataset:preview"]) {
    wrangler([
      "kv",
      "key",
      "put",
      pointer,
      version,
      "--binding",
      binding,
      "--remote",
    ]);
  }

  console.log(`Published stable and preview dataset ${version}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
