// Smooth Cursor Glow Effect
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Reveal glow on first move
    if(cursorGlow) cursorGlow.style.opacity = '0.4';
});

document.addEventListener('mouseleave', () => {
    if(cursorGlow) cursorGlow.style.opacity = '0';
});

function animateGlow() {
    if(cursorGlow) {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
    }
    requestAnimationFrame(animateGlow);
}
animateGlow();

// High Performance Canvas Starfield
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

    // Initialize stars
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
        
        // Draw stars
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

// Dynamic Tasks Logic
let taskCount = 0;

function addTask() {
    taskCount++;
    const container = document.getElementById('dynamicTasksContainer');
    
    const taskHtml = `
        <div id="task-${taskCount}" class="bg-white/5 border border-white/10 rounded-2xl p-5 relative fade-in">
            <button type="button" onclick="removeTask(${taskCount})" class="absolute top-4 right-4 text-red-400/70 hover:text-red-400 transition-colors cursor-pointer">
                <i class="ri-delete-bin-line"></i>
            </button>
            <h3 class="text-white font-medium mb-4 text-sm">Task Requirements</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-blue-200/90 mb-1">Task Title</label>
                    <input type="text" class="task-title w-full glass-input rounded-xl px-3 py-2 text-white text-sm focus:outline-none transition-all placeholder-blue-200/30" placeholder="e.g., Subscribe to YouTube" required>
                </div>
                <div>
                    <label class="block text-xs font-medium text-blue-200/90 mb-1">Task Icon URL</label>
                    <input type="url" class="task-icon w-full glass-input rounded-xl px-3 py-2 text-white text-sm focus:outline-none transition-all placeholder-blue-200/30" placeholder="https://example.com/icon.png" required>
                </div>
                <div>
                    <label class="block text-xs font-medium text-blue-200/90 mb-1">Task Action URL</label>
                    <input type="url" class="task-url w-full glass-input rounded-xl px-3 py-2 text-white text-sm focus:outline-none transition-all placeholder-blue-200/30" placeholder="https://youtube.com/..." required>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', taskHtml);
}

function removeTask(id) {
    const taskElement = document.getElementById(`task-${id}`);
    if (taskElement) {
        taskElement.remove();
    }
}

// Link Generation
function generateLink(e) {
    e.preventDefault();
    
    const pageTitle = document.getElementById('pageTitle').value;
    const pageThumbnail = document.getElementById('pageThumbnail').value || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
    const destinationUrl = document.getElementById('destinationUrl').value;
    const taskElements = document.querySelectorAll('#dynamicTasksContainer > div');
    
    if (taskElements.length === 0) {
        alert("Please add at least one task requirement.");
        return;
    }
    
    if (!destinationUrl) {
        alert("Please enter a destination URL.");
        return;
    }

    const btn = document.getElementById('submitBtn');
    const originalContent = btn.innerHTML;
    
    // Save data for Preview functionality (using LocalStorage for static frontend)
    const tasksData = [];
    taskElements.forEach((el, index) => {
        tasksData.push({
            id: 'task-' + index,
            title: el.querySelector('.task-title').value,
            iconUrl: el.querySelector('.task-icon').value,
            actionUrl: el.querySelector('.task-url').value
        });
    });

    const previewData = {
        title: pageTitle,
        thumbnail: pageThumbnail,
        tasks: tasksData,
        destination: destinationUrl
    };
    localStorage.setItem('sierriaPreview', JSON.stringify(previewData));
    
    // Loading State
    btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Generating...';
    btn.disabled = true;
    btn.classList.add('opacity-75');

    // Generate Sierria Unlock URL (Mock for frontend)
    // In a real backend, this would save previewData to a database and return an ID
    const randomId = Math.random().toString(36).substring(2, 10);
    const finalUrl = `https://sierria.app/unlock/${randomId}`;
    
    // Simulate API call
    setTimeout(() => {
        
        // Generate a fake hash for the Sierria Social Unlock page
        const generatedLink = finalUrl;
        
        document.getElementById('generatedLink').value = generatedLink;
        document.getElementById('resultModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Reset button
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.classList.remove('opacity-75');
        
    }, 1500);
}

function closeResultModal() {
    document.getElementById('resultModal').classList.add('hidden');
    document.body.style.overflow = '';
    
    // Reset copy button
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy';
    copyBtn.classList.replace('bg-emerald-600', 'bg-primary-600/80');
}

function copyLink() {
    const input = document.getElementById('generatedLink');
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(input.value).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.innerHTML = '<i class="ri-check-double-line"></i> Copied!';
        copyBtn.classList.replace('bg-primary-600/80', 'bg-emerald-600');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy';
            copyBtn.classList.replace('bg-emerald-600', 'bg-primary-600/80');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy. Please copy manually.');
    });
}
