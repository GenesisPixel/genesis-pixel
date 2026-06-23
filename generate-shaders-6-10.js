const fs = require('fs');
const path = require('path');

const lessons = [
  {
    filename: 'varyings.astro',
    title: 'Varyings',
    lessonIndex: 6,
    prevLesson: { title: 'Uniforms', href: '/shaders/uniforms' },
    nextLesson: { title: 'Coordenadas UV', href: '/shaders/coordenadas-uv' },
    readingTime: 6,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El puente entre el Vértice y el Píxel</h3>
    <p>Ya sabes cómo mover los vértices de una figura (Vertex Shader) y cómo pintar cada píxel (Fragment Shader). Pero, ¿qué pasa si quieres pintar un píxel basándote en lo que le pasó a su vértice correspondiente? Por ejemplo, ¿qué tal si quieres pintar de blanco los picos altos de una montaña, y de verde los valles bajos?</p>
    
    <h3>¿Qué es un Varying?</h3>
    <p>Un <strong>Varying</strong> es una variable que sirve exclusivamente para pasar información <em>desde el Vertex Shader hacia el Fragment Shader</em>. No puedes enviarla al revés (del fragment al vertex).</p>
    <p>Se llama "varying" (variante) porque la GPU hace algo mágico: la <strong>interpola</strong>. Si le envías un valor \`1.0\` en el vértice izquierdo y \`0.0\` en el vértice derecho, el Fragment Shader no recibe un salto brusco. Recibirá \`0.5\` exactamente en el píxel del medio. ¡Transiciones automáticas suaves!</p>

    <h3>Cómo se declara</h3>
    <p>A diferencia de los <code>uniforms</code> que vienen de JavaScript, los <code>varyings</code> se declaran en la parte superior de <strong>ambos</strong> shaders con el mismo nombre y tipo de dato. En el Vertex Shader le asignas el valor, y en el Fragment Shader lo lees.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Una convención profesional es nombrar todas tus variables varying empezando con la letra 'v' minúscula. Por ejemplo: vUv, vElevation, vPosition. Así, cuando leas tu Fragment Shader, sabrás inmediatamente que ese valor fue calculado y enviado por el Vertex Shader." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El mapa topográfico
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="varyings"
      tabs={[
        { id: 'vertex', label: 'Vertex Shader', code: "varying float vElevation;\n\nvoid main() {\n  vec3 newPosition = position;\n  \n  // Generamos un 'valle' matemático\n  float elevation = sin(position.x * 5.0) * 0.5;\n  newPosition.y += elevation;\n\n  // Guardamos la elevación en el varying para enviarla al Fragment Shader\n  vElevation = elevation;\n\n  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);\n}" },
        { id: 'fragment', label: 'Fragment Shader', code: "varying float vElevation;\n\nvoid main() {\n  // Leemos el varying. El centro del valle será negro, los picos blancos.\n  // Ajustamos el rango porque el seno va de -0.5 a 0.5.\n  float colorIntensity = vElevation + 0.5;\n\n  gl_FragColor = vec4(vec3(colorIntensity), 1.0);\n}" }
      ]}
    />
    <ResultPreview description="La altura (calculada en el Vertex Shader) determina el color (pintado en el Fragment Shader).">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-varyings" style="cursor: grab;">
      </div>
    </ResultPreview>
  </div>

  <div class="my-8 flex flex-col gap-6">
    <ErroresComunesV3 errors={[
      { label: 'Tipos desajustados', description: 'Declaraste varying vec2 vUv en el Vertex, pero varying vec3 vUv en el Fragment. Fallará instantáneamente.' },
    ]} />
  </div>
`,
    scripts: `
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-varyings');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const geometry = new THREE.PlaneGeometry(3, 3, 64, 64);
    geometry.rotateX(-Math.PI * 0.5); // Acostarlo
    
    const vertexShader = \`
      varying float vElevation;
      uniform float u_time;

      void main() {
        vec3 pos = position;
        float elevation = sin(pos.x * 4.0 + u_time) * cos(pos.z * 4.0 + u_time) * 0.3;
        pos.y += elevation;

        // Enviamos la elevación al Fragment Shader
        vElevation = elevation;

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
      }
    \`;

    const fragmentShader = \`
      varying float vElevation;

      void main() {
        // vElevation va de -0.3 a 0.3
        // Lo convertimos a un rango de 0.0 a 1.0
        float intensity = (vElevation + 0.3) / 0.6;
        
        vec3 colorValles = vec3(0.04, 0.06, 0.1); // Oscuro
        vec3 colorPicos = vec3(0.34, 0.69, 0.98); // 57B0FB

        vec3 finalColor = mix(colorValles, colorPicos, intensity);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { u_time: { value: 0 } },
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'coordenadas-uv.astro',
    title: 'Coordenadas UV',
    lessonIndex: 7,
    prevLesson: { title: 'Varyings', href: '/shaders/varyings' },
    nextLesson: { title: 'Colores y Gradientes', href: '/shaders/colores-y-gradientes' },
    readingTime: 6,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El GPS de las texturas</h3>
    <p>Hemos pintado la pantalla usando \`gl_FragCoord\` (la posición del píxel en la pantalla). Pero si nuestra geometría 3D se mueve, el píxel de la pantalla seguirá en su lugar y el objeto parecerá transparente revelando un fondo. Necesitamos pintar basándonos en la <strong>superficie de la geometría misma</strong>, no en la pantalla.</p>
    
    <h3>¿Qué son las UV?</h3>
    <p>Las coordenadas UV son como un mapa que envuelve tu modelo 3D. \`U\` es el eje horizontal (0.0 a 1.0) y \`V\` es el eje vertical (0.0 a 1.0).</p>
    <p>Si miras la esquina inferior izquierda de un plano, su UV es (0.0, 0.0). La esquina superior derecha es (1.0, 1.0). Three.js inyecta automáticamente el atributo \`uv\` en el Vertex Shader de casi todas las geometrías base.</p>

    <h3>El puente clásico</h3>
    <p>Para usar las UV en el Fragment Shader (que es donde realmente pintamos), debes capturar el atributo en el Vertex Shader y enviarlo a través de un <code>varying</code>.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Visualizar las UV directamente en el Fragment Shader es la mejor forma de depurar. Si asignas gl_FragColor = vec4(vUv, 0.0, 1.0); verás un hermoso gradiente de negro a rojo y verde. Ese patrón rojo-verde es el 'Hola Mundo' de los Shaders." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El clásico patrón UV
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="uvs"
      tabs={[
        { id: 'vertex', label: 'Vertex', code: "varying vec2 vUv;\n\nvoid main() {\n  // uv es un atributo provisto por Three.js mágicamente\n  vUv = uv;\n\n  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n}" },
        { id: 'fragment', label: 'Fragment', code: "varying vec2 vUv;\n\nvoid main() {\n  // x = Rojo, y = Verde, z(azul) = 0.0\n  gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);\n}" }
      ]}
    />
    <ResultPreview description="La representación visual pura de las coordenadas UV.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-uvs" style="cursor: grab;">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-uvs');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    // Un cubo y un plano para ver cómo se aplican las UVs
    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    
    const vertexShader = \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    \`;

    const fragmentShader = \`
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'colores-y-gradientes.astro',
    title: 'Colores y Gradientes',
    lessonIndex: 8,
    prevLesson: { title: 'Coordenadas UV', href: '/shaders/coordenadas-uv' },
    nextLesson: { title: 'Ruido Procedural', href: '/shaders/ruido-procedural' },
    readingTime: 6,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Más allá del CSS</h3>
    <p>En CSS crear un gradiente es tan fácil como \`linear-gradient()\`. En Shaders, tú eres el motor matemático que calcula ese gradiente. La ventaja es que aquí tienes control absoluto: puedes rotarlos, curvados, y hacerlos reaccionar al tiempo y al espacio.</p>
    
    <h3>La función mix()</h3>
    <p>La herramienta definitiva para el color es \`mix(color1, color2, factor)\`. Si el factor es \`0.0\`, devuelve el \`color1\`. Si es \`1.0\`, devuelve el \`color2\`. Si es \`0.5\`, los mezcla perfectamente a la mitad.</p>

    <h3>Patrones con step() y smoothstep()</h3>
    <p>¿Qué pasa si en lugar de un gradiente suave quieres un corte duro, o una banda? Utilizas la función \`step(limite, valor)\`. Si el valor es menor al límite, devuelve 0.0. Si es mayor, devuelve 1.0. Es como un <em>if statement</em> pero optimizado para GPU.</p>
  </article>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Círculo Perfecto
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="gradients"
      tabs={[
        { id: 'fragment', label: 'Fragment Shader', code: "varying vec2 vUv;\n\nvoid main() {\n  // Mueve el origen UV al centro (-0.5 a 0.5)\n  vec2 centeredUv = vUv - 0.5;\n  \n  // distance() calcula la distancia desde el centro\n  float dist = distance(centeredUv, vec2(0.0));\n  \n  // smoothstep(min, max, value) crea un borde suavizado\n  // Si dist < 0.2 -> 0.0\n  // Si dist > 0.25 -> 1.0\n  float mask = smoothstep(0.2, 0.25, dist);\n\n  // Mezclamos Colores\n  vec3 colorFondo = vec3(0.1);\n  vec3 colorCirculo = vec3(0.98, 0.36, 0.49); // Rosa\n\n  vec3 colorFinal = mix(colorCirculo, colorFondo, mask);\n\n  gl_FragColor = vec4(colorFinal, 1.0);\n}" }
      ]}
    />
    <ResultPreview description="Dibujando formas geométricas puras calculando distancias matemáticas.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-gradients">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-gradients');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const fragmentShader = \`
      uniform float u_time;
      varying vec2 vUv;

      void main() {
        vec2 centeredUv = vUv - 0.5;
        
        // Animamos el centro del círculo
        centeredUv.x += sin(u_time) * 0.2;
        centeredUv.y += cos(u_time * 1.5) * 0.2;

        float dist = distance(centeredUv, vec2(0.0));
        
        // Bordes borrosos que pulsan
        float blur = 0.05 + sin(u_time * 2.0) * 0.04;
        float mask = smoothstep(0.3, 0.3 + blur, dist);

        vec3 colorFondo = vec3(0.04, 0.06, 0.1);
        vec3 colorCirculo = mix(vec3(0.988, 0.364, 0.490), vec3(0.34, 0.69, 0.98), vUv.y); // Gradiente dentro del círculo

        vec3 colorFinal = mix(colorCirculo, colorFondo, mask);

        gl_FragColor = vec4(colorFinal, 1.0);
      }
    \`;

    const vertexShader = \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { u_time: { value: 0 } }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'ruido-procedural.astro',
    title: 'Ruido Procedural',
    lessonIndex: 9,
    prevLesson: { title: 'Colores y Gradientes', href: '/shaders/colores-y-gradientes' },
    nextLesson: { title: 'Distorsiones', href: '/shaders/distorsiones' },
    readingTime: 9,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El secreto de lo orgánico</h3>
    <p>El mundo real no es perfecto. Las nubes, el humo, la madera y la piedra no están hechos de gradientes lineales, tienen una imperfección natural y un caos organizado. En Shaders, generar este caos se logra con algoritmos de <strong>Ruido (Noise)</strong>.</p>
    
    <h3>Perlin Noise y Simplex Noise</h3>
    <p>A diferencia de \`Math.random()\` (que genera estática de televisión fea y desconectada), el ruido Perlin genera valores aleatorios que son <em>suaves y continuos</em>. Si te mueves un milímetro a la derecha, el valor del ruido será muy parecido al actual, creando un patrón orgánico como manchas de vaca o topografía montañosa.</p>

    <h3>¿De dónde saco la función?</h3>
    <p>GLSL no tiene una función \`noise()\` incorporada. Tienes que copiar y pegar complejas funciones matemáticas públicas escritas por genios como Stefan Gustavson (autor del famoso Simplex Noise en GLSL) en tu Shader. Una vez pegada, la usas como \`noise(vUv * 10.0)\`.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Si animas las coordenadas que le pasas a la función de ruido con el tiempo (noise(vec3(vUv * 5.0, u_time))), las manchas parecerán hervir o fluir como lava, agua o humo." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    Simplex Noise en acción
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <ResultPreview description="Ruido Simplex animado por el tiempo. La base de casi todo efecto orgánico avanzado en web.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-noise">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-noise');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const fragmentShader = \`
      uniform float u_time;
      varying vec2 vUv;

      // GLSL textureless classic 3D noise "cnoise",
      // with an RSL-style periodic variant "pnoise".
      // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
      // Version: 2011-10-11
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

      float cnoise(vec3 P){
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
        return 2.2 * n_xyz;
      }

      void main() {
        // Escalar la UV para tener más "manchas"
        vec2 st = vUv * 3.0;

        // Le pasamos las coordenadas escaladas y el tiempo a la función de ruido 3D
        float noiseValue = cnoise(vec3(st, u_time * 0.4));
        
        // El ruido va de -1 a 1, lo pasamos a 0-1
        noiseValue = (noiseValue + 1.0) * 0.5;

        // Colores
        vec3 colorA = vec3(0.04, 0.06, 0.1);
        vec3 colorB = vec3(0.988, 0.364, 0.490); // Rosa
        
        // Añadimos escalones dramáticos
        noiseValue = smoothstep(0.4, 0.6, noiseValue);

        vec3 finalColor = mix(colorA, colorB, noiseValue);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    \`;

    const vertexShader = \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { u_time: { value: 0 } }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'distorsiones.astro',
    title: 'Distorsiones',
    lessonIndex: 10,
    prevLesson: { title: 'Ruido Procedural', href: '/shaders/ruido-procedural' },
    nextLesson: { title: 'Shaders Reactivos al Mouse', href: '/shaders/shaders-reactivos' },
    readingTime: 7,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Derritiendo la web</h3>
    <p>Uno de los efectos más premium que verás en agencias digitales de alto nivel es la distorsión de imágenes. Cuando pasas el ratón por encima de una foto de un proyecto y ésta se ondula como si estuviera bajo el agua.</p>
    
    <h3>¿Cómo se distorsiona una imagen?</h3>
    <p>La imagen se envía al shader como una textura (<code>uniform sampler2D u_image;</code>). En condiciones normales, lees el color de la textura usando <code>texture2D(u_image, vUv)</code>, pidiendo exactamente el color que corresponde a la coordenada actual.</p>
    
    <p>Pero... ¿qué pasa si le mientes a la función? ¿Qué pasa si le pasas unas UVs ligeramente desplazadas usando ruido o funciones seno?</p>

    <h3>La matemática del engaño</h3>
    <p>Si la coordenada actual es <code>(0.5, 0.5)</code> pero le dices a la textura que lea el color de <code>(0.5 + sin(time), 0.5)</code>, terminarás leyendo colores de otros lados de la imagen, creando un efecto óptico de ondulación líquida o distorsión sin modificar el archivo original ni el DOM.</p>
  </article>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Espejo de Agua
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <ResultPreview description="Generamos un mapa procedural en el Fragment y lo usamos para desviar la lectura de una textura.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-distort">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-distort');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Creamos un canvas con texto para usar como textura (ya que no queremos dependencias externas)
    const ctxCanvas = document.createElement('canvas');
    ctxCanvas.width = 512;
    ctxCanvas.height = 512;
    const ctx = ctxCanvas.getContext('2d');
    ctx.fillStyle = '#FC5D7D';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GENESIS', 256, 220);
    ctx.fillText('PIXEL', 256, 300);
    const texture = new THREE.CanvasTexture(ctxCanvas);
    
    const fragmentShader = \`
      uniform float u_time;
      uniform sampler2D u_texture;
      varying vec2 vUv;

      void main() {
        vec2 distortedUv = vUv;
        
        // Desplazamiento en X basado en Y y el tiempo
        distortedUv.x += sin(vUv.y * 10.0 + u_time) * 0.03;
        // Desplazamiento en Y basado en X y el tiempo
        distortedUv.y += cos(vUv.x * 10.0 + u_time) * 0.03;

        // Leemos la textura usando las coordenadas mentirosas
        vec4 textureColor = texture2D(u_texture, distortedUv);

        gl_FragColor = textureColor;
      }
    \`;

    const vertexShader = \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { 
        u_time: { value: 0 },
        u_texture: { value: texture }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      texture.dispose();
    }, { once: true });
  });
`
  }
];

const renderLayout = (lesson) => {
  return `---
import ShadersLayout from '../../layouts/ShadersLayout.astro';
import ChapterHeader from '../../components/ChapterHeader.astro';
import TabbedCodeBlock from '../../components/TabbedCodeBlock.astro';
import ResultPreview from '../../components/ResultPreview.astro';
import ConsejoProfesional from '../../components/ConsejoProfesional.astro';
import ErroresComunesV3 from '../../components/ErroresComunesV3.astro';
import PracticeCards from '../../components/PracticeCards.astro';
---

<ShadersLayout
  title="${lesson.title} - Genesis Pixel"
  currentLesson="/shaders/${lesson.filename.replace('.astro', '')}"
  ${lesson.prevLesson ? `prevLesson={{ title: '${lesson.prevLesson.title}', href: '${lesson.prevLesson.href}' }}` : ''}
  ${lesson.nextLesson ? `nextLesson={{ title: '${lesson.nextLesson.title}', href: '${lesson.nextLesson.href}' }}` : ''}
>
  <ChapterHeader
    chapterNumber="06"
    chapterLabel="Capítulo 6 · Lección ${lesson.lessonIndex}"
    title="${lesson.title}"
    readingTime="${lesson.readingTime}"
    difficulty="Shaders GLSL"
  />

${lesson.content}
</ShadersLayout>

<script>
${lesson.scripts}
</script>
`;
};

lessons.forEach(lesson => {
  const filePath = path.join(__dirname, 'src/pages/shaders', lesson.filename);
  fs.writeFileSync(filePath, renderLayout(lesson), 'utf8');
  console.log("Created " + lesson.filename);
});
