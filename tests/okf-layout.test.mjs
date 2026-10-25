import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

test("FamilyMart softcream concepts use brand and category hierarchy", async () => {
  const menuRoot = "knowledge/menu-items";
  const rootEntries = await readdir(menuRoot, { withFileTypes: true });
  const misplaced = rootEntries
    .filter((entry) => entry.isFile() && entry.name.startsWith("familymart-"))
    .map((entry) => entry.name);
  assert.deepEqual(misplaced, []);

  const softcreamRoot = path.join(menuRoot, "familymart", "softcream");
  const concepts = (await readdir(softcreamRoot))
    .filter((name) => name.endsWith(".md") && name !== "index.md")
    .sort();
  // Best-practice OKF naming: every concept filename carries the real-world
  // brand and product name (no hash-only or hash-suffixed names).
  assert.ok(concepts.length >= 7, "softcream concepts exist");
  for (const name of concepts) {
    assert.match(name, /^全家_Fami!ce_/u, `meaningful brand-prefixed filename: ${name}`);
    assert.doesNotMatch(name, /(^-+|--[0-9a-f]{8,})/u, `no meaningless hash name: ${name}`);
  }

  const familymartIndex = await readFile(path.join(menuRoot, "familymart", "index.md"), "utf8");
  const softcreamIndex = await readFile(path.join(softcreamRoot, "index.md"), "utf8");
  assert.match(familymartIndex, /\[Softcream\]\(softcream\/\)/u);
  assert.match(softcreamIndex, /日世霜淇淋-水蜜桃\.md/u);
});
