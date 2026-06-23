const fs = require('fs');
const path = require('path');

const lessons = [
  {
    filename: 'shaders-reactivos.astro',
    title: 'Shaders Reactivos al Mouse',
    lessonIndex: 11,
    prevLesson: { title: 'Distorsiones', href: '/shaders/distorsiones' },
    nextLesson: { title: 'Shaders Animados', href: '/shaders/shaders-animados' },
    readingTime: 6,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Tocando el Canvas</h3>
    <p>Hemos animado nuestros shaders con el tiempo (<code>u_time</code>). Eso los hace estar vivos. Pero para que la experiencia sea verdaderamente inmersiva y premium, el shader debe reaccionar a las acciones del usuario. La interacción número uno en web de escritorio es el movimiento del ratón.</p>
    
    <h3>El Uniform del Mouse</h3>
    <p>Para lograr esto, necesitamos enviar un nuevo <code>uniform</code> desde nuestro archivo JavaScript hacia la GPU. Lo llamaremos <code>u_mouse</code> y será un vector de dos dimensiones (<code>vec2</code>).</p>
    
    <h3>Normalización: El secreto</h3>
    <p>La posición del ratón en la pantalla del usuario puede ser (1920, 1080) píxeles. Si mandamos esos números brutos a un shader que trabaja con coordenadas UV entre 0.0 y 1.0, el shader se volverá loco. <strong>Siempre debes normalizar</strong> la posición del ratón en JS dividiendo la coordenada actual entre el ancho o alto total de la ventana.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="En lugar de enviar la posición exacta y fría del ratón en cada frame, usa una función de interpolación lineal (Lerp) en tu archivo JavaScript. Esto hará que el shader persiga al cursor con un pequeño retraso suave, dándole una sensación fluida y lujosa a la interacción." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Cursor como Linterna
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="mouse-reactive"
      tabs={[
        { id: 'js', label: 'JavaScript', code: "let targetMouse = new THREE.Vector2();\nlet currentMouse = new THREE.Vector2();\n\nwindow.addEventListener('mousemove', (e) => {\n  // Normalizamos de 0 a 1\n  targetMouse.x = e.clientX / window.innerWidth;\n  targetMouse.y = 1.0 - (e.clientY / window.innerHeight);\n});\n\nfunction animate() {\n  // Lerp para suavidad premium (Inercia)\n  currentMouse.lerp(targetMouse, 0.05);\n  material.uniforms.u_mouse.value = currentMouse;\n}" },
        { id: 'glsl', label: 'Fragment Shader', code: "uniform vec2 u_mouse;\nvarying vec2 vUv;\n\nvoid main() {\n  // Distancia entre el píxel actual y el ratón\n  float dist = distance(vUv, u_mouse);\n\n  // Invertimos: luz intensa cerca (dist = 0), oscura lejos\n  float luz = 1.0 - smoothstep(0.0, 0.3, dist);\n\n  vec3 colorFondo = vec3(0.04, 0.06, 0.1);\n  vec3 colorLuz = vec3(0.34, 0.69, 0.98); // Azul brillante\n\n  gl_FragColor = vec4(mix(colorFondo, colorLuz, luz), 1.0);\n}" }
      ]}
    />
    <ResultPreview description="Pasa el ratón por el área. El Fragment Shader reacciona en tiempo real, calculando la distancia a tu cursor suavizado.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-mouse" style="cursor: crosshair;">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-mouse');
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
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      varying vec2 vUv;

      void main() {
        // Compensamos el aspect ratio para que el círculo no se vuelva un óvalo
        vec2 st = vUv;
        vec2 m = u_mouse;
        
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;
        m.x *= aspect;

        float dist = distance(st, m);
        float luz = 1.0 - smoothstep(0.0, 0.3, dist);

        vec3 colorFondo = vec3(0.04, 0.06, 0.1);
        vec3 colorLuz = vec3(0.34, 0.69, 0.98); // 57B0FB

        // Añadimos un poco de ruido de fondo
        float grid = sin(vUv.x * 100.0) * sin(vUv.y * 100.0);
        colorFondo += grid * 0.02;

        gl_FragColor = vec4(mix(colorFondo, colorLuz, luz), 1.0);
      }
    \`;

    const vertexShader = \`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    \`;

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { 
        u_mouse: { value: currentMouse },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      targetMouse.x = x / container.clientWidth;
      targetMouse.y = 1.0 - (y / container.clientHeight);
    };
    container.addEventListener('mousemove', onMouseMove);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Interpolación lineal (Lerp) manual
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
      
      material.uniforms.u_mouse.value = currentMouse;
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'shaders-animados.astro',
    title: 'Shaders Animados',
    lessonIndex: 12,
    prevLesson: { title: 'Shaders Reactivos al Mouse', href: '/shaders/shaders-reactivos' },
    nextLesson: { title: 'Efectos Visuales Avanzados', href: '/shaders/efectos-visuales' },
    readingTime: 6,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El reloj de la GPU</h3>
    <p>Hemos usado el tiempo antes, pero aquí profundizaremos en su poder. Un <code>u_time</code> que se incrementa en cada frame es el motor absoluto de la vida en los Shaders. Funciona como un contador de segundos desde que la página cargó.</p>
    
    <h3>El poder de las funciones periódicas</h3>
    <p>Si multiplicas una coordenada UV por el tiempo (<code>vUv.x * u_time</code>), el shader explotará visualmente en un borrón estroboscópico casi de inmediato. El tiempo crece hasta el infinito. Necesitas atrapar el tiempo en un ciclo repetitivo.</p>
    <p>Aquí es donde brillan las funciones matemáticas como <code>sin()</code>, <code>cos()</code>, o <code>fract()</code>. Un <code>sin(u_time)</code> garantiza que, sin importar cuánto avance el reloj, tu valor siempre estará rebotando suavemente entre -1.0 y 1.0 en un loop perfecto.</p>

    <h3>Animación Espacial</h3>
    <p>Si mezclas <code>u_time</code> con las coordenadas espaciales (<code>vUv.y + u_time</code>), creas un efecto de desplazamiento continuo. Es la base de las cascadas, los túneles infinitos y el fuego.</p>
  </article>

  <div class="my-8 flex flex-col gap-6">
    <ErroresComunesV3 errors={[
      { label: 'Multiplicar el tiempo a lo loco', description: 'u_time crece constante. Si haces sin(u_time * 100.0), el shader parpadeará epilépticamente. Usa multiplicadores pequeños: sin(u_time * 0.5) para una respiración calmada.' },
    ]} />

    <PracticeCards
      title="Practica lo Aprendido"
      description="Domina el pulso del tiempo."
      steps={[
        { number: 1, text: 'Instancia un THREE.Clock() en JS y pasa su getElapsedTime() al u_time.', color: 'dm-purple', rotate: '-3deg' },
        { number: 2, text: 'Usa sin(u_time) para modificar un color o escalar un radio gradualmente.', color: 'dm-green', rotate: '2deg' },
        { number: 3, text: 'Usa fract(vUv.x - u_time) para crear un patrón de líneas que se muevan hacia la derecha.', color: 'app-color-yellow400', rotate: '-5deg' },
      ]}
    />
  </div>
`,
    scripts: `
  // Demo intencionalmente en blanco o simbólica ya que es un concepto matemático explicado
  // document.addEventListener('astro:page-load', () => { ... });
`
  },
  {
    filename: 'efectos-visuales.astro',
    title: 'Efectos Visuales Avanzados',
    lessonIndex: 13,
    prevLesson: { title: 'Shaders Animados', href: '/shaders/shaders-animados' },
    nextLesson: { title: 'Integración con Three.js', href: '/shaders/integracion-threejs' },
    readingTime: 8,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El arsenal de trucos del Motion Designer</h3>
    <p>Los grandes efectos (Hologramas, Glitch, Aberración Cromática, Neón) rara vez son una sola fórmula secreta. Suelen ser la combinación de técnicas que ya aprendiste: coordenadas UV, ruido, tiempo y matemáticas puras.</p>
    
    <h3>Aberración Cromática (RGB Split)</h3>
    <p>Un efecto muy popular en el cyberpunk y el desarrollo creativo moderno. Consiste en separar ligeramente los canales Rojo, Verde y Azul de una imagen o textura.</p>
    <p>En lugar de leer la textura una sola vez, la lees TRES veces en tu Fragment Shader, usando UVs ligeramente desplazadas para cada canal.</p>

    <h3>Hologramas y Escaneos</h3>
    <p>Se logran tomando el eje Y de la coordenada UV (<code>vUv.y</code>), multiplicándolo por una gran cantidad para crear muchas bandas, y usando funciones como <code>sin()</code> combinadas con <code>step()</code> y <code>u_time</code> para hacer que las líneas suban constantemente.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Estos efectos son visualmente potentes pero matemáticamente pesados. Leer una textura 3 veces por cada píxel para un glitch cuesta el triple de recursos gráficos que leerla una vez. En móvil, esto puede bajar los FPS a la mitad. Úsalo con sabiduría y solo en los elementos hero." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Efecto Holograma Glitch
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <ResultPreview description="Mezclamos líneas de escaneo animadas, ruido y separación RGB para crear un material futurista.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-fx" style="cursor: grab;">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-fx');
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

    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
    
    const vertexShader = \`
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    \`;

    const fragmentShader = \`
      uniform float u_time;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // Efecto Scanline basado en la posición en Y y el tiempo
        float scanline = sin(vPosition.y * 50.0 - u_time * 10.0);
        // Hacemos que sea una línea delgada y filosa
        scanline = smoothstep(0.8, 1.0, scanline);

        // Color base azul neón
        vec3 colorBase = vec3(0.34, 0.69, 0.98); // 57B0FB
        
        // Sumamos el blanco del scanline
        vec3 finalColor = colorBase + vec3(scanline * 0.5);

        // Efecto holograma: hacemos los bordes más brillantes y el centro transparente
        float rim = smoothstep(0.0, 0.5, abs(vUv.x - 0.5) * 2.0);

        gl_FragColor = vec4(finalColor, rim * 0.8 + 0.2);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { u_time: { value: 0 } },
      transparent: true,
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
    filename: 'integracion-threejs.astro',
    title: 'Integración con Three.js',
    lessonIndex: 14,
    prevLesson: { title: 'Efectos Visuales Avanzados', href: '/shaders/efectos-visuales' },
    nextLesson: { title: 'Proyecto Final de Shaders', href: '/shaders/proyecto-final' },
    readingTime: 7,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Uniendo los dos mundos</h3>
    <p>Escribir Shaders puros en un archivo de texto es genial para aprender, pero en el mundo real, los vas a inyectar en mallas, luces y cámaras de Three.js. El componente principal que te permite hacer esto es <code>THREE.ShaderMaterial</code>.</p>
    
    <h3>El ShaderMaterial</h3>
    <p>Es un material como <code>MeshBasicMaterial</code>, pero te da una hoja en blanco. Le pasas un string de tu <code>vertexShader</code>, un string de tu <code>fragmentShader</code> y un objeto con tus <code>uniforms</code>.</p>
    
    <h3>Hackeando materiales existentes</h3>
    <p>¿Qué pasa si quieres que tu objeto mantenga las sombras y el sistema de luces hiperrealista de Three.js (MeshStandardMaterial) pero quieres hacer que los vértices se deformen como olas?</p>
    <p>No puedes usar ShaderMaterial porque perderías todas las luces. El truco avanzado es usar <code>onBeforeCompile</code>. Es un método que te permite inyectar código GLSL dentro de los materiales predefinidos de Three.js justo antes de que se compilen hacia la tarjeta gráfica. Es un terreno oscuro pero inmensamente poderoso.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="En lugar de escribir tus shaders como largas y feas strings en tu archivo JavaScript, usa bloques de backticks \` \` o impórtalos como archivos .glsl separados usando Vite (import vertexShader from './miShader.vert?raw'). Mantendrá tu código limpio e inteligente." />
  </div>

  <div class="my-8 flex flex-col gap-6">
    <ErroresComunesV3 errors={[
      { label: 'Luces ignoradas', description: 'Tu ShaderMaterial no reacciona a los DirectionalLights de tu escena. Es normal. Un ShaderMaterial puro no sabe qué es una luz a menos que tú programes la matemática de iluminación Lambert o Phong a mano. Si necesitas luces, investiga onBeforeCompile.' },
    ]} />
  </div>
`,
    scripts: `
  // Conceptos teóricos avanzados, demo omitida.
`
  },
  {
    filename: 'proyecto-final.astro',
    title: 'Proyecto Final de Shaders',
    lessonIndex: 15,
    prevLesson: { title: 'Integración con Three.js', href: '/shaders/integracion-threejs' },
    readingTime: 10,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El Arquitecto del Lienzo Digital</h3>
    <p>Has conquistado el nivel más profundo y técnico del diseño web interactivo. Entendiste cómo engañar a la geometría deformando sus vértices, cómo pintar un millón de píxeles al mismo tiempo usando matemáticas, y cómo usar ruido para simular la vida orgánica de la naturaleza.</p>
    
    <h3>El Proyecto: El Espejo Dimensional</h3>
    <p>Crearemos el clásico fondo hero de un portfolio Awwwards moderno. No usaremos ningún modelo 3D descargado. Usaremos una simple esfera hiper-subdividida y la destruiremos de forma procedural usando Shaders.</p>
    <p>Le inyectaremos ruido Perlin 3D en su Vertex Shader para que palpite y se deforme constantemente. En el Fragment Shader mezclaremos nuestros colores de marca para darle un aspecto viscoso o líquido.</p>

    <h3>Requisitos Técnicos</h3>
    <ul class="space-y-2 list-disc pl-6 mb-6">
      <li><strong>Esfera HD:</strong> Una <code>IcosahedronGeometry</code> con al menos 64 detalles para que los vértices tengan espacio de moverse suavemente.</li>
      <li><strong>Ruido Vertex:</strong> Usa ruido 3D en el <code>position</code> para deformar la malla. Añade <code>u_time</code> a las coordenadas del ruido para que hierva.</li>
      <li><strong>Normalización:</strong> En el Fragment Shader, usa la elevación o las normales distorsionadas para mezclar los colores.</li>
    </ul>

    <h3>El Veredicto Final</h3>
    <p>Un shader no es magia negra, es una caja de herramientas matemáticas. No necesitas ser un genio matemático para usarlos; necesitas intuición visual, paciencia y no tener miedo de multiplicar variables por 0.5 a ver qué pasa. Este es el camino del Creative Developer.</p>
  </article>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Orbe Procedural (Portfolio Ready)
  </h3>

  <div class="mb-6 flex flex-col gap-6">
    <ResultPreview description="Una esfera deformada completamente por matemáticas de ruido 3D tanto en su geometría como en su color.">
      <div class="flex items-center justify-center h-full w-full bg-[#0a0a14] overflow-hidden rounded-xl" id="demo-final" style="height: 500px; cursor: grab;">
      </div>
    </ResultPreview>
  </div>
`,
    scripts: `
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-final');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const geometry = new THREE.IcosahedronGeometry(1.2, 128); // Súper alta definición
    
    const vertexShader = \`
      uniform float u_time;
      varying vec2 vUv;
      varying float vDistortion;

      // Classic Perlin 3D Noise by Stefan Gustavson
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

      float cnoise(vec3 P){
        vec3 Pi0 = floor(P);
        vec3 Pi1 = Pi0 + vec3(1.0);
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
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
        vUv = uv;
        
        // Deformar vértices basándonos en su posición normalizada (normal) y el ruido
        float noise = cnoise(normal * 2.0 + u_time * 0.5);
        
        // vDistortion va a ser enviado al Fragment Shader
        vDistortion = noise;

        vec3 newPosition = position + normal * (noise * 0.3);

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
      }
    \`;

    const fragmentShader = \`
      varying vec2 vUv;
      varying float vDistortion;
      uniform float u_time;

      void main() {
        // Normalizar la distorsión
        float intensity = (vDistortion + 1.0) * 0.5;

        // Paleta Genesis Pixel
        vec3 colorDark = vec3(0.04, 0.06, 0.1);
        vec3 colorBlue = vec3(0.34, 0.69, 0.98); // 57B0FB
        vec3 colorPink = vec3(0.988, 0.364, 0.490); // FC5D7D
        
        // Mezclamos basados en la intensidad de la deformación física!
        vec3 mix1 = mix(colorDark, colorBlue, smoothstep(0.0, 0.6, intensity));
        vec3 finalColor = mix(mix1, colorPink, smoothstep(0.5, 1.0, intensity));

        // Un brillo interior usando el borde
        float fresnel = dot(vec3(0.0, 0.0, 1.0), vec3(vUv.x - 0.5, vUv.y - 0.5, 1.0));
        finalColor += vec3(fresnel * 0.1);

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
      
      // Rotamos el orbe completo sutilmente
      mesh.rotation.y += 0.002;
      mesh.rotation.x += 0.002;
      
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
