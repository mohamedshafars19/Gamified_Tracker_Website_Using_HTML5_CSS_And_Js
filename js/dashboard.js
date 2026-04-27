// dashboard.js - Dashboard page interactions

document.addEventListener('DOMContentLoaded', function() {
    // Get current user data (requires auth.js to be loaded first)
    const user = getCurrentUser(); // from auth.js

    // If no user data, redirect (safety check, auth.js already handles)
    if (!user || !isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // ========== UPDATE UI WITH USER DATA ==========
    // Update welcome message
    const welcomeMsg = document.querySelector('.dashboard-header p');
    if (welcomeMsg && user.firstName) {
        welcomeMsg.textContent = `Welcome back, ${user.firstName}! Here's your reward summary and activity.`;
    }

    // Update user name in top right menu
    const userNameSpan = document.querySelector('.user-name');
    if (userNameSpan) {
        userNameSpan.textContent = user.firstName || user.name || 'User';
    }

    // Update stats cards
    const pointsValue = document.querySelector('.total-points .stats-value');
    const streakValue = document.querySelector('.streak .stats-value');
    const levelValue = document.querySelector('.level .stats-value');
    const levelChange = document.querySelector('.level .stats-change');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text p');

    if (pointsValue) pointsValue.textContent = user.points.toLocaleString();

    // Streak (get from localStorage or default to 7)
    const streak = parseInt(localStorage.getItem('userStreak')) || 7;
    if (streakValue) streakValue.textContent = streak + ' Days';

    // Level logic (simplified: based on points)
    let level = 'Silver';
    let nextLevel = 'Gold';
    let pointsToNext = 500;
    let progressPercent = 0;

    if (user.points >= 1500) {
        level = 'Gold';
        nextLevel = 'Platinum';
        pointsToNext = 2500;
        progressPercent = ((user.points - 1500) / (2500 - 1500)) * 100;
    } else if (user.points >= 500) {
        level = 'Silver';
        nextLevel = 'Gold';
        pointsToNext = 1500;
        progressPercent = ((user.points - 500) / (1500 - 500)) * 100;
    } else {
        level = 'Bronze';
        nextLevel = 'Silver';
        pointsToNext = 500;
        progressPercent = (user.points / 500) * 100;
    }

    if (levelValue) levelValue.textContent = level + ' Member';
    if (levelChange) levelChange.textContent = `${(pointsToNext - user.points).toFixed(0)} points to ${nextLevel}`;
    if (progressFill) progressFill.style.width = Math.min(progressPercent, 100) + '%';
    if (progressText) progressText.textContent = `You need ${(pointsToNext - user.points).toFixed(0)} more points to reach ${nextLevel} level.`;

    // ========== QUICK ACTIONS ==========
    document.querySelectorAll('.action-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;

            if (action === 'Daily Check-in') {
                handleDailyCheckIn();
            } else if (action === 'Complete Survey') {
                alert('Survey feature coming soon!');
            } else if (action === 'Refer Friends') {
                alert('Referral feature coming soon!');
            }
        });
    });

    // ========== REWARD REDEMPTION ==========
    document.querySelectorAll('.btn-redeem').forEach(btn => {
        btn.addEventListener('click', function() {
            const rewardItem = this.closest('.reward-item');
            if (!rewardItem) return;

            const rewardName = rewardItem.querySelector('h4').textContent;
            const pointsText = rewardItem.querySelector('.reward-points').textContent;
            const pointsCost = parseInt(pointsText.match(/\d+/)[0]);

            if (user.points >= pointsCost) {
                if (confirm(`Redeem ${rewardName} for ${pointsCost} points?`)) {
                    // Deduct points
                    const newPoints = user.points - pointsCost;
                    localStorage.setItem('userPoints', newPoints);
                    user.points = newPoints;

                    // Update points display
                    if (pointsValue) pointsValue.textContent = newPoints.toLocaleString();

                    // Add to recent activity
                    const activityList = document.querySelector('.activity-list');
                    if (activityList) {
                        const newActivity = document.createElement('div');
                        newActivity.className = 'activity-item';
                        newActivity.innerHTML = `
                            <div class="activity-icon reward">
                                <i class="fas fa-gift"></i>
                            </div>
                            <div class="activity-details">
                                <h4>${rewardName} Redeemed</h4>
                                <p>Just now • -${pointsCost} points</p>
                            </div>
                        `;
                        activityList.prepend(newActivity);
                        // Keep only 4 items (optional)
                        while (activityList.children.length > 4) {
                            activityList.removeChild(activityList.lastElementChild);
                        }
                    }

                    alert(`Successfully redeemed ${rewardName}!`);
                }
            } else {
                alert(`You need ${pointsCost - user.points} more points to redeem this reward.`);
            }
        });
    });

    // ========== DAILY CHECK-IN FUNCTION ==========
    function handleDailyCheckIn() {
        // Check if already checked in today (using localStorage date)
        const lastCheckIn = localStorage.getItem('lastCheckIn');
        const today = new Date().toDateString();

        if (lastCheckIn === today) {
            alert('You have already checked in today. Come back tomorrow!');
            return;
        }

        // Add points and increment streak
        const oldPoints = user.points;
        const newPoints = oldPoints + 10; // Daily bonus
        localStorage.setItem('userPoints', newPoints);
        user.points = newPoints;

        // Update streak
        const oldStreak = parseInt(localStorage.getItem('userStreak')) || 7;
        const newStreak = oldStreak + 1;
        localStorage.setItem('userStreak', newStreak);
        localStorage.setItem('lastCheckIn', today);

        // Update UI
        if (pointsValue) pointsValue.textContent = newPoints.toLocaleString();
        if (streakValue) streakValue.textContent = newStreak + ' Days';

        // Add activity
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            const newActivity = document.createElement('div');
            newActivity.className = 'activity-item';
            newActivity.innerHTML = `
                <div class="activity-icon success">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="activity-details">
                    <h4>Daily Check-in</h4>
                    <p>Just now • +10 points (Streak: ${newStreak} days)</p>
                </div>
            `;
            activityList.prepend(newActivity);
            while (activityList.children.length > 4) {
                activityList.removeChild(activityList.lastElementChild);
            }
        }

        alert('Daily check-in complete! +10 points earned.');
    }

    // ========== VIEW ALL ACTIVITY LINK ==========
    const viewAll = document.querySelector('.view-all');
    if (viewAll) {
        viewAll.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'history.html';
        });
    }

    // ========== LOGOUT HANDLER (already in auth.js, but we can ensure the logout link works) ==========
    const logoutLink = document.querySelector('.dropdown-content a[href="index.html"]:last-child');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
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
                window.location.href = 'index.html';
            }
        });
    }
});