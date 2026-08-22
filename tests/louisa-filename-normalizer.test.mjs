import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Louisa normalizer preserves an existing stable hash suffix", async () => {
  const source = await readFile("scripts/normalize-louisa-filenames.mjs", "utf8");
  assert.match(source, /HASH_SUFFIX_FILE/u);
  assert.match(source, /existingHashSuffix/u);
  assert.match(source, /!HASH_FILE\.test\(fileName\).*return fileName/u);
});
