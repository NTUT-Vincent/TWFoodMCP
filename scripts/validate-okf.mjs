#!/usr/bin/env node
import { loadOkfDocuments } from "./lib/dataset.mjs";

try {
  const documents = await loadOkfDocuments();
  const stable = documents.filter(({ data }) => data.status === "stable").length;
  const draft = documents.filter(({ data }) => data.status === "draft").length;
  const deprecated = documents.filter(({ data }) => data.status === "deprecated").length;
  console.log(`Validated ${documents.length} OKF documents (${stable} stable, ${draft} draft, ${deprecated} deprecated).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
