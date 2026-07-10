import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'manifest.json');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

function isImage(file) {
  return IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function scanProjects() {
  const projects = [];
  const projectsDir = path.join(PUBLIC_DIR, 'projects');

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const folderName = entry.name;
      const folderPath = path.join(projectsDir, folderName);
      const infoPath = path.join(folderPath, 'info.json');

      if (fs.existsSync(infoPath)) {
        try {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
          const files = fs.readdirSync(folderPath);
          const photos = files
            .filter(file => isImage(file) && file !== 'logo.svg' && file !== 'logo.png')
            .map(file => `/projects/${folderName}/${file}`);

          projects.push({
            id: folderName,
            title: info.title || folderName,
            category: info.category || 'General',
            description: info.description || '',
            tech: info.tech || [],
            visitUrl: info.visitUrl || '',
            githubUrl: info.githubUrl || '',
            status: info.status || 'Active',
            photos: photos
          });
        } catch (err) {
          console.error(`Error parsing info.json in project ${folderName}:`, err);
        }
      }
    }
  }
  return projects;
}

function scanDesigns() {
  const designs = {};
  const designsDir = path.join(PUBLIC_DIR, 'designs');

  if (fs.existsSync(designsDir)) {
    const subfolders = fs.readdirSync(designsDir, { withFileTypes: true });
    for (const sub of subfolders) {
      if (sub.isDirectory()) {
        const subPath = path.join(designsDir, sub.name);
        const images = fs.readdirSync(subPath)
          .filter(file => isImage(file))
          .map(file => `/designs/${sub.name}/${file}`);
        
        designs[sub.name] = images;
      }
    }
  }
  return designs;
}

function scanLogos() {
  const logos = [];
  const logosDir = path.join(PUBLIC_DIR, 'logos');

  if (fs.existsSync(logosDir)) {
    const subfolders = fs.readdirSync(logosDir, { withFileTypes: true });
    for (const sub of subfolders) {
      if (sub.isDirectory()) {
        const subPath = path.join(logosDir, sub.name);
        const files = fs.readdirSync(subPath);

        // Find description json
        const jsonFile = files.find(file => file.endsWith('.json'));
        // Find logo image (png or svg)
        const imageFile = files.find(file => isImage(file) && !file.endsWith('.json'));

        if (jsonFile && imageFile) {
          try {
            const descData = JSON.parse(fs.readFileSync(path.join(subPath, jsonFile), 'utf8'));
            logos.push({
              id: sub.name,
              title: descData.title || sub.name,
              tag: descData.tag || '// BRAND MARK',
              desc: descData.desc || '',
              imagePath: `/logos/${sub.name}/${imageFile}`
            });
          } catch (err) {
            console.error(`Error parsing logo json in ${sub.name}:`, err);
          }
        }
      }
    }
  }
  return logos;
}

function scanPhotography() {
  const photographyDir = path.join(PUBLIC_DIR, 'photography');
  if (fs.existsSync(photographyDir)) {
    return fs.readdirSync(photographyDir)
      .filter(file => isImage(file))
      .map(file => `/photography/${file}`);
  }
  return [];
}

function main() {
  console.log('Generating assets manifest...');
  const manifest = {
    projects: scanProjects(),
    designs: scanDesigns(),
    logos: scanLogos(),
    photography: scanPhotography()
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Manifest written to: ${MANIFEST_PATH}`);
  console.log(`- Scanned ${manifest.projects.length} projects`);
  console.log(`- Scanned ${Object.keys(manifest.designs).length} design subfolders`);
  console.log(`- Scanned ${manifest.logos.length} logos`);
  console.log(`- Scanned ${manifest.photography.length} photography images`);
}

main();
