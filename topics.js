function createDynamicTopics() {
    const canvas = document.getElementById('topicsCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const topics = [
        { text: 'Artificial Intelligence', x: 200, y: 200 },
        { text: 'Software Engineering', x: 400, y: 150 },
        { text: 'IoT Systems', x: 300, y: 400 },
        { text: 'Virtual Reality', x: 600, y: 300 },
        { text: 'Augmented Reality', x: 500, y: 500 },
    ];

    const particles = [];

    // Create particles based on topics
    topics.forEach((topic) => {
        particles.push({
            ...topic,
            radius: window.innerWidth <= 768 ? 20 : 50, // Adjust size for smaller screens and desktop
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
        });
    });

    let mouse = {
        x: null,
        y: null,
        radius: 100, // Interaction radius
    };

    // Capture mouse position
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
            // Draw circle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#E09900';
            ctx.fill();

            // Draw text inside the circle
            ctx.font = `${Math.max(particle.radius / 3, 10)}px Arial`; // Ensure text is proportional
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textLines = particle.text.split(' '); // Split text into multiple lines
            textLines.forEach((line, index) => {
                ctx.fillText(line, particle.x, particle.y - (textLines.length / 2 - index) * 12);
            });
        });

        // Connect particles with lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(224, 153, 0, 0.2)';
                    ctx.stroke();
                }
            }
        }

        updateParticles();
    }

    function updateParticles() {
        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x + particle.radius > canvas.width) {
                particle.x = canvas.width - particle.radius;
                particle.vx = -particle.vx;
            }
            if (particle.x - particle.radius < 0) {
                particle.x = particle.radius;
                particle.vx = -particle.vx;
            }
            if (particle.y + particle.radius > canvas.height) {
                particle.y = canvas.height - particle.radius;
                particle.vy = -particle.vy;
            }
            if (particle.y - particle.radius < 0) {
                particle.y = particle.radius;
                particle.vy = -particle.vy;
            }

            // Interaction with mouse
            if (mouse.x && mouse.y) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius + particle.radius) {
                    const angle = Math.atan2(dy, dx);
                    const moveDistance = mouse.radius + particle.radius - distance;
                    particle.x -= Math.cos(angle) * moveDistance * 0.2;
                    particle.y -= Math.sin(angle) * moveDistance * 0.2;
                }
            }
        });
    }

    function animate() {
        drawParticles();
        requestAnimationFrame(animate);
    }

    animate();

    // Adjust particles position on page load for small screens
    if (window.innerWidth <= 768) {
        particles.forEach((particle, index) => {
            particle.x = canvas.width / 2 + (index % 2 === 0 ? -50 : 50); // Offset slightly for spacing
            particle.y = canvas.height / 2 + (index % 3 === 0 ? -50 : 50);
        });
    }

    // Update canvas size and particle size on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particles.forEach((particle, index) => {
            particle.radius = window.innerWidth <= 768 ? 20 : 50; // Adjust size on resize

            // Move particles closer to the center on small screens
            if (window.innerWidth <= 768) {
                particle.x = canvas.width / 2 + (index % 2 === 0 ? -50 : 50); // Offset slightly for spacing
                particle.y = canvas.height / 2 + (index % 3 === 0 ? -50 : 50);
            } else {
                // Ensure particles are within canvas bounds for larger screens
                particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
                particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));
            }
        });
    });
}

createDynamicTopics();
