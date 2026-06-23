const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'que-es-threejs.astro',
  'primera-escena.astro',
  'renderer.astro',
  'geometrias.astro',
  'materiales.astro',
  'meshes.astro',
  'luces.astro',
  'texturas.astro',
  'animaciones.astro',
  'interacciones-3d.astro'
];

const dir = path.join(__dirname, 'src/pages/threejs');

filesToUpdate.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Si ya tiene OrbitControls, lo saltamos
  if (content.includes('OrbitControls')) {
    console.log(`Skipping ${file}, already has OrbitControls`);
    return;
  }

  // 1. Añadir import
  content = content.replace(
    `import * as THREE from 'three';`,
    `import * as THREE from 'three';\n  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';`
  );

  // 2. Añadir instanciación
  content = content.replace(
    `container.appendChild(renderer.domElement);`,
    `container.appendChild(renderer.domElement);\n\n    const controls = new OrbitControls(camera, renderer.domElement);\n    controls.enableDamping = true;\n    controls.enablePan = false;`
  );

  // 3. Añadir update()
  content = content.replace(
    `animationId = requestAnimationFrame(animate);`,
    `animationId = requestAnimationFrame(animate);\n      controls.update();`
  );

  // 4. Añadir dispose()
  content = content.replace(
    `renderer.dispose();`,
    `controls.dispose();\n      renderer.dispose();`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
