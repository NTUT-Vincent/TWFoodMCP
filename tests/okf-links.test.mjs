import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("all internal OKF Markdown links resolve", () => {
  const output = execFileSync(process.execPath, ["scripts/check-okf-links.mjs"], { encoding: "utf8" });
  assert.match(output, /Validated \d+ internal Markdown links/u);
});
