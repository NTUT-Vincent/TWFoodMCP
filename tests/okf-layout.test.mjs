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
  assert.deepEqual(concepts, [
    "cone-original.md",
    "heart-cone.md",
    "nissei-belgian-chocolate.md",
    "nissei-estate-milk.md",
    "nissei-peach.md",
    "nissei-sweet-soy-sauce.md",
    "nissei-wasabi.md",
  ]);

  const familymartIndex = await readFile(path.join(menuRoot, "familymart", "index.md"), "utf8");
  const softcreamIndex = await readFile(path.join(softcreamRoot, "index.md"), "utf8");
  assert.match(familymartIndex, /\[Softcream\]\(softcream\/\)/u);
  assert.match(softcreamIndex, /nissei-peach\.md/u);
});
