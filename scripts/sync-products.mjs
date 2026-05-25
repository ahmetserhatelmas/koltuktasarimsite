import fs from "fs";
import path from "path";

const SOURCE = "/Users/ase/Desktop/KoltukDunyam";
const OUT = path.join(process.cwd(), "public/products");

const CATEGORY_MAP = [
  { src: "Bar Taburesi", dest: "bar", prefix: "bar" },
  { src: "KonferansSandalyeleri", dest: "konferans-sandalyeleri", prefix: "ks" },
  { src: "konferanskoltukları", dest: "konferans-koltuklari", prefix: "kk", subdirs: true },
  { src: "Stadyum", dest: "stadyum", prefix: "st", subdirs: true },
];

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

function copyImage(srcPath, destDir, idPrefix, subPath = "") {
  const base = path.basename(srcPath);
  const ext = path.extname(base).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".jfif"].includes(ext)) return null;

  const slug = slugify(path.parse(base).name + (subPath ? `-${subPath}` : ""));
  const id = `${idPrefix}-${slug}`.replace(/--+/g, "-");
  const outName = `${id}${ext === ".jfif" ? ".jpg" : ext}`;
  const destPath = path.join(destDir, outName);

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);

  const displayName = path
    .parse(base)
    .name
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    id,
    name: displayName,
    image: `/products/${path.basename(destDir)}/${outName}`,
    subPath,
  };
}

function walkDir(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith(".") || entry.name.endsWith(".html") || entry.name.endsWith(".htm"))
      continue;
    if (entry.isDirectory()) walkDir(full, onFile);
    else onFile(full, entry.name);
  }
}

const catalog = { bar: [], konferansSandalyeleri: [], konferansKoltuklari: [], stadyum: [] };

for (const cat of CATEGORY_MAP) {
  const srcRoot = path.join(SOURCE, cat.src);
  if (!fs.existsSync(srcRoot)) continue;
  const destDir = path.join(OUT, cat.dest);

  if (cat.subdirs) {
    for (const sub of fs.readdirSync(srcRoot, { withFileTypes: true })) {
      if (!sub.isDirectory() || sub.name.startsWith(".")) continue;
      const subDir = path.join(srcRoot, sub.name);
      walkDir(subDir, (filePath) => {
        const item = copyImage(filePath, destDir, cat.prefix, slugify(sub.name));
        if (!item) return;
        const product = {
          id: item.id,
          name: `${sub.name} — ${item.name}`,
          image: item.image,
          quoteOnly: cat.dest === "stadyum",
        };
        if (cat.dest === "konferans-koltuklari") catalog.konferansKoltuklari.push(product);
        else if (cat.dest === "stadyum") catalog.stadyum.push(product);
      });
    }
  } else {
    walkDir(srcRoot, (filePath) => {
      const item = copyImage(filePath, destDir, cat.prefix);
      if (!item) return;
      const product = { id: item.id, name: item.name, image: item.image, quoteOnly: false };
      if (cat.dest === "bar") catalog.bar.push(product);
      else if (cat.dest === "konferans-sandalyeleri")
        catalog.konferansSandalyeleri.push(product);
    });
  }
}

// Slides + projeler + logo
const heroDir = path.join(process.cwd(), "public/hero");
fs.mkdirSync(heroDir, { recursive: true });
for (let i = 1; i <= 3; i++) {
  const src = path.join(SOURCE, "Slide", `slide${i}.png`);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(heroDir, `slide-${i}.png`));
}

const projDir = path.join(process.cwd(), "public/projeler");
fs.mkdirSync(projDir, { recursive: true });
const projSrc = path.join(SOURCE, "projeler");
if (fs.existsSync(projSrc)) {
  let n = 0;
  for (const f of fs.readdirSync(projSrc)) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    n++;
    fs.copyFileSync(path.join(projSrc, f), path.join(projDir, `proje-${n}.jpeg`));
  }
}

const manifestPath = path.join(process.cwd(), "src/lib/products-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(catalog, null, 2));
console.log(
  `bar: ${catalog.bar.length}, ks: ${catalog.konferansSandalyeleri.length}, kk: ${catalog.konferansKoltuklari.length}, st: ${catalog.stadyum.length}`,
);
