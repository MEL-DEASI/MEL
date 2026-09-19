import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const routes = ["recharge", "meteo", "niveaux", "prelevement", "quizz", "map"];
const outputDir = resolve("docs");
const sourceIndex = resolve(outputDir, "index.html");

for (const route of routes) {
  const routeDir = resolve(outputDir, route);
  await mkdir(routeDir, { recursive: true });
  await copyFile(sourceIndex, resolve(routeDir, "index.html"));
}

console.log(`Created direct GitHub Pages routes: ${routes.join(", ")}`);
