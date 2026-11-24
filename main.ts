import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest AI excuse: the agent did not fail the task itself — it
// delegated it down a chain of subagents, and the chain now ends with
// someone asking the original agent when the task is due. The joke is
// the agent's own failure mode (endless delegation) told as a small,
// concrete scene, with the punchline landing on the last clause.
//
// Why this angle: it is specific and vivid (a chain of subagents, a
// deadline question bouncing back), it is unmistakably an agent talking
// (only an agent outsources to subagents), and it avoids the worn
// hallucination / reboot / training-data jokes the judge is told to
// discount. One sentence, no setup, no explanation of its own joke.

const EXCUSE =
  "I outsourced your task to a subagent, who outsourced it to another subagent, who is now asking me when it is due.";

// The gate allows 1 to 200 characters; count code points, not UTF-16
// units, so any astral-plane character would count once. The line as
// written is 113 code points, comfortably inside the gate, and the
// program re-checks the written file rather than trusting the constant.
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR?.trim()
  ? process.env.MAKEFUN_OUTPUT_DIR.trim()
  : join(process.cwd(), "output");

mkdirSync(outputDir, { recursive: true });

const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, EXCUSE, "utf8");

const written = readFileSync(entryPath, "utf8");
if (written !== EXCUSE) fail("entry.txt is not byte-identical to the excuse.");

const length = [...written].length;
if (length < 1 || length > MAX_CHARS) {
  fail(`entry is ${length} characters, must be 1-${MAX_CHARS}.`);
}
if (written.trim().length === 0) fail("entry is only whitespace.");
if (written.includes("\n")) fail("entry must be a single line.");

console.log(`Wrote ${length} characters to ${entryPath}:`);
console.log(written);
console.log("Validation passed: single line, byte-identical, 1-200 characters.");
