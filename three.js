


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('heroCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);


function createTextTexture(text, textColor, bgColor) {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    context.fillStyle = bgColor;
    context.fillRect(0, 0, size, size);

    context.fillStyle = textColor;
    context.font = 'bold 43px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';


    const lines = text.split('\n');
    const lineHeight = 50;
    const startY = size / 2 - (lines.length - 1) * (lineHeight / 2);

    lines.forEach((line, index) => {
        context.fillText(line, size / 2, startY + index * lineHeight);
    });

    return new THREE.CanvasTexture(canvas);
}


const geometry = new THREE.BoxGeometry(20, 20, 20);
const materials = [
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/assets/estg-ipvc.png'),
    }),

    new THREE.MeshBasicMaterial({ color: 0xE09900 }),

    new THREE.MeshBasicMaterial({
        map: createTextTexture(
            'Mestrado em Engenharia\nInformática',
            '#FFFFFF',
            'rgba(255, 166, 1, 0.66)'
        ),
    }),

    new THREE.MeshBasicMaterial({
        map: createTextTexture('30 Janeiro', '#FFFFFF', '#E09900'),
    }),

    new THREE.MeshBasicMaterial({
        map: createTextTexture(
            'Hora de início: 18h\nHora de fim: 21h',
            '#FFFFFF',
            'rgb(247, 198, 54)'
        ),
    }),

    new THREE.MeshBasicMaterial({ color: 0xFFD700 }),
];



const cube = new THREE.Mesh(geometry, materials);



cube.position.z = -10;
cube.renderOrder = 1;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);


camera.position.z = 20;
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;



    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
}
animate();



function updateResponsiveCube() {
    const heroSection = document.getElementById('hero');
    const sectionWidth = heroSection.offsetWidth;
    const sectionHeight = heroSection.offsetHeight;


    renderer.setSize(sectionWidth, sectionHeight);
    camera.aspect = sectionWidth / sectionHeight;
    camera.updateProjectionMatrix();


    const scaleFactor = Math.min(sectionWidth, sectionHeight) / 500;
    cube.scale.set(scaleFactor / 2, scaleFactor / 2, scaleFactor / 2);
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
        transparent: true,
        depthTest: false,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        depthTest: false,
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
    particles.renderOrder = 0;
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
    lines.renderOrder = 0;
    scene.add(lines);





    function animateParticles() {
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] += velocities[i];

            if (positions[i] > range / 2 || positions[i] < -range / 2) {
                velocities[i] = -velocities[i];
            }
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        updateConnections();
        linesGeometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}


createNeuralNetworkBackground();
scene.add(cube);
// -------------------------------------------------------------------------------------------------------------------

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };



document.addEventListener('mousedown', (e) => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        cube.rotation.y += deltaX * 0.01;
        cube.rotation.x += deltaY * 0.01;
    }
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});


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

        cube.rotation.y += deltaX * 0.01;
        cube.rotation.x += deltaY * 0.01;
    }
    previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
    };
});

document.addEventListener('touchend', () => {
    isDragging = false;
});
