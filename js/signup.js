// signup.js - Signup page interactions

document.addEventListener('DOMContentLoaded', function() {
    // ========== PASSWORD VISIBILITY TOGGLE ==========
    // If you have eye icons in your HTML, uncomment and adjust the IDs.
    // const togglePassword = document.getElementById('togglePassword');
    // const toggleConfirm = document.getElementById('toggleConfirmPassword');
    // if (togglePassword) { ... }

    // ========== HANDLE SIGNUP FORM ==========
    const signupForm = document.querySelector('.signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the GET redirect

        // Get form values
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsAgreed = document.getElementById('terms').checked;
        const newsletter = document.getElementById('newsletter')?.checked || false;
        const referralCode = document.getElementById('referral')?.value.trim() || '';

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!termsAgreed) {
            alert('You must agree to the Terms of Service and Privacy Policy.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        // Optional: email format check (simple)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Store user data in localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', `${firstName} ${lastName}`);
        localStorage.setItem('userFirstName', firstName);
        localStorage.setItem('userLastName', lastName);
        localStorage.setItem('userPoints', '1250'); // Starting points
        localStorage.setItem('userStreak', '1');    // Initial streak
        localStorage.setItem('userLevel', 'Silver');
        localStorage.setItem('newsletterSubscribed', newsletter);

        if (referralCode) {
            localStorage.setItem('referralCode', referralCode);
        }

        // Success message and redirect
        alert(`Welcome to Habit Tracker, ${firstName}! Your account has been created.`);
        window.location.href = 'dashboard.html';
    });

    // ========== SOCIAL SIGNUP BUTTONS (optional) ==========
    const googleBtn = document.querySelector('.btn-social.google');
    const facebookBtn = document.querySelector('.btn-social.facebook');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google signup would open here. For demo, use the form above.');
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            // If you want to open Facebook in a new tab
            // window.open('https://www.facebook.com/', '_blank');
            alert('Facebook signup would open here. For demo, use the form above.');
        });
    }
});