// history.js - History page interactions

document.addEventListener('DOMContentLoaded', function() {
    // Get current user data (requires auth.js to be loaded first)
    const user = getCurrentUser(); // from auth.js

    // Redirect if not logged in (safety check, auth.js already handles)
    if (!user || !isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // ========== LOAD USER DATA & UPDATE SUMMARY CARDS ==========
    // For demo purposes, we'll simulate totals based on user points
    // In a real app, these would come from a database/history array
    const totalEarned = user.points + 2350; // simulated total earned
    const totalRedeemed = user.points;       // simulated total redeemed
    const rewardsClaimed = 14;                // simulated rewards claimed

    const summaryValues = document.querySelectorAll('.summary-value');
    if (summaryValues.length >= 3) {
        summaryValues[0].textContent = totalEarned.toLocaleString();
        summaryValues[1].textContent = totalRedeemed.toLocaleString();
        summaryValues[2].textContent = rewardsClaimed;
    }

    // ========== UPDATE USER NAME IN HEADER ==========
    const userNameSpan = document.querySelector('.user-name');
    if (userNameSpan && user.firstName) {
        userNameSpan.textContent = user.firstName;
    }

    // ========== FILTER FUNCTIONALITY ==========
    const timeFilter = document.getElementById('time-filter');
    const typeFilter = document.getElementById('type-filter');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function applyFilters() {
        const typeValue = typeFilter ? typeFilter.value : 'all';
        // Note: Time filter is not fully implemented in this demo
        // You can extend it to filter by date if needed

        timelineItems.forEach(item => {
            const itemClass = item.classList;
            let matchesType = true;

            if (typeValue !== 'all') {
                if (typeValue === 'earned' && !itemClass.contains('earned')) matchesType = false;
                if (typeValue === 'redeemed' && !itemClass.contains('redeemed')) matchesType = false;
                if (typeValue === 'bonus' && !itemClass.contains('bonus')) matchesType = false;
            }

            // Show/hide based on filter
            item.style.display = matchesType ? 'flex' : 'none';
        });

        // Optional: Show a message if no items visible
        // For simplicity, we skip that here
    }

    if (timeFilter && typeFilter) {
        timeFilter.addEventListener('change', applyFilters);
        typeFilter.addEventListener('change', applyFilters);
    }

    // ========== EXPORT BUTTON ==========
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Your history data is being prepared for download. You will receive it via email shortly.');
        });
    }

    // ========== PAGINATION ==========
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('next')) {
                alert('Loading next page...');
                return;
            }

            // Remove active class from all page buttons
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Simulate loading new page data
            alert(`Loading page ${this.textContent}. In a real app, this would load more history items.`);
        });
    });

    // ========== VIEW DETAILS BUTTONS (Rewards Table) ==========
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const rewardName = row.querySelector('h4').textContent;
            const date = row.cells[1].textContent; // second column
            const points = row.querySelector('.points-used').textContent;
            const status = row.querySelector('.status').textContent;

            alert(`Reward Details:\nName: ${rewardName}\nDate: ${date}\nPoints: ${points}\nStatus: ${status}\nFull details would appear in a modal.`);
        });
    });

    // ========== LOGOUT HANDLER (ensure logout link works) ==========
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