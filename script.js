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
        loadComponent("footer", "/includes/footer.html")

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
    // Horizontal Galleries
    // ======================================

    document.querySelectorAll('.project-gallery').forEach(gallery => {

        // Mouse wheel support

        gallery.addEventListener('wheel', (e) => {

            e.preventDefault();

            gallery.scrollLeft += e.deltaY;

        });


        // Drag support

        let isDown = false;
        let startX;
        let scrollLeft;

        gallery.addEventListener('mousedown', (e) => {

            isDown = true;

            startX = e.pageX - gallery.offsetLeft;

            scrollLeft = gallery.scrollLeft;

        });

        gallery.addEventListener('mouseleave', () => {

            isDown = false;

        });

        gallery.addEventListener('mouseup', () => {

            isDown = false;

        });

        gallery.addEventListener('mousemove', (e) => {

            if (!isDown) return;

            e.preventDefault();

            const x = e.pageX - gallery.offsetLeft;

            const walk = (x - startX) * 2;

            gallery.scrollLeft = scrollLeft - walk;

        });


        // Auto-scroll

        setInterval(() => {

            if (gallery.matches(':hover')) return;

            gallery.scrollLeft += 1;

            if (
                gallery.scrollLeft + gallery.clientWidth >=
                gallery.scrollWidth
            ) {

                gallery.scrollLeft = 0;

            }

        }, 30);

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

    document.querySelectorAll('.project-gallery img').forEach(img => {

        img.addEventListener('click', () => {

            const gallery =
                img.closest('.project-gallery');

            currentGallery =
                Array.from(gallery.querySelectorAll('img'));

            currentIndex =
                currentGallery.indexOf(img);

            lightboxImg.src = img.src;

            lightbox.classList.add('active');

        });

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