document.addEventListener("DOMContentLoaded", () => {
    console.log("CIMEI 2025 Website Loaded");
});

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {

                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: targetElement.offsetTop - 50 },
                    ease: "power2.out"
                });

                gsap.fromTo(targetElement, {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        });
    });
});

