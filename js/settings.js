// settings.js - Settings page interactions

document.addEventListener('DOMContentLoaded', function() {
    // Get current user data (requires auth.js to be loaded first)
    const user = getCurrentUser(); // from auth.js

    // Redirect if not logged in (safety check, auth.js already handles)
    if (!user || !isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // ========== UPDATE USER NAME IN HEADER ==========
    const userNameSpan = document.querySelector('.user-name');
    if (userNameSpan && user.firstName) {
        userNameSpan.textContent = user.firstName;
    }

    // ========== TAB SWITCHING ==========
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const settingsTabs = document.querySelectorAll('.settings-tab');

    function activateTab(tabId) {
        // Remove active class from all buttons and tabs
        sidebarBtns.forEach(btn => btn.classList.remove('active'));
        settingsTabs.forEach(tab => tab.classList.remove('active'));

        // Add active class to matching button and tab
        const activeBtn = Array.from(sidebarBtns).find(btn => btn.getAttribute('data-tab') === tabId);
        const activeTab = document.getElementById(tabId + '-tab');

        if (activeBtn) activeBtn.classList.add('active');
        if (activeTab) activeTab.classList.add('active');
    }

    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });

    // ========== POPULATE PROFILE FORM ==========
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const displayNameInput = document.getElementById('display-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const birthdateInput = document.getElementById('birthdate');
    const bioTextarea = document.getElementById('bio');

    if (firstNameInput) firstNameInput.value = user.firstName || '';
    if (lastNameInput) lastNameInput.value = user.lastName || '';
    if (displayNameInput) displayNameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';

    // ========== PASSWORD STRENGTH METER ==========
    const newPasswordInput = document.getElementById('new-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthValue = document.getElementById('strengthValue');

    if (newPasswordInput && strengthBar && strengthValue) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;

            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            if (password.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.style.backgroundColor = '#ddd';
                strengthValue.textContent = 'None';
            } else if (strength === 1) {
                strengthBar.style.width = '25%';
                strengthBar.style.backgroundColor = '#e74c3c';
                strengthValue.textContent = 'Weak';
            } else if (strength === 2) {
                strengthBar.style.width = '50%';
                strengthBar.style.backgroundColor = '#f39c12';
                strengthValue.textContent = 'Fair';
            } else if (strength === 3) {
                strengthBar.style.width = '75%';
                strengthBar.style.backgroundColor = '#3498db';
                strengthValue.textContent = 'Good';
            } else if (strength === 4) {
                strengthBar.style.width = '100%';
                strengthBar.style.backgroundColor = '#2ecc71';
                strengthValue.textContent = 'Strong';
            }
        });
    }

    // ========== SAVE BUTTONS (various forms) ==========
    document.querySelectorAll('.btn-save').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Determine which form we're in
            const form = this.closest('form');
            if (!form) return;

            if (form.id === 'profile-form') {
                // Save profile data
                const newFirstName = firstNameInput ? firstNameInput.value : '';
                const newLastName = lastNameInput ? lastNameInput.value : '';
                const newDisplayName = displayNameInput ? displayNameInput.value : '';
                const newEmail = emailInput ? emailInput.value : '';

                if (newFirstName) localStorage.setItem('userFirstName', newFirstName);
                if (newLastName) localStorage.setItem('userLastName', newLastName);
                if (newDisplayName) localStorage.setItem('userName', newDisplayName);
                if (newEmail) localStorage.setItem('userEmail', newEmail);

                alert('Profile updated successfully!');
            } else if (form.classList.contains('password-form')) {
                // Change password
                const currentPwd = document.getElementById('current-password')?.value;
                const newPwd = document.getElementById('new-password')?.value;
                const confirmPwd = document.getElementById('confirm-password')?.value;

                if (!currentPwd || !newPwd || !confirmPwd) {
                    alert('Please fill all password fields.');
                    return;
                }
                if (newPwd !== confirmPwd) {
                    alert('New passwords do not match.');
                    return;
                }
                if (newPwd.length < 8) {
                    alert('Password must be at least 8 characters.');
                    return;
                }
                alert('Password changed successfully!');
                form.reset();
            } else {
                // Generic save (e.g., notification settings, privacy)
                alert('Your changes have been saved successfully!');
            }
        });
    });

    // ========== CANCEL BUTTONS ==========
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                location.reload();
            }
        });
    });

    // ========== SESSION LOGOUT BUTTONS ==========
    document.querySelectorAll('.btn-logout-session').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out of this session?')) {
                this.closest('.session-item').remove();
                alert('Session logged out successfully.');
            }
        });
    });

    // ========== LOGOUT ALL OTHER SESSIONS ==========
    const logoutAllBtn = document.querySelector('.btn-logout-all');
    if (logoutAllBtn) {
        logoutAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out of all other sessions? You will remain logged in on this device.')) {
                document.querySelectorAll('.session-item:not(.current)').forEach(item => item.remove());
                alert('All other sessions have been logged out.');
            }
        });
    }

    // ========== ENABLE 2FA ==========
    const enable2FABtn = document.querySelector('.btn-enable-2fa');
    if (enable2FABtn) {
        enable2FABtn.addEventListener('click', function() {
            alert('Two-factor authentication setup would open here. In a real app, this would guide you through the 2FA setup process.');
        });
    }

    // ========== DOWNLOAD DATA ==========
    const downloadDataLink = document.querySelector('.btn-download-data');
    if (downloadDataLink) {
        downloadDataLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Your data export has been initiated. You will receive an email when your data is ready for download.');
        });
    }

    // ========== DELETE ACCOUNT ==========
    const deleteAccountBtn = document.querySelector('.btn-delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('WARNING: This will permanently delete your account and all associated data. This action cannot be undone. Are you sure?')) {
                alert('Account deletion requested. In a real app, this would initiate the account deletion process.');
            }
        });
    }

    // ========== LOGOUT HANDLER ==========
    const logoutLink = document.querySelector('.dropdown-content a[href="index.html"]:last-child');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear all user data
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userFirstName');
                localStorage.removeItem('userLastName');
                localStorage.removeItem('userPoints');
                localStorage.removeItem('userStreak');
                localStorage.removeItem('userLevel');
                localStorage.removeItem('lastCheckIn');
                window.location.href = 'index.html';
            }
        });
    }
});