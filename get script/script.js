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

    for(let i=0; i<100; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
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
            ctx.fill();
        });
        
        requestAnimationFrame(animateStars);
    }
    animateStars();
}

// Mock Dynamic Tasks Data (In a real app, this comes from a database)
let taskData = [
    {
        id: 'task-1',
        title: 'Follow my TikTok',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
        actionUrl: 'https://tiktok.com/@example'
    },
    {
        id: 'task-2',
        title: 'Join Discord Server',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png',
        actionUrl: 'https://discord.gg/example'
    }
];

// Check for Preview Mode
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('preview') === '1') {
    const previewDataStr = localStorage.getItem('sierriaPreview');
    if (previewDataStr) {
        try {
            const previewData = JSON.parse(previewDataStr);
            taskData = previewData.tasks;
            
            // Update UI elements
            const mainTitle = document.getElementById('mainTitle');
            if (mainTitle && previewData.title) {
                mainTitle.textContent = previewData.title;
            }
            
            const thumbEl = document.getElementById('mainThumbnail');
            if (thumbEl && previewData.thumbnail) {
                thumbEl.src = previewData.thumbnail;
            }
            
            // Update Destination Link dynamically wrapped with Linkvertise
            const destLink = document.getElementById('destinationLink');
            if (destLink && previewData.destination) {
                let dest = previewData.destination;
                if (!dest.startsWith('http')) dest = 'https://' + dest; // Ensure valid URL
                
                // Set the raw link
                destLink.href = dest;
                
                // Build a dynamic blacklist containing all Task domains so they aren't monetized
                const blacklistDomains = [window.location.hostname];
                taskData.forEach(task => {
                    try {
                        const url = new URL(task.actionUrl);
                        blacklistDomains.push(url.hostname);
                        blacklistDomains.push(url.hostname.replace('www.', '')); // Add both variants
                    } catch(e) {}
                });
                
                // Inject Linkvertise Full Script API reliably using onload
                const lvScript1 = document.createElement('script');
                lvScript1.src = "https://publisher.linkvertise.com/cdn/linkvertise.js";
                lvScript1.onload = () => {
                    if (typeof linkvertise === 'function') {
                        // Whitelist empty means monetize ALL external links EXCEPT the blacklist (Task links)
                        linkvertise(4727479, {whitelist: [], blacklist: blacklistDomains});
                        console.log("Linkvertise activated successfully.");
                    }
                };
                document.head.appendChild(lvScript1);
            }
        } catch(e) {
            console.error('Error loading preview data:', e);
        }
    }
}

const completedTasks = new Set();

function renderTasks() {
    const container = document.getElementById('dynamicTasksContainer');
    container.innerHTML = ''; // Clear
    
    taskData.forEach(task => {
        const taskHtml = `
            <button id="${task.id}" onclick="completeStep('${task.id}', '${task.actionUrl}')" class="step-card w-full text-left bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 cursor-pointer relative overflow-hidden">
                <div class="icon-container w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 transition-all overflow-hidden p-2">
                    <img src="${task.iconUrl}" onerror="this.src='https://via.placeholder.com/48x48/112240/2cbcd1?text=T'" class="w-full h-full object-contain filter drop-shadow-md" alt="icon">
                </div>
                <div class="flex-1">
                    <h3 class="text-white font-semibold text-sm">${task.title}</h3>
                    <p class="text-xs text-blue-200/50 status-text">Click to verify</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 check-icon transition-all">
                    <i class="ri-arrow-right-s-line text-blue-200/50"></i>
                </div>
            </button>
        `;
        container.insertAdjacentHTML('beforeend', taskHtml);
    });
}

// Initialize
renderTasks();

function completeStep(taskId, actionUrl) {
    if(completedTasks.has(taskId)) return;
    
    const btn = document.getElementById(taskId);
    const statusText = btn.querySelector('.status-text');
    const checkIcon = btn.querySelector('.check-icon');
    
    statusText.innerHTML = '<i class="ri-loader-4-line animate-spin inline-block"></i> Verifying...';
    btn.classList.add('opacity-75', 'pointer-events-none');
    
    // Open action link
    window.open(actionUrl, '_blank');

    setTimeout(() => {
        completedTasks.add(taskId);
        
        btn.classList.remove('opacity-75', 'pointer-events-none');
        btn.classList.add('completed');
        statusText.innerHTML = 'Verified';
        statusText.classList.replace('text-blue-200/50', 'text-emerald-400');
        
        checkIcon.innerHTML = '<i class="ri-check-line text-emerald-400"></i>';
        checkIcon.classList.replace('bg-white/5', 'bg-emerald-500/20');
        checkIcon.classList.replace('border-white/10', 'border-emerald-500/30');

        updateProgress();
    }, 3000);
}

function updateProgress() {
    const progressPercent = (completedTasks.size / taskData.length) * 100;
    
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
    if (completedTasks.size === taskData.length) {
        enableUnlockButton();
    }
}

function enableUnlockButton() {
    const btn = document.getElementById('unlockBtn');
    btn.disabled = false;
    btn.classList.remove('bg-ocean-800', 'text-blue-200/50', 'border-white/5', 'cursor-not-allowed');
    btn.classList.add('bg-primary-600', 'text-white', 'border-primary-400/50', 'hover:bg-primary-500', 'pulse-border', 'shadow-[0_0_20px_rgba(16,127,152,0.4)]', 'cursor-pointer');
    btn.innerHTML = '<i class="ri-lock-unlock-line"></i> Unlock Content';
}

function unlockContent() {
    const btn = document.getElementById('unlockBtn');
    btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Unlocking...';
    
    setTimeout(() => {
        document.getElementById('successModal').classList.remove('hidden');
    }, 1000);
}
