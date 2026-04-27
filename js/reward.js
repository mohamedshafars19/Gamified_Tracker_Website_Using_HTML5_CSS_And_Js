// reward.js - Rewards page interactions

document.addEventListener('DOMContentLoaded', function() {
    // Get current user data (requires auth.js to be loaded first)
    const user = getCurrentUser(); // from auth.js

    // Redirect if not logged in (safety check, auth.js already handles)
    if (!user || !isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // ========== UPDATE UI WITH USER DATA ==========
    // Update points balance and summary cards
    const pointsBalance = document.querySelector('.points-balance');
    const pointsCards = document.querySelectorAll('.points-card .points-value');

    if (pointsBalance) pointsBalance.textContent = user.points.toLocaleString();
    if (pointsCards.length >= 1) pointsCards[0].textContent = user.points.toLocaleString(); // Total points

    // Update user name in top right menu
    const userNameSpan = document.querySelector('.user-name');
    if (userNameSpan && user.firstName) {
        userNameSpan.textContent = user.firstName;
    }

    // ========== CATEGORY FILTER ==========
    const categoryButtons = document.querySelectorAll('.category-btn');
    const rewardCards = document.querySelectorAll('.reward-card');

    function filterRewards(category) {
        rewardCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterRewards(category);
        });
    });

    // ========== REDEEM BUTTONS ==========
    document.querySelectorAll('.btn-redeem').forEach(btn => {
        btn.addEventListener('click', function() {
            const rewardCard = this.closest('.reward-card');
            if (!rewardCard) return;

            const rewardName = rewardCard.querySelector('h3').textContent;
            const pointsElement = rewardCard.querySelector('.points-required span');
            const pointsText = pointsElement.textContent;
            const pointsCost = parseInt(pointsText.replace(/,/g, '').match(/\d+/)[0]);

            if (user.points >= pointsCost) {
                if (confirm(`Redeem ${rewardName} for ${pointsCost} points?`)) {
                    // Deduct points
                    const newPoints = user.points - pointsCost;
                    localStorage.setItem('userPoints', newPoints);
                    user.points = newPoints;

                    // Update UI
                    pointsBalance.textContent = newPoints.toLocaleString();
                    pointsCards[0].textContent = newPoints.toLocaleString();

                    // Optionally disable the button and show a message
                    this.textContent = 'Redeemed';
                    this.disabled = true;
                    this.style.backgroundColor = '#27ae60';
                    this.style.cursor = 'default';

                    alert(`Successfully redeemed ${rewardName}!`);
                }
            } else {
                alert(`You need ${pointsCost - user.points} more points to redeem this reward.`);
            }
        });
    });

    // ========== EARN POINTS BUTTONS ==========
    document.querySelectorAll('.btn-earn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.closest('.earn-card').querySelector('h3').textContent;
            alert(`The "${action}" feature is coming soon!`);
        });
    });

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