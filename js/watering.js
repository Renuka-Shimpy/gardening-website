// Watering Schedule functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeWateringSchedule();
});

function initializeWateringSchedule() {
    loadWateringSchedule();
    setupWateringReminders();
    setupClearGarden();
}

// Load and display watering schedule
function loadWateringSchedule() {
    const scheduleTable = document.getElementById('scheduleTable');
    const upcomingReminders = document.getElementById('upcomingReminders');
    
    if (!scheduleTable || !upcomingReminders) return;
    
    const myGarden = JSON.parse(localStorage.getItem('myGarden') || '[]');
    
    if (myGarden.length === 0) {
        scheduleTable.innerHTML = '<p class="text-center">No plants in your garden. <a href="plants.html">Add some plants</a> to see your watering schedule.</p>';
        upcomingReminders.innerHTML = '<p class="text-center">No upcoming reminders.</p>';
        return;
    }
    
    // Create schedule table
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Plant Name</th>
                    <th>Type</th>
                    <th>Watering Frequency</th>
                    <th>Last Watered</th>
                    <th>Next Watering</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let remindersHTML = '';
    const today = new Date();
    const upcomingRemindersList = [];
    
    myGarden.forEach((plant, index) => {
        const nextWatering = new Date(plant.nextWatering);
        const daysUntilWatering = Math.ceil((nextWatering - today) / (1000 * 60 * 60 * 24));
        let status = 'On Track';
        let statusClass = 'status-good';
        
        if (daysUntilWatering <= 0) {
            status = 'Water Now!';
            statusClass = 'status-urgent';
        } else if (daysUntilWatering <= 2) {
            status = 'Soon';
            statusClass = 'status-warning';
        }
        
        tableHTML += `
            <tr>
                <td>${plant.name}</td>
                <td>${plant.type}</td>
                <td>${plant.wateringFrequency}</td>
                <td>${formatDate(new Date(plant.addedDate))}</td>
                <td>${formatDate(nextWatering)}</td>
                <td class="${statusClass}">${status}</td>
            </tr>
        `;
        
        // Add to upcoming reminders if within 3 days
        if (daysUntilWatering <= 3) {
            upcomingRemindersList.push({
                plant: plant.name,
                date: nextWatering,
                days: daysUntilWatering,
                status: status
            });
        }
    });
    
    tableHTML += '</tbody></table>';
    scheduleTable.innerHTML = tableHTML;
    
    // Sort reminders by date (soonest first)
    upcomingRemindersList.sort((a, b) => a.days - b.days);
    
    if (upcomingRemindersList.length === 0) {
        remindersHTML = '<p class="text-center">No upcoming watering reminders in the next 3 days.</p>';
    } else {
        upcomingRemindersList.forEach(reminder => {
            const urgencyClass = reminder.days <= 0 ? 'reminder-urgent' : 
                               reminder.days <= 1 ? 'reminder-warning' : 'reminder-normal';
            
            remindersHTML += `
                <div class="reminder-item ${urgencyClass}">
                    <h4>${reminder.plant}</h4>
                    <p>Next watering: ${formatDate(reminder.date)}</p>
                    <p><strong>${reminder.status}</strong> - ${reminder.days <= 0 ? 'Overdue!' : `${reminder.days} day(s) from now`}</p>
                </div>
            `;
        });
    }
    
    upcomingReminders.innerHTML = remindersHTML;
}

// Setup watering reminder notifications
function setupWateringReminders() {
    const enableNotificationsBtn = document.getElementById('enableNotifications');
    
    if (enableNotificationsBtn) {
        enableNotificationsBtn.addEventListener('click', function() {
            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    scheduleWateringNotifications();
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            scheduleWateringNotifications();
                        }
                    });
                }
            } else {
                alert('Browser notifications are not supported in this browser.');
            }
        });
    }
}

// Schedule browser notifications for watering
function scheduleWateringNotifications() {
    const myGarden = JSON.parse(localStorage.getItem('myGarden') || '[]');
    const today = new Date();
    
    myGarden.forEach(plant => {
        const nextWatering = new Date(plant.nextWatering);
        const daysUntilWatering = Math.ceil((nextWatering - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilWatering <= 1) {
            // Show immediate notification for overdue or due today plants
            showWateringNotification(plant);
        }
    });
    
    showNotification('Watering reminders enabled! You will receive notifications for due plants.');
}

// Show watering notification
function showWateringNotification(plant) {
    if (Notification.permission === 'granted') {
        new Notification('🌿 Time to Water!', {
            body: `Your ${plant.name} needs watering today!`,
            icon: plant.image
        });
    }
}

// Setup clear garden functionality
function setupClearGarden() {
    const clearGardenBtn = document.getElementById('clearGarden');
    
    if (clearGardenBtn) {
        clearGardenBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all plants from your garden?')) {
                localStorage.removeItem('myGarden');
                loadWateringSchedule();
                showNotification('Garden cleared!');
            }
        });
    }
}

// Utility function to format dates
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add CSS for status indicators
const wateringStyles = `
    .status-good { color: #2e7d32; font-weight: 600; }
    .status-warning { color: #ff9800; font-weight: 600; }
    .status-urgent { color: #d32f2f; font-weight: 600; }
    
    .reminder-urgent { border-left-color: #d32f2f; background: rgba(211, 47, 47, 0.1); }
    .reminder-warning { border-left-color: #ff9800; background: rgba(255, 152, 0, 0.1); }
    .reminder-normal { border-left-color: #2e7d32; background: rgba(46, 125, 50, 0.1); }
`;

// Inject styles
if (!document.querySelector('#watering-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'watering-styles';
    styleSheet.textContent = wateringStyles;
    document.head.appendChild(styleSheet);
}