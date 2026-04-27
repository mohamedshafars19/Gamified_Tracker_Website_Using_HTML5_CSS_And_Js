// auth.js - Shared authentication and session management
// Also handles user dropdown menu

// ========== DROPDOWN MANAGEMENT ==========
function initUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.querySelector('.user-dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    if (!userMenu || !dropdown || !dropdownContent) return;

    // Show/hide on hover (with slight delay to allow moving mouse into dropdown)
    let hideTimeout;

    function showDropdown() {
        clearTimeout(hideTimeout);
        dropdownContent.style.display = 'block';
    }

    function hideDropdown() {
    hideTimeout = setTimeout(() => {
        if (!dropdownContent.matches(':hover') && !userMenu.matches(':hover')) {
            dropdownContent.style.display = 'none';
        }
    }, 400); // increased from 200ms
}

    userMenu.addEventListener('mouseenter', showDropdown);
    userMenu.addEventListener('mouseleave', hideDropdown);
    dropdownContent.addEventListener('mouseenter', showDropdown);
    dropdownContent.addEventListener('mouseleave', hideDropdown);

    // Optional: Also close on click outside
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.style.display = 'none';
        }
    });

    // Prevent clicks inside dropdown from closing it
    dropdownContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ========== AUTHENTICATION FUNCTIONS ==========
function isLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

function getCurrentUser() {
    return {
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
        firstName: localStorage.getItem('userFirstName'),
        lastName: localStorage.getItem('userLastName'),
        points: parseInt(localStorage.getItem('userPoints')) || 1250,
        streak: parseInt(localStorage.getItem('userStreak')) || 7,
        level: localStorage.getItem('userLevel') || 'Silver'
    };
}

function updateNavigation() {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (!authButtons || !userMenu) return;
    
    if (isLoggedIn()) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        
        // Update user name
        const userNameElement = document.getElementById('userName') || document.querySelector('.user-name');
        if (userNameElement) {
            const user = getCurrentUser();
            userNameElement.textContent = user.firstName || user.name || 'User';
        }
        
        // Update points balance if element exists
        const pointsBalance = document.querySelector('.points-balance');
        if (pointsBalance) {
            pointsBalance.textContent = getCurrentUser().points.toLocaleString();
        }

        // Initialize dropdown
        initUserDropdown();
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Redirect if not logged in (for protected pages)
function requireAuth() {
    const protectedPages = ['dashboard.html', 'reward.html', 'history.html', 'settings.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        alert('Please log in to access this page.');
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        localStorage.removeItem('userPoints');
        localStorage.removeItem('userStreak');
        localStorage.removeItem('userLevel');
        localStorage.removeItem('newsletterSubscribed');
        localStorage.removeItem('referralCode');
        localStorage.removeItem('lastCheckIn');
        
        alert('You have been logged out successfully.');
        window.location.href = 'index.html';
    }
}

// Initialize on every page
document.addEventListener('DOMContentLoaded', function() {
    requireAuth();
    updateNavigation();
    
    // Attach logout event to logout links inside dropdown
    const logoutLink = document.querySelector('.dropdown-content a[href="index.html"]:last-child');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});