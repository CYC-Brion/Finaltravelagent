"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvFiles = loadEnvFiles;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
function parseEnvFile(contents) {
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
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}
function loadEnvFiles() {
    const cwd = process.cwd();
    const candidates = [
        (0, node_path_1.resolve)(cwd, ".env"),
        (0, node_path_1.resolve)(cwd, "..", ".env"),
        (0, node_path_1.resolve)(cwd, "..", ".env.example"),
        (0, node_path_1.resolve)(cwd, ".env.example"),
    ];
    for (const filePath of candidates) {
        if (!(0, node_fs_1.existsSync)(filePath)) {
            continue;
        }
        parseEnvFile((0, node_fs_1.readFileSync)(filePath, "utf8"));
    }
}
//# sourceMappingURL=env-loader.js.map