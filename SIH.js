// Global variables
let currentUser = null;
let currentSection = 'home';
let userPoints = 250;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set initial section
    showSection('home');
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize mock data
    loadMockData();
    
    console.log('EcoWaste App Initialized');
}

function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const loginModal = document.getElementById('loginModal');
        const qrModal = document.getElementById('qrModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === loginModal) {
            closeLogin();
        }
        if (event.target === qrModal) {
            closeQRScanner();
        }
        if (event.target === successModal) {
            closeSuccessModal();
        }
    }
}

function loadMockData() {
    // Load user data if exists
    const savedUser = localStorage.getItem('ecowasteUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userPoints = currentUser.points;
        updateUserInterface();
    }
    
    // Initialize charts if analytics section is visible
    if (currentSection === 'analytics') {
        initializeCharts();
    }
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        currentSection = sectionId;
        
        // Update navigation buttons
        updateNavigation(sectionId);
        
        // Close mobile menu
        closeMobileMenu();
        
        // Initialize section-specific functionality
        initializeSectionFeatures(sectionId);
    }
}

function updateNavigation(sectionId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate current section button
    navButtons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(getSectionDisplayName(sectionId).toLowerCase())) {
            btn.classList.add('active');
        }
    });
}

function getSectionDisplayName(sectionId) {
    const sectionNames = {
        'home': 'Home',
        'truck-tracking': 'Track Trucks',
        'sanitary': 'Sanitary',
        'medicine': 'Medicine',
        'rewards': 'Rewards',
        'education': 'Education',
        'notifications': 'Notifications',
        'analytics': 'Analytics',
        'help': 'Help',
        'complaints': 'Complaints'
    };
    return sectionNames[sectionId] || sectionId;
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('show');
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.remove('show');
}

// Authentication functions
function toggleLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
}

function showAuthTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.auth-tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update forms
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    
    const targetForm = document.getElementById(tabName + 'Form');
    if (targetForm) {
        targetForm.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    // Simulate login
    currentUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        society: 'Green Valley Apartments',
        points: userPoints,
        joinedDate: '2024-01-15'
    };
    
    // Save to localStorage
    localStorage.setItem('ecowasteUser', JSON.stringify(currentUser));
    
    // Update UI
    updateUserInterface();
    closeLogin();
    
    showSuccess('Login Successful!', 'Welcome back to EcoWaste!');
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Simulate registration
    currentUser = {
        id: Date.now().toString(),
        name: formData.get('name') || 'New User',
        email: formData.get('email') || 'user@example.com',
        phone: formData.get('phone') || '+91 0000000000',
        society: formData.get('society') || 'Unknown Area',
        points: 50, // Welcome bonus
        joinedDate: new Date().toISOString().split('T')[0]
    };
    
    userPoints = 50;
    
    // Save to localStorage
    localStorage.setItem('ecowasteUser', JSON.stringify(currentUser));
    
    // Update UI
    updateUserInterface();
    closeLogin();
    
    showSuccess('Registration Successful!', 'Welcome to EcoWaste! You\'ve earned 50 welcome points!');
}

function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userPoints = document.getElementById('userPoints');
    const userWelcome = document.getElementById('userWelcome');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const welcomeName = document.getElementById('welcomeName');
    const welcomePoints = document.getElementById('welcomePoints');
    const totalPoints = document.getElementById('totalPoints');
    
    if (currentUser) {
        // Hide login button, show user info
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        
        // Update user details
        userName.textContent = currentUser.name;
        userPoints.textContent = currentUser.points + ' pts';
        
        // Update welcome section
        userWelcome.style.display = 'block';
        getStartedBtn.style.display = 'none';
        welcomeName.textContent = currentUser.name.split(' ')[0];
        welcomePoints.textContent = currentUser.points;
        
        // Update rewards section
        if (totalPoints) {
            totalPoints.textContent = currentUser.points;
        }
    } else {
        // Show login button, hide user info
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        userWelcome.style.display = 'none';
        getStartedBtn.style.display = 'block';
    }
}

// Section-specific functions
function initializeSectionFeatures(sectionId) {
    switch(sectionId) {
        case 'analytics':
            setTimeout(initializeCharts, 100); // Delay to ensure DOM is ready
            break;
        case 'notifications':
            updateNotificationCounts();
            break;
        case 'rewards':
            updateRewardsInterface();
            break;
    }
}

// Truck Tracking functions
function searchTrucks() {
    const societyInput = document.getElementById('societyInput');
    const society = societyInput.value.trim();
    
    if (!society) {
        alert('Please enter your society/area name');
        return;
    }
    
    const trucksContainer = document.getElementById('trucksContainer');
    trucksContainer.innerHTML = '<div class="loading">Searching for trucks in your area...</div>';
    
    // Simulate API call
    setTimeout(() => {
        const mockTrucks = generateMockTrucks(society);
        displayTrucks(mockTrucks);
    }, 1500);
}

function generateMockTrucks(society) {
    const trucks = [
        {
            id: '1',
            driverName: 'Rajesh Kumar',
            plateNumber: 'DL 1234',
            currentLocation: {
                address: society
            },
            eta: Math.floor(Math.random() * 30) + 5 + ' mins',
            status: 'active',
            wasteType: 'general'
        },
        {
            id: '2',
            driverName: 'Amit Singh',
            plateNumber: 'DL 5678',
            currentLocation: {
                address: 'Near ' + society
            },
            eta: Math.floor(Math.random() * 45) + 10 + ' mins',
            status: 'active',
            wasteType: 'sanitary'
        }
    ];
    
    return trucks.slice(0, Math.random() > 0.5 ? 2 : 1);
}

function displayTrucks(trucks) {
    const trucksContainer = document.getElementById('trucksContainer');
    
    if (trucks.length === 0) {
        trucksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No trucks found</h3>
                <p>No waste collection trucks are currently scheduled for this area. Please try again later.</p>
            </div>
        `;
        return;
    }
    
    const trucksHTML = trucks.map(truck => `
        <div class="truck-card">
            <div class="truck-header">
                <div class="truck-info">
                    <div class="truck-details">
                        <h3>${truck.driverName}</h3>
                        <p>Vehicle: ${truck.plateNumber}</p>
                    </div>
                    <div class="truck-status ${truck.status}">
                        ${truck.status}
                    </div>
                </div>
                <div class="truck-meta">
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${truck.currentLocation.address}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>ETA: ${truck.eta}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-trash"></i>
                        <span>${truck.wasteType} waste</span>
                    </div>
                </div>
            </div>
            <div class="truck-actions">
                <button class="action-btn primary" onclick="trackTruck('${truck.id}')">
                    <i class="fas fa-eye"></i> Live Track
                </button>
                <button class="action-btn secondary" onclick="callTruck('${truck.plateNumber}')">
                    <i class="fas fa-phone"></i> Call Driver
                </button>
            </div>
        </div>
    `).join('');
    
    trucksContainer.innerHTML = trucksHTML;
}

function trackTruck(truckId) {
    showSuccess('Live Tracking Started!', `You will receive real-time updates for truck ${truckId}`);
}

function callTruck(plateNumber) {
    showSuccess('Calling Driver...', `Connecting you with the driver of ${plateNumber}`);
}

// QR Scanner functions
function startQRScanner(type) {
    const modal = document.getElementById('qrModal');
    modal.classList.add('show');
    modal.setAttribute('data-scan-type', type);
}

function closeQRScanner() {
    const modal = document.getElementById('qrModal');
    modal.classList.remove('show');
}

function simulateQRScan() {
    const modal = document.getElementById('qrModal');
    const scanType = modal.getAttribute('data-scan-type');
    
    closeQRScanner();
    
    // Simulate processing delay
    setTimeout(() => {
        if (scanType === 'sanitary') {
            handleSanitaryDisposal();
        } else if (scanType === 'medicine') {
            handleMedicineScanning();
        }
    }, 1000);
}

function handleSanitaryDisposal() {
    if (!currentUser) {
        alert('Please login to earn points for disposal');
        return;
    }
    
    const pointsEarned = 10;
    currentUser.points += pointsEarned;
    userPoints = currentUser.points;
    
    // Update localStorage
    localStorage.setItem('ecowasteUser', JSON.stringify(currentUser));
    
    // Update UI
    updateUserInterface();
    
    showSuccess('Disposal Recorded!', `Great job! You've earned ${pointsEarned} points for responsible disposal.`);
}

function handleMedicineScanning() {
    const medicines = [
        'Paracetamol 500mg - Expires: Dec 2024',
        'Vitamin C - Expires: Mar 2025',
        'Cough Syrup - Expires: Jan 2024 (EXPIRED)'
    ];
    
    const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
    showSuccess('Medicine Scanned!', `Added to your medicine cabinet: ${randomMedicine}`);
}

// Rewards functions
function showRewardsTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.rewards-tabs .tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tabs
    const tabs = document.querySelectorAll('.rewards-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(tabName + 'Rewards');
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

function redeemReward(rewardType, pointsRequired) {
    if (!currentUser) {
        alert('Please login to redeem rewards');
        return;
    }
    
    if (currentUser.points < pointsRequired) {
        alert('Insufficient points! You need ' + pointsRequired + ' points for this reward.');
        return;
    }
    
    // Deduct points
    currentUser.points -= pointsRequired;
    
    // Update localStorage
    localStorage.setItem('ecowasteUser', JSON.stringify(currentUser));
    
    // Update UI
    updateUserInterface();
    
    // Generate voucher code
    const voucherCode = generateVoucherCode();
    
    showSuccess('Reward Redeemed!', `Your ${rewardType} voucher code is: ${voucherCode}`);
    
    // Update rewards interface
    updateRewardsInterface();
}

function generateVoucherCode() {
    return 'ECO' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function updateRewardsInterface() {
    if (!currentUser) return;
    
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    redeemButtons.forEach(btn => {
        if (btn.onclick) {
            const pointsRequired = parseInt(btn.onclick.toString().match(/\d+/)[0]);
            if (currentUser.points < pointsRequired) {
                btn.classList.add('insufficient');
                btn.textContent = 'Insufficient Points';
                btn.disabled = true;
            } else {
                btn.classList.remove('insufficient');
                btn.textContent = 'Redeem';
                btn.disabled = false;
            }
        }
    });
}

function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showSuccess('Code Copied!', `Voucher code ${code} copied to clipboard`);
    });
}

// Education functions
function showEducationTopic(topicId) {
    const topics = {
        'sanitary-waste': 'Sanitary Waste Management',
        'environmental-impact': 'Environmental Impact',
        'health-hygiene': 'Health & Hygiene',
        'recycling': 'Recycling & Reuse',
        'government-policies': 'Government Policies',
        'community-action': 'Community Action'
    };
    
    const topicName = topics[topicId] || topicId;
    showSuccess('Opening Topic', `Loading educational content for: ${topicName}`);
}

function readArticle(articleId) {
    const articles = {
        'menstrual-hygiene': 'Breaking Menstrual Hygiene Taboos',
        'plastic-pollution': 'The Hidden Impact of Plastic Pollution',
        'sustainable-periods': 'Sustainable Period Products Guide'
    };
    
    const articleName = articles[articleId] || articleId;
    showSuccess('Opening Article', `Reading: ${articleName}`);
}

function playVideo(videoId) {
    const videos = {
        'proper-disposal': 'Proper Disposal Techniques',
        'qr-scanning': 'How to Use QR Scanning',
        'environmental-benefits': 'Environmental Benefits'
    };
    
    const videoName = videos[videoId] || videoId;
    showSuccess('Playing Video', `Now playing: ${videoName}`);
}

// Notifications functions
function showNotificationTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.notification-tabs .tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter notifications based on tab
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        if (tabName === 'all') {
            notification.style.display = 'flex';
        } else {
            const hasClass = notification.classList.contains(tabName);
            notification.style.display = hasClass ? 'flex' : 'none';
        }
    });
}

function markAsRead(button) {
    const notificationItem = button.closest('.notification-item');
    notificationItem.classList.remove('unread');
    notificationItem.classList.add('read');
    button.style.display = 'none';
    
    updateNotificationCounts();
}

function updateNotificationCounts() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const notificationCounts = document.querySelectorAll('.notification-count, .notification-badge');
    
    notificationCounts.forEach(count => {
        count.textContent = unreadCount;
        count.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
    
    // Update tab text
    const allTab = document.querySelector('.notification-tabs .tab-btn');
    if (allTab) {
        allTab.textContent = `All (${unreadCount})`;
    }
}

// Analytics functions
function initializeCharts() {
    // This is a simplified version - in a real app, you'd use Chart.js or similar
    const wasteChart = document.getElementById('wasteChart');
    const participationChart = document.getElementById('participationChart');
    
    if (wasteChart) {
        // Simulate chart rendering
        wasteChart.style.background = 'linear-gradient(45deg, #10b981, #3b82f6)';
        wasteChart.style.borderRadius = '8px';
        wasteChart.innerHTML = '<div style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-weight: bold;">Waste Collection Trends</div>';
    }
    
    if (participationChart) {
        participationChart.style.background = 'linear-gradient(45deg, #f97316, #ec4899)';
        participationChart.style.borderRadius = '8px';
        participationChart.innerHTML = '<div style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-weight: bold;">User Participation</div>';
    }
}

// Help functions
function searchHelp(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(query.toLowerCase()) || answer.includes(query.toLowerCase()) || query === '') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function showHelpCategory(categoryId) {
    const categories = {
        'getting-started': 'Getting Started',
        'qr-scanning': 'QR Code Scanning',
        'rewards': 'Rewards & Points',
        'truck-tracking': 'Truck Tracking',
        'technical': 'Technical Issues',
        'account': 'Account Management'
    };
    
    const categoryName = categories[categoryId] || categoryId;
    showSuccess('Help Category', `Opening help for: ${categoryName}`);
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current FAQ
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function startChat() {
    showSuccess('Live Chat', 'Connecting you with our support team...');
}

function showGuide(guideId) {
    const guides = {
        'first-disposal': 'Your First Disposal',
        'qr-scanning-guide': 'QR Scanning Tutorial',
        'rewards-guide': 'Maximizing Rewards'
    };
    
    const guideName = guides[guideId] || guideId;
    showSuccess('Opening Guide', `Loading: ${guideName}`);
}

// Complaints functions
function handleComplaintTypeChange() {
    const complaintType = document.getElementById('complaintType');
    const description = document.getElementById('complaintDescription');
    
    const templates = {
        'truck_delay': 'The waste collection truck has not arrived at the scheduled time in my area.',
        'bin_overflow': 'The sanitary waste bin at my location is overflowing and needs immediate attention.',
        'improper_disposal': 'I noticed improper waste disposal practices in my area that need to be addressed.',
        'delayed_collection': 'Waste collection in my area has been consistently delayed.',
        'app_issue': 'I am experiencing technical difficulties with the mobile application.',
        'reward_issue': 'I am facing issues with my reward points or redemption process.'
    };
    
    if (templates[complaintType.value]) {
        description.value = templates[complaintType.value];
    } else {
        description.value = '';
    }
}

function submitComplaint(event) {
    event.preventDefault();
    
    const complaintType = document.getElementById('complaintType').value;
    const location = document.getElementById('complaintLocation').value;
    const description = document.getElementById('complaintDescription').value;
    const phone = document.getElementById('complaintPhone').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    
    if (!complaintType || !description) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Generate complaint ID
    const complaintId = '#C' + String(Math.floor(Math.random() * 1000) + 100);
    
    // Clear form
    event.target.reset();
    
    showSuccess('Complaint Submitted!', `Your complaint has been submitted with ID: ${complaintId}. We will contact you soon.`);
    
    // Add to complaints list (in a real app, this would be handled by the backend)
    addComplaintToList({
        id: complaintId,
        type: complaintType,
        location: location,
        description: description,
        priority: priority,
        status: 'pending',
        timestamp: new Date()
    });
}

function quickComplaint(type) {
    const complaintType = document.getElementById('complaintType');
    complaintType.value = type;
    handleComplaintTypeChange();
    
    // Scroll to form
    document.querySelector('.complaint-form-section').scrollIntoView({
        behavior: 'smooth'
    });
}

function addComplaintToList(complaint) {
    const complaintsList = document.getElementById('complaintsList');
    
    const priorityColors = {
        'low': '#059669',
        'medium': '#d97706',
        'high': '#dc2626'
    };
    
    const complaintHTML = `
        <div class="complaint-item">
            <div class="complaint-header">
                <div class="complaint-info">
                    <h4>${complaint.type.replace('_', ' ')}</h4>
                    <p class="complaint-id">ID: ${complaint.id}</p>
                </div>
                <div class="complaint-status-badge pending">
                    <i class="fas fa-clock"></i>
                    Pending
                </div>
            </div>
            <div class="complaint-details">
                <p>${complaint.description}</p>
                <div class="complaint-meta">
                    <span><i class="fas fa-calendar"></i> Submitted: Just now</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${complaint.location || 'N/A'}</span>
                    <span style="color: ${priorityColors[complaint.priority]}"><i class="fas fa-flag"></i> Priority: ${complaint.priority}</span>
                </div>
            </div>
        </div>
    `;
    
    complaintsList.insertAdjacentHTML('afterbegin', complaintHTML);
}

function submitFeedback() {
    showSuccess('Feedback Sent!', 'Thank you for your feedback. We appreciate your input!');
    document.querySelector('.feedback-form textarea').value = '';
}

// Medicine section functions
function showExchangeForm() {
    showSuccess('Medicine Exchange', 'Opening medicine exchange form...');
}

function showDisposalForm() {
    showSuccess('Safe Disposal', 'Opening safe disposal guidelines...');
}

// Utility functions
function showSuccess(title, message) {
    const modal = document.getElementById('successModal');
    const titleElement = document.getElementById('successTitle');
    const messageElement = document.getElementById('successMessage');
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    modal.classList.add('show');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 3000);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Add some animation and interaction enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.opacity = '0.7';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 300);
            }
        });
    });
    
    // Initialize tooltips and enhanced interactions
    addEnhancedInteractions();
});

function addEnhancedInteractions() {
    // Add hover effects for cards
    const cards = document.querySelectorAll('.feature-card, .stat-card, .action-card, .topic-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add typing effect for hero title (only on first load)
    if (!localStorage.getItem('heroAnimated')) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            
            function typeWriter() {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            
            setTimeout(typeWriter, 1000);
            localStorage.setItem('heroAnimated', 'true');
        }
    }
}