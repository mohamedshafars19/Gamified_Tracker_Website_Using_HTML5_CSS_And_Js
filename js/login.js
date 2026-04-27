// login.js - Login page interactions

document.addEventListener('DOMContentLoaded', function() {
    // ========== PASSWORD VISIBILITY TOGGLE (optional) ==========
    // If you add eye icons in the HTML later, you can enable this.
    // const togglePassword = document.getElementById('togglePassword');
    // if (togglePassword) { ... }

    // ========== HANDLE LOGIN FORM ==========
    const loginForm = document.querySelector('.login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the GET redirect

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember')?.checked || false;

        // Basic validation
        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }

        // Optional email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // For demo purposes, accept any credentials.
        // In a real app, you would send a request to your backend.

        // Store user session in localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        // Extract a name from email (simple demo)
        const name = email.split('@')[0];
        localStorage.setItem('userName', name);
        localStorage.setItem('userFirstName', name); // for welcome messages

        // Set default points, streak, level if not already set
        if (!localStorage.getItem('userPoints')) {
            localStorage.setItem('userPoints', '1250');
            localStorage.setItem('userStreak', '7');
            localStorage.setItem('userLevel', 'Silver');
        }

        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    });

    // ========== FORGOT PASSWORD ==========
    const forgotLink = document.querySelector('.forgot-password');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('Please enter your email address to reset your password:');
            if (email) {
                alert(`Password reset link sent to ${email}. Check your email.`);
            }
        });
    }

    // ========== SOCIAL LOGIN BUTTONS (placeholders) ==========
    const googleBtn = document.querySelector('.btn-social.google');
    const facebookBtn = document.querySelector('.btn-social.facebook');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google login would open here. For demo, use the form above.');
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            // If you want to open Facebook in a new tab, you can use:
            // window.open('https://www.facebook.com/', '_blank');
            alert('Facebook login would open here. For demo, use the form above.');
        });
    }
});