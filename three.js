


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('heroCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Function to create dynamic textures with text
function createTextTexture(text, textColor, bgColor) {
    const canvas = document.createElement('canvas');
    const size = 512; // Texture size
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    context.fillStyle = bgColor;
    context.fillRect(0, 0, size, size);

    context.fillStyle = textColor;
    context.font = 'bold 70px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, size / 2, size / 2);

    return new THREE.CanvasTexture(canvas);
}

// Cube Geometry and Materials
const geometry = new THREE.BoxGeometry(20, 20, 20);
const materials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('/assets/estg-ipvc.png') }), // Image face
    new THREE.MeshBasicMaterial({ color: 0xE09900 }), 
    new THREE.MeshBasicMaterial({ map: createTextTexture('CIMEI 2025', '#FFFFFF', '#000000') }),
    new THREE.MeshBasicMaterial({ map: createTextTexture('27 Janeiro', '#FFFFFF', '#E09900') }), 
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF }), 
    new THREE.MeshBasicMaterial({ color: 0x000000 })  
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);


cube.position.z = -15;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);


camera.position.z = 20;
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.007;
    cube.rotation.y += 0.007;
    renderer.render(scene, camera);
}
animate();


// Responsive Canvas and Cube
function updateResponsiveCube() {
    const heroSection = document.getElementById('hero');
    const sectionWidth = heroSection.offsetWidth;
    const sectionHeight = heroSection.offsetHeight;


    renderer.setSize(sectionWidth, sectionHeight);
    camera.aspect = sectionWidth / sectionHeight;
    camera.updateProjectionMatrix();


    const scaleFactor = Math.min(sectionWidth, sectionHeight) / 500; 
    cube.scale.set(scaleFactor/2, scaleFactor/2, scaleFactor/2); 
}


window.addEventListener('resize', updateResponsiveCube);
updateResponsiveCube();



// FUNDO -------------------------------------------------------------------------------------
function createNeuralNetworkBackground() {
    const particleCount = 100;
    const range = 30; 

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xE09900, 
        size: 0.2,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
    });

 
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * range;
        positions[i * 3 + 1] = (Math.random() - 0.5) * range;
        positions[i * 3 + 2] = (Math.random() - 0.5) * range;

        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const linesGeometry = new THREE.BufferGeometry();
    const maxConnections = 30;
    let lineVertices = [];
    let lineIndices = [];

    function updateConnections() {
        lineVertices = [];
        lineIndices = [];

        for (let i = 0; i < particleCount; i++) {
            const xi = positions[i * 3];
            const yi = positions[i * 3 + 1];
            const zi = positions[i * 3 + 2];

            for (let j = i + 1; j < particleCount; j++) {
                const xj = positions[j * 3];
                const yj = positions[j * 3 + 1];
                const zj = positions[j * 3 + 2];

                const distance = Math.sqrt(
                    (xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2
                );

                if (distance < 5) {
                    lineVertices.push(xi, yi, zi, xj, yj, zj);
                    lineIndices.push(i, j);
                }
            }
        }

        linesGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(lineVertices, 3)
        );
    }

    const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lines);

    // Animate particles and connections
    function animateParticles() {
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] += velocities[i];

            if (positions[i] > range / 2 || positions[i] < -range / 2) {
                velocities[i] = -velocities[i]; // Reverse direction
            }
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        updateConnections();
        linesGeometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// Call the function
createNeuralNetworkBackground();

// -------------------------------------------------------------------------------------------------------------------

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Add event listeners for mouse interaction
document.addEventListener('mousedown', (e) => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        cube.rotation.y += deltaX * 0.01; // Rotate cube horizontally
        cube.rotation.x += deltaY * 0.01; // Rotate cube vertically
    }
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Add event listeners for touch interaction (mobile)
document.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
    };
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        cube.rotation.y += deltaX * 0.01; // Rotate cube horizontally
        cube.rotation.x += deltaY * 0.01; // Rotate cube vertically
    }
    previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
    };
});

document.addEventListener('touchend', () => {
    isDragging = false;
});
