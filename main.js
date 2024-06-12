import * as THREE from 'three'; // Importa la biblioteca THREE.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Importa el cargador GLTF para modelos 3D
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Importa los controles de órbita para la cámara

// Crea el renderer de WebGL con antialiasing activado
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; // Configura el espacio de color de salida

// Configura el tamaño del renderer
renderer.setSize(window.innerWidth, window.innerHeight);
// Establece el color de fondo del renderer
renderer.setClearColor(0x000000);
// Ajusta la relación de píxeles para dispositivos con alta densidad de píxeles
renderer.setPixelRatio(window.devicePixelRatio);

// Habilita las sombras y configura el tipo de mapa de sombras
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Añade el elemento canvas del renderer al documento
document.body.appendChild(renderer.domElement);

// Crea una nueva escena
const scene = new THREE.Scene();

// Configura la cámara con un campo de visión de 45 grados
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11); // Establece la posición de la cámara

// Crea los controles de órbita para la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilita el amortiguamiento
controls.enablePan = false; // Deshabilita el paneo
controls.minDistance = 5; // Distancia mínima de la cámara
controls.maxDistance = 20; // Distancia máxima de la cámara
controls.minPolarAngle = 0.5; // Ángulo polar mínimo
controls.maxPolarAngle = 1.5; // Ángulo polar máximo
controls.autoRotate = false; // Deshabilita la rotación automática
controls.target = new THREE.Vector3(0, 1, 0); // Establece el objetivo de los controles
controls.update(); // Actualiza los controles

// Crea la geometría y el material para el suelo
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2); // Rota la geometría del suelo
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false; // El suelo no proyecta sombras
groundMesh.receiveShadow = true; // El suelo recibe sombras
scene.add(groundMesh); // Añade el suelo a la escena

// Crea una luz spot y configura sus propiedades
const spotLight = new THREE.SpotLight('red', 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, 0); // Establece la posición de la luz
spotLight.castShadow = true; // Habilita la proyección de sombras
spotLight.shadow.bias = -0.0001; // Ajusta el sesgo de las sombras
scene.add(spotLight); // Añade la luz a la escena

// Crea un cargador GLTF y establece la ruta de los modelos
const loader = new GLTFLoader().setPath('public/millennium_falcon/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model'); // Muestra un mensaje al cargar el modelo
  const mesh = gltf.scene; // Obtiene la escena del modelo cargado

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true; // Habilita las sombras en las mallas del modelo
      child.receiveShadow = true; // Habilita la recepción de sombras en las mallas del modelo
    }
  });

  mesh.position.set(0, 1.05, -1); // Establece la posición del modelo
  scene.add(mesh); // Añade el modelo a la escena

  // Oculta el contenedor de progreso una vez que el modelo se ha cargado
  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  // Muestra el progreso de carga en la consola
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  // Muestra un mensaje de error en caso de fallo
  console.error(error);
});

// Ajusta el tamaño del renderer y la cámara cuando la ventana cambia de tamaño
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Función de animación
function animate() {
  requestAnimationFrame(animate); // Solicita el siguiente frame
  controls.update(); // Actualiza los controles
  renderer.render(scene, camera); // Renderiza la escena desde la perspectiva de la cámara
}

animate(); // Inicia la animación
