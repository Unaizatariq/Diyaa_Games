import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DIYAA_MODULE_CATALOG, moduleStats } from "../config/moduleCatalog.js";

const outPath = resolve(process.cwd(), "config/generated/moduleCatalog.json");
mkdirSync(dirname(outPath), { recursive: true });

const payload = {
    generatedAt: new Date().toISOString(),
    stats: moduleStats,
    modules: DIYAA_MODULE_CATALOG
};

writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf-8");
console.log(`Exported ${moduleStats.totalModules} modules to ${outPath}`);

