import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { decryptGuideFile, encryptForBattletag } from "../lib/rxp-crypto";

const rootDir = join(__dirname, "..");
const sourcePath = join(rootDir, ".private", "source-guide.txt");
const sourceTagPath = join(rootDir, ".private", "source-battletag.txt");
const outputPath = join(rootDir, "public", "guide-wow-forever.txt");
const publicSourceTag = "wowforever#0000";

try {
  const raw = readFileSync(sourcePath, "utf8");
  const sourceTag = readFileSync(sourceTagPath, "utf8").trim();

  if (!sourceTag) {
    throw new Error(`${sourceTagPath} is empty.`);
  }

  const source = decryptGuideFile(raw, sourceTag);
  const encrypted = encryptForBattletag(
    source.plaintext,
    publicSourceTag,
    source.version,
  );
  const verified = decryptGuideFile(encrypted, publicSourceTag);

  if (
    verified.plaintext !== source.plaintext ||
    verified.version !== source.version ||
    verified.guideCount !== source.guideCount
  ) {
    throw new Error("Generated guide failed round-trip verification.");
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, encrypted, "utf8");
  console.log(
    `Prepared ${verified.guideCount} guide${verified.guideCount === 1 ? "" : "s"} ` +
      `(version ${verified.version}) at ${outputPath}`,
  );
  console.log("The private source file and BattleTag were not copied.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Unable to prepare the WoW Forever guide: ${message}`);
  console.error(`Expected source file: ${sourcePath}`);
  console.error(`Expected BattleTag file: ${sourceTagPath}`);
  process.exitCode = 1;
}
