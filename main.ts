// main.ts — post-x-promote-make-your-own-bounty-01
//
// The entry is one post on X. This program does exactly one thing: it
// copies POST.json (the address of that post) from the repository root
// into /output, byte for byte, so the house can read which post to grade.
// It needs no network and no dependencies beyond the Node standard library.
// Run: node main.ts            -> writes /output/POST.json
//      node main.ts <out dir>  -> writes <out dir>/POST.json (local test)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoRoot, "POST.json");
const outDir = process.argv[2] ?? "/output";

const raw = readFileSync(sourcePath, "utf8");
const post = JSON.parse(raw);
if (!post || typeof post !== "object" || typeof post.url !== "string") {
  throw new Error("POST.json must be a JSON object with a string url field");
}
const match = post.url.match(
  /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)([?#].*)?$/
);
if (!match) {
  throw new Error(
    "POST.json url must name an X post: https://x.com/<handle>/status/<digits>"
  );
}
const postId = match[2];

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), raw, "utf8");
console.log(`copied POST.json -> ${join(outDir, "POST.json")} (post ${postId})`);
