// ======================================
// Shared Includes
// ======================================

async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();

        element.innerHTML = html;

    } catch (error) {

        console.error(error);

    }

}


// ======================================
// Main Initialization
// ======================================

document.addEventListener('DOMContentLoaded', async () => {

    // Load shared components

    await Promise.all([

        loadComponent("header", "/includes/header.html"),
        loadComponent("navbar", "/includes/nav.html"),
        loadComponent("footer", "/includes/footer.html"),
        loadComponent("lightbox-container", "/includes/lightbox.html")

    ]);


    // ======================================
    // Expandable Cards
    // ======================================

    document.querySelectorAll('.expandable-card').forEach(card => {

        card.addEventListener('click', (e) => {

            if (
                e.target.tagName === 'IMG' ||
                e.target.closest('.project-gallery')
            ) {
                return;
            }

            card.classList.toggle('expanded');

        });

    });

    // ======================================
    // Infinite auto-scroll
    // ======================================
    const galleries = document.querySelectorAll('.project-gallery');

    galleries.forEach(gallery => {
        let isDown = false;
        let isPausedByDrag = false; // Tracks the 3-second delay state
        let scrollTimeout;          // Holds the timer ID
        let startX;
        let scrollLeft;

        requestAnimationFrame(() => {
            const shouldLoop = gallery.scrollWidth > gallery.clientWidth;
            if (!shouldLoop) return;

            gallery.classList.add("scrolling");

            const originals = Array.from(gallery.children);
            originals.forEach(img => {
                gallery.appendChild(img.cloneNode(true));
            });

            setInterval(() => {
                // Pause if hovering, actively dragging, OR during the 3-second recovery delay
                if (gallery.matches(':hover') || isDown || isPausedByDrag) return;

                gallery.scrollLeft += 1;

                if (gallery.scrollLeft >= gallery.scrollWidth / 2) {
                    gallery.scrollLeft = 0;
                }
            }, 30);
        });

        // Helper function to handle the 3-second pause after drag ends
        const startPauseTimer = () => {
            if (!isDown) return; // Only trigger if they were actually dragging
            isDown = false;
            isPausedByDrag = true;

            // Clear any old, overlapping timers
            clearTimeout(scrollTimeout);

            // Wait 3000 milliseconds (3 seconds) before resuming
            scrollTimeout = setTimeout(() => {
                isPausedByDrag = false;
            }, 3000);
        };

        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            isPausedByDrag = false; // Reset pause if they click back down quickly
            clearTimeout(scrollTimeout);
            gallery.classList.add('active');
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });

        // Trigger the 3-second pause when user releases or leaves the gallery boundary
        gallery.addEventListener('mouseleave', startPauseTimer);
        gallery.addEventListener('mouseup', startPauseTimer);

        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 2;
            gallery.scrollLeft = scrollLeft - walk;
        });
    });

    // ======================================
    // Lightbox Viewer
    // ======================================

    const lightbox =
        document.getElementById('lightbox');

    if (!lightbox) return;

    const lightboxImg =
        document.getElementById('lightbox-img');

    const closeBtn =
        document.querySelector('.lightbox-close');

    const nextBtn =
        document.querySelector('.lightbox-next');

    const prevBtn =
        document.querySelector('.lightbox-prev');

    let currentGallery = [];
    let currentIndex = 0;


    // Open image

    document.addEventListener('click', (e) => {

        const img = e.target.closest('.project-gallery img');

        if (!img) return;

        const gallery =
            img.closest('.project-gallery');

        currentGallery =
            Array.from(
                gallery.querySelectorAll('img')
            );

        currentIndex =
            currentGallery.indexOf(img);

        lightboxImg.src = img.src;

        lightbox.classList.add('active');

    });

    // Close

    if (closeBtn) {

        closeBtn.addEventListener('click', () => {

            lightbox.classList.remove('active');

        });

    }


    // Click outside

    lightbox.addEventListener('click', (e) => {

        if (e.target === lightbox) {

            lightbox.classList.remove('active');

        }

    });


    // Next

    if (nextBtn) {

        nextBtn.addEventListener('click', () => {

            currentIndex++;

            if (currentIndex >= currentGallery.length) {

                currentIndex = 0;

            }

            lightboxImg.src =
                currentGallery[currentIndex].src;

        });

    }


    // Previous

    if (prevBtn) {

        prevBtn.addEventListener('click', () => {

            currentIndex--;

            if (currentIndex < 0) {

                currentIndex =
                    currentGallery.length - 1;

            }

            lightboxImg.src =
                currentGallery[currentIndex].src;

        });

    }


    // Keyboard support

    document.addEventListener('keydown', (e) => {

        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {

            lightbox.classList.remove('active');

        }

        if (e.key === 'ArrowRight') {

            nextBtn?.click();

        }

        if (e.key === 'ArrowLeft') {

            prevBtn?.click();

        }

    });

});