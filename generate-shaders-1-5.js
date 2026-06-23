const fs = require('fs');
const path = require('path');

const lessons = [
  {
    filename: 'que-son-los-shaders.astro',
    title: '¿Qué son los Shaders?',
    lessonIndex: 1,
    nextLesson: { title: 'Introducción a GLSL', href: '/shaders/introduccion-glsl' },
    readingTime: 6,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El siguiente nivel del desarrollo creativo</h3>
    <p>Hasta ahora, con Three.js, hemos sido directores de cine. Hemos colocado cámaras, luces y actores (geometrías y materiales) en una escena, y le hemos pedido a Three.js que renderice la película. Pero, ¿qué pasa cuando quieres crear un efecto que no existe en el catálogo de materiales predefinidos? ¿Qué pasa si quieres que un cubo se derrita como gelatina o que el mar tenga espuma reactiva?</p>
    
    <h3>¿Qué es un Shader?</h3>
    <p>Un Shader no es más que un pequeño programa que se ejecuta <strong>directamente en la Tarjeta Gráfica (GPU)</strong>, no en el Procesador (CPU) como el resto de tu código JavaScript.</p>
    <p>La CPU es como un profesor súper inteligente que puede resolver problemas matemáticos complejos uno por uno, muy rápido. La GPU es como un ejército de un millón de hormigas obreras. No son tan listas, pero pueden hacer la misma tarea sencilla al mismo tiempo. Los shaders aprovechan este ejército para calcular la posición y el color de millones de píxeles <strong>simultáneamente</strong>, 60 veces por segundo.</p>

    <h3>¿Para qué sirven?</h3>
    <p>Los shaders son el secreto detrás de las webs que ganan premios Awwwards. Sirven para:</p>
    <ul>
      <li>Distorsionar imágenes al pasar el ratón por encima.</li>
      <li>Crear gradientes fluidos y orgánicos que nunca se repiten.</li>
      <li>Generar partículas mágicas y simulaciones físicas ligeras.</li>
      <li>Modificar la geometría de un modelo 3D en tiempo real (ej. hacer que respire).</li>
    </ul>

    <h3>Los dos tipos principales</h3>
    <p>Para dibujar algo en pantalla usando shaders, necesitas trabajar en equipo con dos programas diferentes:</p>
    <ol>
      <li><strong>Vertex Shader:</strong> Se encarga de la <em>forma</em>. Mueve los vértices de tus geometrías.</li>
      <li><strong>Fragment Shader:</strong> Se encarga del <em>color</em>. Pinta los píxeles (fragmentos) que quedan entre esos vértices.</li>
    </ol>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Aprender Shaders requiere un cambio de mentalidad. Ya no programas con if/else o bucles for para cada cosa. Programas usando matemáticas puras (seno, coseno, vectores) para decirle a la GPU cómo calcular el estado final de un píxel ciego." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El poder de la GPU en acción
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <ResultPreview description="Este gradiente orgánico y fluido no es un video ni un Canvas 2D. Es un Fragment Shader calculando el color de cada píxel matemáticamente usando la posición y el tiempo.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-shaders-1">
      </div>
    </ResultPreview>
  </div>

  <div class="my-8 flex flex-col gap-6">
    <ErroresComunesV3 errors={[
      { label: 'Intentar usar console.log', description: 'El código de los shaders corre en la GPU. No hay consola. Si te equivocas en una letra, la pantalla se pondrá negra o roja y tendrás que deducir por qué leyendo errores crípticos del compilador de WebGL.' },
      { label: 'Pensar secuencialmente', description: 'En JavaScript puedes decir: "Pinta esto rojo, luego espera, luego píntalo azul". En Shaders, el programa se ejecuta para todos los píxeles a la vez en una fracción de milisegundo. Todo depende de fórmulas matemáticas basadas en el tiempo.' },
    ]} />

    <PracticeCards
      title="Resumen del Capítulo"
      description="Tu nuevo modelo mental."
      steps={[
        { number: 1, text: 'Un Shader es un programa escrito para la GPU.', color: 'dm-purple', rotate: '-3deg' },
        { number: 2, text: 'Vertex Shader = Controla la posición (forma).', color: 'dm-green', rotate: '2deg' },
        { number: 3, text: 'Fragment Shader = Controla los píxeles (color).', color: 'app-color-yellow400', rotate: '-5deg' },
      ]}
    />
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-shaders-1');
    if (!container) return;
    
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Shader Mágico de Introducción
    const fragmentShader = \`
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec3 color = vec3(0.0);
        
        // Matemáticas para colores orgánicos
        color.r = 0.5 + 0.5 * sin(u_time * 0.5 + uv.x * 5.0);
        color.g = 0.5 + 0.5 * cos(u_time * 0.6 + uv.y * 3.0);
        color.b = 0.8 + 0.2 * sin(u_time * 0.4 + uv.x * 2.0 + uv.y * 4.0);
        
        gl_FragColor = vec4(color, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
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
      material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
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
    filename: 'introduccion-glsl.astro',
    title: 'Introducción a GLSL',
    lessonIndex: 2,
    prevLesson: { title: '¿Qué son los Shaders?', href: '/shaders/que-son-los-shaders' },
    nextLesson: { title: 'Vertex Shaders', href: '/shaders/vertex-shaders' },
    readingTime: 8,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Un nuevo idioma: GLSL</h3>
    <p>Los Shaders no se escriben en JavaScript. Se escriben en <strong>GLSL</strong> (OpenGL Shading Language). Es un lenguaje muy parecido a C. Es fuertemente tipado, estricto y no perdona errores. Si olvidas un punto y coma (;), la pantalla se quedará negra.</p>
    
    <h3>Tipos de Datos (El casting estricto)</h3>
    <p>En JS puedes sumar <code>1 + 1.5</code> y no pasa nada. En GLSL, eso es un crimen que colapsa el programa. Tienes que ser explícito.</p>
    <ul>
      <li><code>int</code>: Números enteros (ej. <code>1</code>, <code>2</code>)</li>
      <li><code>float</code>: Números decimales (ej. <code>1.0</code>, <code>2.5</code>). <strong>Importante:</strong> Siempre pon el <code>.0</code> aunque sea un número cerrado.</li>
      <li><code>vec2</code>: Un vector de 2 dimensiones (x, y). Se usa para posiciones 2D o coordenadas UV.</li>
      <li><code>vec3</code>: Un vector de 3 dimensiones (x, y, z) o (r, g, b). Se usa para colores y posiciones 3D.</li>
      <li><code>vec4</code>: (x, y, z, w) o (r, g, b, a). El clásico para colores con opacidad (Alpha).</li>
    </ul>

    <h3>Swizzling: Magia con vectores</h3>
    <p>GLSL tiene un atajo maravilloso llamado "Swizzling". Si tienes un color <code>vec3 miColor = vec3(1.0, 0.0, 0.5);</code>, puedes acceder a sus canales usando <code>.rgb</code> o <code>.xyz</code>.</p>
    <p>Puedes extraer partes y mezclarlas como piezas de Lego: <code>vec2 rojoYVerde = miColor.rg;</code> o incluso invertirlas: <code>vec3 invertido = miColor.bgr;</code>.</p>

    <h3>La función main()</h3>
    <p>Todo shader GLSL DEBE tener una función llamada <code>void main() { ... }</code>. Es la puerta de entrada, lo primero que la GPU ejecutará. La palabra "void" significa que esta función no devuelve ningún valor con "return", sino que asigna un valor a una variable global especial (como <code>gl_FragColor</code>).</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Acostúmbrate a pensar en rangos normalizados. En diseño web estamos acostumbrados a RGB(255, 255, 255). En GLSL, los colores van de 0.0 a 1.0. El blanco es vec3(1.0, 1.0, 1.0) y el negro vec3(0.0, 0.0, 0.0)." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    Sintaxis GLSL
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="glsl-syntax"
      tabs={[
        { id: 'glsl', label: 'GLSL', code: "// Comentarios igual que en JS\n\nvoid main() {\n  // Casting estricto\n  float a = 1.0;\n  float b = 2.0;\n  float c = a + b;\n\n  // Declaración de un vector de color (RGB)\n  vec3 colorPurpura = vec3(0.6, 0.2, 1.0);\n  \n  // Convertirlo a vec4 añadiendo la opacidad (Alpha de 1.0)\n  vec4 colorFinal = vec4(colorPurpura, 1.0);\n\n  // Variable global de salida obligatoria en Fragment Shaders\n  gl_FragColor = colorFinal;\n}" }
      ]}
    />
    <ResultPreview description="El resultado de este Fragment Shader simple es un bloque de color sólido.">
      <div class="flex items-center justify-center h-full w-full bg-[#1a1a2e] overflow-hidden rounded-xl" id="demo-glsl">
      </div>
    </ResultPreview>
  </div>

  <div class="my-8 flex flex-col gap-6">
    <ErroresComunesV3 errors={[
      { label: 'Olvidar los flotantes', description: 'Escribir vec3(1, 0, 0) en lugar de vec3(1.0, 0.0, 0.0). Algunas tarjetas gráficas más permisivas lo aceptarán, pero fallará estrepitosamente en los iPhones de tus usuarios.' },
      { label: 'Variables no inicializadas', description: 'En JS si no defines el valor de algo, es undefined. En GLSL, tienes que darle valor a las variables al crearlas o tendrás comportamientos aleatorios en la GPU.' },
    ]} />
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-glsl');
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
      void main() {
        vec3 colorPurpura = vec3(0.6, 0.2, 1.0);
        gl_FragColor = vec4(colorPurpura, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({ fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, camera);

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'vertex-shaders.astro',
    title: 'Vertex Shaders',
    lessonIndex: 3,
    prevLesson: { title: 'Introducción a GLSL', href: '/shaders/introduccion-glsl' },
    nextLesson: { title: 'Fragment Shaders', href: '/shaders/fragment-shaders' },
    readingTime: 7,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Esculpiendo el espacio</h3>
    <p>Todo objeto en 3D está formado por puntos llamados <strong>Vértices</strong>. Una esfera tiene miles de vértices unidos por caras. Un plano tiene cuatro vértices en sus esquinas (o más, si lo subdivides).</p>
    
    <p>El <strong>Vertex Shader</strong> es un programa que la GPU ejecuta <em>una vez por cada vértice</em> que existe en tu geometría. Su único objetivo en la vida es responder a la pregunta: <em>"¿En qué coordenada exacta de la pantalla 2D del usuario debo dibujar este vértice 3D?"</em>.</p>

    <h3>La Variable Sagrada: gl_Position</h3>
    <p>Al final de tu Vertex Shader, debes asignar un <code>vec4</code> a la variable reservada <code>gl_Position</code>. Para llegar ahí, tienes que multiplicar la posición original del vértice (<code>position</code>) por tres matrices mágicas que Three.js nos provee automáticamente:</p>
    
    <ol>
      <li><strong>modelMatrix:</strong> Mueve el vértice desde el "centro de sí mismo" al "centro del mundo" (Scale, Rotation, Position del Mesh).</li>
      <li><strong>viewMatrix:</strong> Ajusta esa posición según dónde esté parada la Cámara en el mundo.</li>
      <li><strong>projectionMatrix:</strong> Aplica la perspectiva final (hace que lo lejano se vea más pequeño) para aplastar todo en la pantalla 2D.</li>
    </ol>

    <h3>Magia Procedural</h3>
    <p>Lo divertido del Vertex Shader es que, <strong>antes</strong> de multiplicar esas matrices, puedes hackear la variable <code>position</code> original matemáticamente. Por ejemplo, puedes sumar una onda sinusoidal a la posición Z de un plano, creando banderas ondeando al viento o agua realista, todo sin usar CPU.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Para deformar una geometría con el Vertex Shader, tu geometría base necesita tener suficientes vértices. Un BoxGeometry por defecto tiene solo 8 esquinas. Si intentas doblarlo por el centro con un Shader, no pasará nada porque no hay vértices en el medio para doblar." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    Modificando Vértices
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="vertex-shader"
      tabs={[
        { id: 'glsl', label: 'Vertex Shader', code: "uniform float u_time;\n\nvoid main() {\n  // 1. Copiamos la posición original en una variable que podamos modificar\n  vec3 newPosition = position;\n\n  // 2. MAGIA: Movemos el vértice en el eje Z usando una onda Sinusoidal basada en su eje X y el Tiempo\n  newPosition.z += sin(newPosition.x * 5.0 + u_time) * 0.2;\n\n  // 3. Proyección obligatoria de Three.js\n  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);\n  vec4 viewPosition = viewMatrix * modelPosition;\n  vec4 projectedPosition = projectionMatrix * viewPosition;\n\n  // 4. Salida\n  gl_Position = projectedPosition;\n}" }
      ]}
    />
    <ResultPreview description="Una esfera deformada usando puras matemáticas en el Vertex Shader.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-vertex" style="cursor: grab;">
      </div>
    </ResultPreview>
  </div>

  <div class="my-8 flex flex-col gap-6">
    <PracticeCards
      title="Practica lo Aprendido"
      description="Domina las formas tridimensionales."
      steps={[
        { number: 1, text: 'Recupera el atributo "position" por defecto de Three.js.', color: 'dm-purple', rotate: '-3deg' },
        { number: 2, text: 'Añade ruido o senos a sus coordenadas (X, Y o Z).', color: 'dm-green', rotate: '2deg' },
        { number: 3, text: 'Multiplica por las matrices Projection, View y Model.', color: 'app-color-yellow400', rotate: '-5deg' },
      ]}
    />
  </div>
`,
    scripts: `
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-vertex');
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

    // Alta densidad de vértices para que se deforme suave
    const geometry = new THREE.SphereGeometry(0.8, 64, 64);
    
    const vertexShader = \`
      uniform float u_time;
      void main() {
        vec3 pos = position;
        
        // Deformación: como si respirara o fuera un erizo bailando
        float wave = sin(pos.y * 10.0 + u_time) * 0.1;
        pos.x += wave * normal.x;
        pos.z += wave * normal.z;

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
      }
    \`;

    const fragmentShader = \`
      void main() {
        gl_FragColor = vec4(0.337, 0.69, 0.984, 1.0); // 57B0FB
      }
    \`;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 }
      },
      wireframe: true // Mostramos la malla para que se vea la deformación de vértices
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
      mesh.rotation.x += 0.005;
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
    filename: 'fragment-shaders.astro',
    title: 'Fragment Shaders',
    lessonIndex: 4,
    prevLesson: { title: 'Vertex Shaders', href: '/shaders/vertex-shaders' },
    nextLesson: { title: 'Uniforms', href: '/shaders/uniforms' },
    readingTime: 7,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>Los pintores de la GPU</h3>
    <p>Si el Vertex Shader acomodó las esquinas de tu plano en la pantalla, ahora tienes un espacio vacío entre esos vértices. Aquí entra el <strong>Fragment Shader</strong>. La GPU lo ejecutará ciegamente millones de veces, <em>una vez por cada píxel (fragmento)</em> que forme parte de esa geometría en tu monitor.</p>
    
    <p>Su única misión en la vida es responder: <em>"¿Qué color RGBA le asigno a este píxel microscópico?"</em>.</p>

    <h3>La Variable Sagrada: gl_FragColor</h3>
    <p>Todo el código de tu Fragment Shader converge en un solo objetivo: construir un vector de 4 dimensiones (R, G, B, Alpha) y entregárselo a la variable reservada de salida <code>gl_FragColor</code>.</p>

    <h3>Pintar a ciegas</h3>
    <p>Imagina que tienes un millón de empleados trabajando en habitaciones oscuras sin verse entre ellos. Les dices: "Pinta de rojo si estás en la coordenada X mayor a 0.5". Ellos no saben qué están dibujando en conjunto. Tu habilidad en Fragment Shaders es inventar reglas matemáticas basadas en coordenadas para que, al ver a todos los empleados juntos, formen una imagen, una textura o un gradiente.</p>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="En un Material normal de Three.js (MeshStandardMaterial), Three.js inyecta toneladas de código de Fragment Shader complejo por debajo para calcular las sombras, luces y reflejos. Cuando usas un ShaderMaterial personalizado, TODO eso desaparece. Eres tú contra el negro puro. Tendrás que dibujar tu propia luz (o aprender a importar los 'chunks' de Three.js)." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Gradiente por Coordenadas
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="fragment-shader"
      tabs={[
        { id: 'glsl', label: 'Fragment Shader', code: "void main() {\n  // gl_FragCoord.xy nos da las coordenadas del píxel en la pantalla\n  // Aquí creamos una lógica inventada: \n  // Si la X es pequeña, será menos rojo.\n  // Haremos cálculos estáticos.\n\n  vec3 colorA = vec3(0.98, 0.36, 0.49); // Rosa FC5D7D\n  vec3 colorB = vec3(0.34, 0.69, 0.98); // Azul 57B0FB\n\n  // Dividimos la coordenada actual por una resolución ficticia para obtener un % entre 0 y 1\n  float mixValue = gl_FragCoord.x / 800.0;\n\n  // mix() es una función de GLSL equivalente a lerp o transiciones\n  vec3 colorFinal = mix(colorA, colorB, mixValue);\n\n  gl_FragColor = vec4(colorFinal, 1.0);\n}" }
      ]}
    />
    <ResultPreview description="Mezclando dos colores según en qué píxel X de la pantalla esté trabajando el shader.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-fragment">
      </div>
    </ResultPreview>
  </div>

  <div class="my-8 flex flex-col gap-6">
    <PracticeCards
      title="Practica lo Aprendido"
      description="Sé el maestro del color."
      steps={[
        { number: 1, text: 'Comprende que el Fragment se ejecuta por cada píxel.', color: 'dm-purple', rotate: '-3deg' },
        { number: 2, text: 'Aprende a usar la función mix(colorA, colorB, porcentaje) en GLSL.', color: 'dm-green', rotate: '2deg' },
        { number: 3, text: 'Asigna el color a la variable vec4 gl_FragColor.', color: 'app-color-yellow400', rotate: '-5deg' },
      ]}
    />
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-fragment');
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
      uniform vec2 u_resolution;
      
      void main() {
        // Normalizamos la coordenada del pixel de 0.0 a 1.0
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        vec3 colorA = vec3(0.988, 0.364, 0.490); // FC5D7D
        vec3 colorB = vec3(0.623, 0.650, 1.0);   // 9FA6FF

        // st.x es 0 en la izquierda, y 1 en la derecha
        vec3 color = mix(colorA, colorB, st.x);

        gl_FragColor = vec4(color, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms: {
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, camera);

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    }, { once: true });
  });
`
  },
  {
    filename: 'uniforms.astro',
    title: 'Uniforms',
    lessonIndex: 5,
    prevLesson: { title: 'Fragment Shaders', href: '/shaders/fragment-shaders' },
    nextLesson: { title: 'Varyings', href: '/shaders/varyings' },
    readingTime: 8,
    content: `
  <article class="prose prose-invert max-w-none" style="margin-top: 64px;">
    <h3>El mensajero de la CPU a la GPU</h3>
    <p>Hemos visto que los Shaders corren aislados en la GPU haciendo puras matemáticas. Pero, ¿qué pasa si quieres que el color cambie basado en un <code>input</code> de React en tu página? ¿O qué pasa si quieres que un plano se anime con el paso del tiempo?</p>
    <p>El Shader está ciego y no tiene acceso a las variables globales de JavaScript, ni a <code>Date.now()</code>, ni a <code>window.innerWidth</code>.</p>
    
    <h3>¿Qué es un Uniform?</h3>
    <p>Un <strong>Uniform</strong> es una variable de "solo lectura" que enviamos <em>desde</em> nuestro código JavaScript (CPU) <em>hacia</em> el código del Shader (GPU). Se llama "uniform" porque su valor es uniforme (es el mismo) para todos los millones de píxeles y vértices procesados en ese frame exacto.</p>

    <h3>Los clásicos: u_time y u_resolution</h3>
    <p>Hay dos uniforms que usarás en el 99% de tus shaders creativos:</p>
    <ul>
      <li><strong>u_time (float):</strong> Le mandas el tiempo transcurrido desde Three.js para usarlo en funciones seno/coseno dentro del shader y darle vida y movimiento a la escena.</li>
      <li><strong>u_resolution (vec2):</strong> Le mandas el ancho y alto del <code>&lt;canvas&gt;</code> para que el shader sepa mantener la proporción de los dibujos en la pantalla y no aplastarlos al redimensionar la ventana.</li>
    </ul>
  </article>

  <div class="my-8 not-prose">
    <ConsejoProfesional tip="Enviar Uniforms no es gratis. Tienen un costo de comunicación entre el procesador y la tarjeta gráfica. Si vas a enviar variables de JavaScript (como la posición del ratón o el scroll), hazlo dentro del bucle requestAnimationFrame usando 'material.uniforms.u_mouse.value = X'." />
  </div>

  <h3 class="mb-8 mt-12 text-center font-medium text-[var(--color-text)]">
    El Puente entre JS y GLSL
  </h3>

  <div class="mb-6 flex flex-col gap-6 lg:flex-row">
    <TabbedCodeBlock
      group="uniforms"
      tabs={[
        { id: 'js', label: 'JavaScript', code: "import * as THREE from 'three';\n\n// 1. Declarar Uniforms en el Material\nconst material = new THREE.ShaderMaterial({\n  vertexShader,\n  fragmentShader,\n  uniforms: {\n    u_time: { value: 0.0 },\n    u_color: { value: new THREE.Color('#FC5D7D') }\n  }\n});\n\nconst clock = new THREE.Clock();\n\nfunction animate() {\n  requestAnimationFrame(animate);\n  \n  // 2. Actualizar el Uniform del tiempo cada frame!\n  material.uniforms.u_time.value = clock.getElapsedTime();\n  \n  renderer.render(scene, camera);\n}" },
        { id: 'glsl', label: 'Fragment Shader', code: "// 3. Recibir las variables en GLSL usando 'uniform'\nuniform float u_time;\nuniform vec3 u_color;\n\nvoid main() {\n  // Hacer palpitar el color oscuro a claro usando un Seno del tiempo\n  float palpito = (sin(u_time * 2.0) + 1.0) / 2.0;\n  \n  vec3 colorFinal = u_color * palpito;\n  gl_FragColor = vec4(colorFinal, 1.0);\n}" }
      ]}
    />
    <ResultPreview description="El color late porque el JS le está enviando un valor constante de u_time que aumenta cada frame.">
      <div class="flex items-center justify-center h-full w-full bg-[#111] overflow-hidden rounded-xl" id="demo-uniforms">
      </div>
    </ResultPreview>
  </div>

  <div class="my-8 flex flex-col gap-6">
    <ErroresComunesV3 errors={[
      { label: 'El Shader no compila', description: 'Olvidaste usar la palabra reservada "uniform" antes de declarar la variable dentro del código GLSL, o los tipos de datos no coinciden (mandaste un new THREE.Color() desde JS pero lo recibiste como float en GLSL).' },
    ]} />
  </div>
`,
    scripts: `
  import * as THREE from 'three';

  document.addEventListener('astro:page-load', () => {
    const container = document.getElementById('demo-uniforms');
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
      uniform vec3 u_color;
      
      void main() {
        // Rango de -1 a 1 convertido a 0.2 a 1.0
        float opacityPulse = (sin(u_time * 3.0) + 1.0) * 0.4 + 0.2;
        gl_FragColor = vec4(u_color * opacityPulse, 1.0);
      }
    \`;

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_color: { value: new THREE.Color(0xFC5D7D) } // Rosa de Genesis Pixel
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
