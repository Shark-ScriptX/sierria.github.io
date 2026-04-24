// Cursor Glow
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(cursorGlow) cursorGlow.style.opacity = '0.3';
});

function animateGlow() {
    if(cursorGlow) {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
    }
    requestAnimationFrame(animateGlow);
}
animateGlow();

// Canvas Background
const canvas = document.getElementById('bgCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random(),
            alphaDir: Math.random() > 0.5 ? 1 : -1,
            speed: Math.random() * 0.01 + 0.005
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(s => {
            s.alpha += s.speed * s.alphaDir;
            if(s.alpha <= 0.1) { s.alpha = 0.1; s.alphaDir = 1; }
            if(s.alpha >= 1) { s.alpha = 1; s.alphaDir = -1; }
            
            s.x += s.dx;
            s.y += s.dy;
            
            if(s.x < 0) s.x = width;
            if(s.x > width) s.x = 0;
            if(s.y < 0) s.y = height;
            if(s.y > height) s.y = 0;
            
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            if (s.r > 1.2) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#2cbcd1';
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        });
        
        requestAnimationFrame(animateStars);
    }
    animateStars();
}
