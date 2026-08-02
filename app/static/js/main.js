// QT Consultancy Global Script Settings

// 1. Unified Company Branding Configuration
const companyConfig = {
    name: 'QT Consultancy',
    legal_name: 'QT Consultancy (Opc) Private Limited',
    logo_initials: 'QT',
    gstin: '09AABCQ0892L1Z0',
    cin: 'U78100UP2025OPC218928',
    address: 'Plot no 5, New Shambhu Nagar Road, Delhi Road, Near Transport Nagar, Mohokampur Phase 1, Meerut, Uttar Pradesh - 250002',
    phone: '7830899085, 8750015790',
    email: 'hr@qtconsultancy.in',
    website: 'www.qtconsultancy.in',
    colors: {
        primary: '#88BDF2', // Sky Blue
        secondary: '#6A89A7', // Slate Blue
        dark: '#384959' // Dark Slate Navy
    }
};

// 2. Local Storage Theme Engine (Light / Dark Mode)
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        showToast('Switched to Light Mode', 'info');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        showToast('Switched to Dark Mode', 'info');
    }
}

// 3. Responsive Sidebar Controller
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-navigation');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }
}

// 4. Dynamic Toast Notice Manager
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto p-4 rounded-xl shadow-lg text-white font-medium text-xs sm:text-sm flex items-center justify-between gap-3 min-w-[280px] `;

    // Select color based on notification type
    if (type === 'success') {
        toast.className += 'bg-emerald-600 border border-emerald-500';
    } else if (type === 'error') {
        toast.className += 'bg-rose-600 border border-rose-500';
    } else if (type === 'info') {
        toast.className += 'bg-[#6A89A7] border border-[#BDDDFC]';
    } else {
        toast.className += 'bg-amber-600 border border-amber-500';
    }

    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <span>${type === 'success' ? '⚡' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
        </div>
        <button class="text-white hover:text-gray-200 focus:outline-none text-xs ml-auto" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// 5. Automatic branding injectors
function injectBranding() {
    const elements = document.querySelectorAll('[data-brand]');
    elements.forEach(el => {
        const attribute = el.getAttribute('data-brand');
        if (attribute in companyConfig) {
            el.textContent = companyConfig[attribute];
        }
    });
}

// 6. Live Navbar Clock Updater
function startClock() {
    const timeContainer = document.getElementById('navbar-clock');
    if (timeContainer) {
        const update = () => {
            const now = new Date();
            const formatted = now.toLocaleDateString('en-GB') + ' | ' + now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeContainer.textContent = formatted;
        };
        update();
        setInterval(update, 1000);
    }
}

// Initialize components on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    injectBranding();
    startClock();
    
    // Bind Theme Toggle Buttons if any exist
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Bind sidebar collapse triggers
    const sidebarToggle = document.getElementById('sidebar-hamburger');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    const sidebarClose = document.getElementById('sidebar-close-btn');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }
});
