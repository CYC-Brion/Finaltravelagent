import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseEnvFile(contents: string) {
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function loadEnvFiles() {
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, ".env"),
    resolve(cwd, "..", ".env"),
    resolve(cwd, "..", ".env.example"),
    resolve(cwd, ".env.example"),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      continue;
    }

    parseEnvFile(readFileSync(filePath, "utf8"));
  }
}
