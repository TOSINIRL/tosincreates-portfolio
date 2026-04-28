// Cursor Glow Effect
const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Smooth Channel Switching Simulation
const channels = document.querySelectorAll('.channel');
channels.forEach(channel => {
    channel.addEventListener('click', () => {
        channels.forEach(c => c.classList.remove('active'));
        channel.classList.add('active');
        
        // Add a little haptic-style feedback or update content
        console.log(`Navigating to ${channel.innerText}`);
    });
});

// Reveal Animation on Scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

// Interactive Glitch Logic
const glitchTitle = document.querySelector('.glitch');
if (glitchTitle) {
    glitchTitle.addEventListener('mouseover', () => {
        glitchTitle.style.animation = 'glitch 0.3s infinite';
    });
    glitchTitle.addEventListener('mouseleave', () => {
        glitchTitle.style.animation = 'none';
    });
}
