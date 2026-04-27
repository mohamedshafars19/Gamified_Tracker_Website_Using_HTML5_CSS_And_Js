// home.js - Home page interactions

document.addEventListener('DOMContentLoaded', function() {
    // ========== CHECK LOGIN STATE ==========
    // Uses functions from auth.js (must be loaded before this script)
    const loggedIn = isLoggedIn();

    if (loggedIn) {
        // Get user data
        const user = getCurrentUser();
        const firstName = user.firstName || user.name || 'User';

        // ========== PERSONALIZE HERO SECTION ==========
        const heroHeading = document.querySelector('.hero-text h1');
        const heroParagraph = document.querySelector('.hero-text p');
        const heroButtons = document.querySelector('.hero-buttons');

        if (heroHeading) {
            heroHeading.textContent = `Welcome back, ${firstName}!`;
        }

        if (heroParagraph) {
            heroParagraph.textContent = 'Continue earning rewards for your everyday activities. Track your progress and redeem your points.';
        }

        if (heroButtons) {
            // Replace CTA buttons with dashboard/rewards links
            heroButtons.innerHTML = `
                <a href="dashboard.html" class="btn btn-primary"><i class="fas fa-tachometer-alt"></i> Go to Dashboard</a>
                <a href="reward.html" class="btn btn-secondary"><i class="fas fa-gift"></i> Browse Rewards</a>
            `;
        }

        // ========== OPTIONAL: SHOW LOGGED-IN STATE IN HEADER ==========
        // The header on home page only has .auth-buttons (Login/Signup).
        // If you want to replace them with a user menu, you can uncomment the code below.
        /*
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="user-menu" style="display: flex; align-items: center; gap: 10px;">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-dropdown" style="position: relative;">
                        <span class="user-name">${firstName}</span>
                        <i class="fas fa-chevron-down"></i>
                        <div class="dropdown-content" style="position: absolute; right: 0; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); min-width: 150px; display: none;">
                            <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                            <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
                            <a href="history.html"><i class="fas fa-history"></i> History</a>
                            <div class="divider" style="height: 1px; background: #eee; margin: 5px 0;"></div>
                            <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                        </div>
                    </div>
                </div>
            `;

            // Add hover functionality for dropdown
            const userDropdown = document.querySelector('.user-dropdown');
            if (userDropdown) {
                userDropdown.addEventListener('mouseenter', () => {
                    document.querySelector('.dropdown-content').style.display = 'block';
                });
                userDropdown.addEventListener('mouseleave', () => {
                    document.querySelector('.dropdown-content').style.display = 'none';
                });
            }

            // Attach logout event
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        localStorage.removeItem('userLoggedIn');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userFirstName');
                        localStorage.removeItem('userLastName');
                        localStorage.removeItem('userPoints');
                        localStorage.removeItem('userStreak');
                        localStorage.removeItem('userLevel');
                        localStorage.removeItem('lastCheckIn');
                        window.location.reload();
                    }
                });
            }
        }
        */
    }

    // ========== ADD SMOOTH SCROLLING TO ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== FEATURE CARD ANIMATION (optional) ==========
    // You could add a simple fade-in effect on scroll, but it's not necessary.
});