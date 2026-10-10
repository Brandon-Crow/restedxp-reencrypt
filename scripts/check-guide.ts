import { existsSync } from "node:fs";
import { join } from "node:path";

const guidePath = join(__dirname, "..", "public", "guide-wow-forever.txt");

if (!existsSync(guidePath)) {
  console.error(`Missing prepared guide: ${guidePath}`);
  console.error("Run npm run prepare:guide before building for deployment.");
  process.exitCode = 1;
}
