// 1. Efecto de entrada suave (Fade-In)
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-out';
window.onload = () => { document.body.style.opacity = '1'; };

// 2. Interceptar enlaces para salida suave (Fade-Out) hacia index.html
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Si el enlace va al index.html
        if (href && href.includes('index.html')) {
            e.preventDefault();
            document.body.style.opacity = '0'; // Fundido oscuro
            setTimeout(() => {
                window.location.href = href;
            }, 500); // Cambia de página tras medio segundo
        }
    });
});

// 3. Modal Logic
const modal = document.getElementById('code-modal');
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 4. Lógica de Menú Móvil
const menuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const icon = menuBtn.querySelector('i');

if(menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });
}

// 5. Basic Particle Background Logic
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 1.5 + 0.5;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if(this.x < 0 || this.x > width) this.vx *= -1;
        if(this.y < 0 || this.y > height) this.vy *= -1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
        ctx.fill();
    }
}

function init() {
    resize();
    for(let i=0; i<50; i++) particles.push(new Particle());
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animate);
}
init();