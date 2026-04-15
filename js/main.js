
document.addEventListener('DOMContentLoaded', () => {
    // --- PURE STATIC LOCK ---
    // ALL MOUSE TRACKING DELETED.
    // ALL SCROLL EFFECTS DELETED.

    // Reveal all elements instantly
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));

    // --- Simple Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'auto' }); // Instant jump, no slide
            }
        });
    });

    // --- Basic Mobile Menu ---
    const mt = document.getElementById('mobileMenuToggle') || document.getElementById('menuToggle'); 
    if (mt) {
        mt.addEventListener('click', () => { 
            mt.classList.toggle('active'); 
            const nav = document.querySelector('.nav-links') || document.getElementById('mobileNav');
            if (nav) nav.classList.toggle('active');
        });
    }

    console.log('🛡️ Zero-Motion Lock Active.');
});
