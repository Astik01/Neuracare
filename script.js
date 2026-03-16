/* =====================================================
   NEURACARE — DYNAMIC JS  (Premium Redesign Layer)
   ===================================================== */

/* ── SCROLL REVEAL ─────────────────────────────── */
function initScrollReveal() {
    const els = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
}

/* ── ANIMATED COUNTER ──────────────────────────── */
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const suffix = target >= 1000 ? 'K+' : (target === 50 ? '+' : '+');
        const displayTarget = target >= 1000 ? target / 1000 : target;
        const duration = 1800;
        const step = displayTarget / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, displayTarget);
            counter.textContent = (target >= 1000 ? Math.ceil(current) : Math.ceil(current)) + suffix;
            if (current >= displayTarget) clearInterval(timer);
        }, 16);
    });
}

let countersStarted = false;
function maybeStartCounters() {
    if (countersStarted) return;
    const statsEl = document.querySelector('.stats-strip');
    if (!statsEl) return;
    const rect = statsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight) { animateCounters(); countersStarted = true; }
}

/* ── NAVBAR SCROLL CLASS ───────────────────────── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 100) current = s.id;
        });
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
        maybeStartCounters();
    });
}

/* ── MOBILE NAV ────────────────────────────────── */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
}

/* ── SMOOTH ANCHOR SCROLLING ─────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
}

/* ── BOOKING MODAL HELPERS ───────────────────── */
function initBookingModal() {
    const d = document.getElementById('booking-date');
    if (d) d.min = new Date().toISOString().split('T')[0];
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeBookingModal();
    });
}

/* ── CLEAR RESULTS ───────────────────────────── */
function clearResults() {
    currentSymptoms = [];
    updateSymptomsList();
    const r = document.getElementById('analysis-results');
    const i = document.getElementById('symptom-input');
    if (r) r.style.display = 'none';
    if (i) i.value = '';
    showNotification('Cleared. Start a new symptom check.', 'info');
}

/* ── REGISTRATION HANDLER ────────────────────── */
function handleRegistration(event) {
    event.preventDefault();
    const msg = document.getElementById('registration-message');
    const btn = event.target.querySelector('button[type="submit"]');
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    if (!name || !email) { showNotification('Please fill in all required fields.', 'warning'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotification('Invalid email address.', 'error'); return; }
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account…';
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Create My Account';
        msg.className = 'registration-message success';
        msg.textContent = `🎉 Welcome, ${name}! Your account has been created. Check ${email} for your confirmation.`;
        event.target.reset();
        showNotification(`Account created for ${name}!`, 'success');
    }, 1600);
}

/* ── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initScrollReveal === 'function') initScrollReveal();
    if (typeof initNavbar === 'function') initNavbar();
    if (typeof initMobileNav === 'function') initMobileNav();
    if (typeof initSmoothScroll === 'function') initSmoothScroll();
    if (document.getElementById('booking-modal')) { if (typeof initBookingModal === 'function') initBookingModal(); }
    if (document.getElementById('doctors-list')) { if (typeof loadSampleDoctors === 'function') loadSampleDoctors(); }
    if (document.getElementById('chat-window')) { if (typeof initializeChatbot === 'function') initializeChatbot(); }
    if (document.querySelector('.stats-strip')) { if (typeof maybeStartCounters === 'function') setTimeout(maybeStartCounters, 300); }
    if (document.getElementById('bookings-list')) { if (typeof renderMyBookings === 'function') renderMyBookings(); }
    window.addEventListener('hashchange', function () {
        if (window.location.hash === '#my-bookings' && typeof renderMyBookings === 'function') renderMyBookings();
    });
    document.querySelectorAll('a[href="#my-bookings"], a[href="my-bookings.html"]').forEach(function (a) {
        a.addEventListener('click', function () {
            setTimeout(function () { if (typeof renderMyBookings === 'function') renderMyBookings(); }, 100);
        });
    });
});

/* ── NOTIFICATION ────────────────────────────── */
(function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
    @keyframes slideIn { from { transform:translateX(400px); opacity:0; } to { transform:translateX(0); opacity:1; } }
    @keyframes slideOut { from { transform:translateX(0); opacity:1; } to { transform:translateX(400px); opacity:0; } }
    .notification {
      position:fixed; top:90px; right:20px; z-index:10000;
      padding:14px 22px; border-radius:12px; font-weight:500; font-size:14px;
      backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.1);
      max-width:380px; animation:slideIn .3s ease; box-shadow:0 8px 32px rgba(0,0,0,.4);
    }
    .notification-success { background:rgba(16,185,129,.85); color:#fff; }
    .notification-error   { background:rgba(239,68,68,.85);  color:#fff; }
    .notification-warning { background:rgba(245,158,11,.85); color:#fff; }
    .notification-info    { background:rgba(124,58,237,.85); color:#fff; }
    .booking-message { padding:12px 16px; border-radius:10px; font-size:14px; margin-top:12px; }
    .booking-message.success { background:rgba(16,185,129,.15); border:1px solid rgba(16,185,129,.3); color:#34d399; }
    .booking-message.error   { background:rgba(239,68,68,.15);  border:1px solid rgba(239,68,68,.3);  color:#fca5a5; }
    .loading { display:inline-block; width:18px; height:18px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .8s linear infinite; vertical-align:middle; margin-right:8px; }
    @keyframes spin { to { transform:rotate(360deg); } }
  `;
    document.head.appendChild(s);
})();

// =====================================================================
// EXISTING APPLICATION LOGIC (preserved below)
// =====================================================================

// Smart Healthcare Application - Lightweight JavaScript

// Sample data for demonstration
const sampleDoctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "cardiology",
        specialties: ["Cardiology", "Internal Medicine"],
        rating: 4.9,
        experience: "15 years",
        fee: "$150",
        availability: "Available Today",
        avatar: "fas fa-user-md",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
        bio: "Board-certified cardiologist with over 15 years of experience. Specializes in preventive cardiology and heart failure management."
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "dermatology",
        specialties: ["Dermatology", "General Practice"],
        rating: 4.8,
        experience: "12 years",
        fee: "$120",
        availability: "Available Tomorrow",
        avatar: "fas fa-user-md",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
        bio: "Dermatologist focused on medical and cosmetic dermatology. Expert in skin cancer screening and treatment."
    },
    {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialty: "pediatrics",
        specialties: ["Pediatrics", "Family Medicine"],
        rating: 4.9,
        experience: "10 years",
        fee: "$100",
        availability: "Available This Week",
        avatar: "fas fa-user-md",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
        bio: "Pediatrician dedicated to child health from infancy through adolescence. Passionate about preventive care and family education."
    }
];

const symptomDatabase = {
    symptoms: [
        "headache", "fever", "cough", "chest pain", "shortness of breath",
        "nausea", "vomiting", "diarrhea", "abdominal pain", "fatigue",
        "dizziness", "rash", "joint pain", "back pain", "muscle pain",
        "sore throat", "runny nose", "congestion", "sneezing", "itchy eyes",
        "weight loss", "weight gain", "loss of appetite", "insomnia", "anxiety"
    ],
    conditions: {
        "headache": ["migraine", "tension headache", "sinusitis", "stress"],
        "fever": ["viral infection", "bacterial infection", "flu", "common cold"],
        "chest pain": ["angina", "heart attack", "muscle strain", "anxiety"],
        "cough": ["common cold", "bronchitis", "pneumonia", "allergies"],
        "shortness of breath": ["asthma", "heart failure", "anxiety", "pneumonia"]
    }
};

// Global variables
let currentSymptoms = [];
let currentSection = 'home';
let selectedDoctorId = null;

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS via style tag
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    loadSampleDoctors();
    setupEventListeners();
    setupBookingModal();
    if (typeof renderMyBookings === 'function') renderMyBookings();
});

function setupBookingModal() {
    // Set minimum date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('booking-modal');
            if (modal && modal.style.display === 'flex') {
                closeBookingModal();
            }
        }
    });
}

function initializeApp() {
    // Set active navigation
    updateNavigation();

    // Initialize chatbot
    initializeChatbot();

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupEventListeners() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            const isActive = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
        });
    });

    // Symptom input suggestions
    const symptomInput = document.getElementById('symptom-input');
    if (symptomInput) {
        symptomInput.addEventListener('input', function () {
            showSuggestions(this.value);
        });
    }

    // User registration form submission
    const registrationForm = document.getElementById('user-registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleFormSubmission);
    }
}

// Navigation functions
function showSection(sectionId) {
    currentSection = sectionId;
    updateNavigation();

    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Symptom checker functions
function showSuggestions(query) {
    const suggestions = document.getElementById('symptom-suggestions');
    if (!suggestions) return;

    if (!query || query.length < 2) {
        suggestions.style.display = 'none';
        return;
    }

    const matches = symptomDatabase.symptoms.filter(symptom =>
        symptom.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (matches.length > 0) {
        suggestions.innerHTML = matches.map(symptom =>
            `<div class="suggestion-item" onclick="selectSuggestion('${symptom}')">${symptom}</div>`
        ).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

function selectSuggestion(symptom) {
    const input = document.getElementById('symptom-input');
    const suggestions = document.getElementById('symptom-suggestions');
    if (input) input.value = symptom;
    if (suggestions) suggestions.style.display = 'none';
    addSymptom();
}

function handleSymptomInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSymptom();
    }
}

function addSymptom() {
    const input = document.getElementById('symptom-input');
    if (!input) return;

    const symptom = input.value.trim().toLowerCase();
    const suggestions = document.getElementById('symptom-suggestions');

    if (!symptom) {
        showNotification('Please enter a symptom.', 'warning');
        return;
    }

    if (currentSymptoms.find(s => s.name === symptom)) {
        showNotification('This symptom is already added.', 'warning');
        input.value = '';
        if (suggestions) suggestions.style.display = 'none';
        return;
    }

    const severity = Math.random() > 0.5 ? 'moderate' : 'mild';

    currentSymptoms.push({
        id: Date.now(),
        name: symptom,
        severity: severity
    });

    updateSymptomsList();
    input.value = '';
    if (suggestions) suggestions.style.display = 'none';
    showNotification('Symptom added successfully.', 'success');
}

function removeSymptom(id) {
    const symptom = currentSymptoms.find(s => s.id === id);
    currentSymptoms = currentSymptoms.filter(s => s.id !== id);
    updateSymptomsList();
    if (symptom) {
        showNotification(`Removed: ${symptom.name}`, 'info');
    }
}

function updateSymptomsList() {
    const container = document.getElementById('symptoms-list');
    if (!container) return;
    if (currentSymptoms.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = currentSymptoms.map(symptom => `
        <div class="symptom-tag">
            <span>${symptom.name}</span>
            <span style="opacity:.6;font-size:10px;text-transform:uppercase">${symptom.severity}</span>
            <button onclick="removeSymptom(${symptom.id})" aria-label="Remove ${symptom.name}">×</button>
        </div>
    `).join('');
}

function analyzeSymptoms() {
    if (currentSymptoms.length === 0) {
        const input = document.getElementById('symptom-input');
        if (input) {
            input.focus();
            input.style.borderColor = 'var(--error)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
        showNotification('Please add at least one symptom before analyzing.', 'warning');
        return;
    }

    const ageGroup = document.getElementById('age-group').value;
    const gender = document.getElementById('gender').value;

    // Show loading state
    const resultsDiv = document.getElementById('analysis-results');
    const resultsContent = document.getElementById('results-content');

    resultsDiv.style.display = 'block';
    resultsContent.innerHTML = '<div class="loading"></div> Analyzing symptoms...';

    // Simulate AI analysis
    setTimeout(() => {
        const analysis = performAIAnalysis(currentSymptoms, ageGroup, gender);
        displayAnalysisResults(analysis);
    }, 2000);
}

function performAIAnalysis(symptoms, ageGroup, gender) {
    const results = [];

    symptoms.forEach(symptom => {
        const possibleConditions = symptomDatabase.conditions[symptom.name] || ['General condition'];

        possibleConditions.forEach(condition => {
            const probability = Math.random() * 0.8 + 0.2; // 20-100%
            const urgency = probability > 0.7 ? 'high' : probability > 0.4 ? 'medium' : 'low';

            results.push({
                condition: condition,
                probability: Math.round(probability * 100),
                urgency: urgency,
                symptoms: [symptom.name]
            });
        });
    });

    // Sort by probability and take top 3
    return results.sort((a, b) => b.probability - a.probability).slice(0, 3);
}

function displayAnalysisResults(analysis) {
    const resultsContent = document.getElementById('results-content');
    if (!resultsContent) return;

    if (analysis.length === 0) {
        resultsContent.innerHTML = '<p style="color: var(--neutral-600); padding: 20px; text-align: center;">No specific conditions identified. Please consult with a healthcare professional for a proper diagnosis.</p>';
        return;
    }

    resultsContent.innerHTML = `
        <div class="result-item urgency-${analysis[0].urgency}">
            <h4>${analysis[0].condition}</h4>
            <span class="probability">${analysis[0].probability}% probability</span>
            <p>Based on your symptoms: ${analysis[0].symptoms.join(', ')}</p>
            <div class="recommendations">
                <strong>Recommendation:</strong> 
                ${analysis[0].urgency === 'high' ? 'Seek medical attention immediately' :
            analysis[0].urgency === 'medium' ? 'Schedule an appointment within 24-48 hours' :
                'Monitor symptoms and consult if they worsen'}
            </div>
        </div>
        
        ${analysis.slice(1).map(result => `
            <div class="result-item urgency-${result.urgency}">
                <h4>${result.condition}</h4>
                <span class="probability">${result.probability}% probability</span>
                <p>Based on your symptoms: ${result.symptoms.join(', ')}</p>
            </div>
        `).join('')}
        
        <div class="analysis-actions">
            <button class="btn btn-primary" onclick="showSection('appointments')">
                <i class="fas fa-calendar"></i>
                Book Appointment
            </button>
            <button class="btn btn-secondary" onclick="resetAnalysis()">
                <i class="fas fa-redo"></i>
                New Analysis
            </button>
        </div>
    `;
}

function resetAnalysis() {
    currentSymptoms = [];
    updateSymptomsList();
    const results = document.getElementById('analysis-results');
    const input = document.getElementById('symptom-input');
    if (results) results.style.display = 'none';
    if (input) input.value = '';
    showNotification('Analysis reset. You can start a new symptom check.', 'info');
}

// Doctor search and booking functions
var useDoctorProfileLinks = false;
function loadSampleDoctors() {
    const doctorsList = document.getElementById('doctors-list');
    if (!doctorsList) return;
    useDoctorProfileLinks = !document.getElementById('booking-modal');
    doctorsList.innerHTML = sampleDoctors.map(doctor => renderDoctorCard(doctor)).join('');
}

function renderDoctorCard(doctor) {
    const bookBtn = useDoctorProfileLinks
        ? `<a href="doctor-profile.html?id=${doctor.id}" class="btn btn-primary" style="flex:2;justify-content:center;text-decoration:none"><i class="fas fa-calendar-plus"></i> Book Now</a><a href="doctor-profile.html?id=${doctor.id}" class="btn btn-ghost" style="flex:1;justify-content:center;text-decoration:none"><i class="fas fa-user"></i></a>`
        : `<button class="btn btn-primary" onclick="bookAppointment(${doctor.id})" style="flex:2;justify-content:center"><i class="fas fa-calendar-plus"></i> Book Now</button><button class="btn btn-ghost" onclick="viewProfile(${doctor.id})" style="flex:1;justify-content:center"><i class="fas fa-user"></i></button>`;
    const img = doctor.photo ? `<img src="${doctor.photo}" alt="${doctor.name}" class="doctor-card-photo">` : `<div class="doctor-avatar"><i class="${doctor.avatar}"></i><span class="available-dot"></span></div>`;
    return `
        <div class="glass-card doctor-card">
            ${img}
            <div class="doctor-name">${doctor.name}</div>
            <div class="doctor-specialty">${doctor.specialties[0]}</div>
            <div class="doctor-meta">
                <span><i class="fas fa-star"></i> ${doctor.rating}/5</span>
                <span><i class="fas fa-briefcase" style="color:var(--cyan)"></i> ${doctor.experience}</span>
                <span><i class="fas fa-dollar-sign" style="color:var(--green)"></i> ${doctor.fee}</span>
            </div>
            <div class="specialty-tags">${doctor.specialties.map(s => `<span class="spec-tag">${s}</span>`).join('')}</div>
            <div style="font-size:12px;color:var(--green);margin-bottom:20px"><i class="fas fa-circle" style="font-size:8px"></i> ${doctor.availability}</div>
            <div class="doctor-actions">${bookBtn}</div>
        </div>
    `;
}

function searchDoctors() {
    const specialty = document.getElementById('specialty-filter').value;
    const availability = document.getElementById('availability-filter').value;

    let filteredDoctors = sampleDoctors;

    if (specialty) {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.specialty === specialty);
    }

    // Simulate search loading
    const doctorsList = document.getElementById('doctors-list');
    doctorsList.innerHTML = '<div class="loading"></div> Searching doctors...';

    setTimeout(() => {
        displayFilteredDoctors(filteredDoctors);
    }, 1000);
}

function displayFilteredDoctors(doctors) {
    const doctorsList = document.getElementById('doctors-list');
    if (!doctorsList) return;
    if (doctors.length === 0) {
        doctorsList.innerHTML = '<p class="empty-state-text">No doctors found matching your criteria. Try different filters.</p>';
        return;
    }
    doctorsList.innerHTML = doctors.map(doctor => renderDoctorCard(doctor)).join('');
}

function bookAppointment(doctorId) {
    const doctor = sampleDoctors.find(d => d.id === doctorId);
    if (doctor) {
        selectedDoctorId = doctorId;
        openBookingModal(doctor);
    }
}

function openBookingModal(doctor) {
    const modal = document.getElementById('booking-modal');
    const doctorNameElement = document.getElementById('modal-doctor-name');
    const dateInput = document.getElementById('booking-date');

    if (!modal || !doctorNameElement) return;

    // Set doctor name in modal header
    doctorNameElement.textContent = `Book Appointment with ${doctor.name}`;

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today; // Set default to today
    }

    // Reset form
    const form = document.getElementById('booking-form');
    if (form) {
        form.reset();
        // Reset date to today after form reset
        if (dateInput) {
            dateInput.min = today;
            dateInput.value = today;
        }
    }

    // Clear any previous messages
    const messageDiv = document.getElementById('booking-message');
    if (messageDiv) {
        messageDiv.textContent = '';
        messageDiv.classList.remove('success', 'error');
        messageDiv.style.display = 'none';
    }

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus on first input
    setTimeout(() => {
        const nameInput = document.getElementById('booking-name');
        if (nameInput) nameInput.focus();
    }, 100);
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        selectedDoctorId = null;
    }
}

async function handleBookingSubmission(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('booking-message');

    // Get form values
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const reason = document.getElementById('booking-reason').value.trim();

    // Validate inputs
    if (!name || !email || !phone || !date || !time) {
        showBookingMessage('Please fill in all required fields.', 'error', messageDiv);
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showBookingMessage('Please enter a valid email address.', 'error', messageDiv);
        return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
        showBookingMessage('Please enter a valid phone number.', 'error', messageDiv);
        return;
    }

    // Get doctor info
    const doctor = sampleDoctors.find(d => d.id === selectedDoctorId);
    if (!doctor) {
        showBookingMessage('Doctor information not found. Please try again.', 'error', messageDiv);
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    // Prepare booking data
    const bookingData = {
        doctorId: selectedDoctorId,
        doctorName: doctor.name,
        patientName: name,
        email: email,
        phone: phone,
        date: date,
        time: time,
        reason: reason || 'Not specified',
        createdAt: new Date().toISOString()
    };

    try {
        // Try to send to backend API if available
        // For now, we'll simulate a successful booking
        // In production, you would send this to your backend API

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        showBookingMessage(
            `✅ Appointment booked successfully! You will receive a confirmation email at ${email}.`,
            'success',
            messageDiv
        );

        showNotification(
            `Appointment confirmed with ${doctor.name} on ${formatDate(date)} at ${formatTime(time)}!`,
            'success'
        );

        // Log booking data (in production, this would be sent to backend)
        console.log('Booking Details:', bookingData);

        // Save to localStorage and update My Bookings section
        saveBooking(bookingData);
        renderMyBookings();

        // Reset form and close modal after a delay; refresh My Bookings again when modal closes
        setTimeout(() => {
            form.reset();
            // Reset date to today
            const dateInput = document.getElementById('booking-date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
                dateInput.value = today;
            }
            closeBookingModal();
            renderMyBookings(); // Refresh list again so it's up to date when user opens My Bookings
        }, 3000);

    } catch (error) {
        console.error('Booking error:', error);
        showBookingMessage(
            'An error occurred while booking. Please try again or contact support.',
            'error',
            messageDiv
        );
        showNotification('Failed to book appointment. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

function showBookingMessage(message, type, messageDiv) {
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.classList.remove('success', 'error');
        messageDiv.classList.add(type);
        messageDiv.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function viewProfile(doctorId) {
    const doctor = sampleDoctors.find(d => d.id === doctorId);
    if (doctor) {
        const profileInfo = `
            ${doctor.name}
            
            Specialties: ${doctor.specialties.join(', ')}
            Experience: ${doctor.experience}
            Rating: ${doctor.rating}/5
            Consultation Fee: ${doctor.fee}
            Availability: ${doctor.availability}
            
            This is a demo profile. In production, this would show detailed information.
        `;
        showNotification('Profile details displayed in console. Full profile view coming soon!', 'info');
        console.log(profileInfo);
    }
}

// Chatbot functions
function initializeChatbot() {
    // Pre-populate with some common questions
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        // Bot welcome message is already in HTML
    }
}

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const chatToggle = document.getElementById('chat-toggle');

    if (!chatWindow || !chatToggle) return;

    const isOpen = chatWindow.style.display === 'flex';

    if (isOpen) {
        chatWindow.style.display = 'none';
        chatToggle.innerHTML = '<i class="fas fa-comments"></i>';
        chatToggle.setAttribute('aria-label', 'Open chat');
    } else {
        chatWindow.style.display = 'flex';
        chatToggle.innerHTML = '<i class="fas fa-times"></i>';
        chatToggle.setAttribute('aria-label', 'Close chat');
        // Focus on input when opening
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message) {
        addMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    }
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! How can I help you with your healthcare needs today?',
        'hi': 'Hi there! I\'m here to help with any healthcare questions you might have.',
        'appointment': 'To book an appointment, you can use our doctor search feature or check the appointments section.',
        'symptoms': 'You can use our AI symptom checker to get insights about your symptoms and possible conditions.',
        'cost': 'Consultation fees vary by doctor and specialty. You can see each doctor\'s fees on their profile.',
        'emergency': 'If you\'re experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room.',
        'help': 'I can help you with:\n• Booking appointments\n• Understanding symptoms\n• Finding doctors\n• General healthcare information\n\nWhat would you like to know?'
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    // Default responses
    const defaultResponses = [
        'I understand you\'re looking for help. Could you be more specific about what you need?',
        'I can help you with booking appointments, checking symptoms, or finding healthcare information.',
        'For specific medical advice, I recommend consulting with a healthcare professional.',
        'Is there anything specific about your healthcare needs I can help you with?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Contact form handler
async function handleContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const messageStatus = document.getElementById('contact-message-status');
    const submitButton = form.querySelector('button[type="submit"]');

    // Validate inputs
    if (!name || !email || !subject || !message) {
        showContactMessage('Please fill in all fields.', 'error', messageStatus);
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showContactMessage('Please enter a valid email address.', 'error', messageStatus);
        return;
    }

    // Disable submit button to prevent multiple submissions
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Prepare data to send to backend
    const contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message
    };

    try {
        // Simulate submission; backend integration coming soon
        await new Promise(function (resolve) { setTimeout(resolve, 600); });
        showContactMessage(
            'Thank you! Your message has been received. We\'ll get back to you within one business hour.',
            'success',
            messageStatus
        );
        form.reset();
        if (typeof showNotification === 'function') showNotification('Your message has been sent successfully!', 'success');
    } catch (error) {
        showContactMessage(
            'This feature will be available soon. Stay tuned!',
            'error',
            messageStatus
        );
    } finally {
        // Re-enable submit button regardless of success or failure
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
}

function showContactMessage(message, type, messageDiv) {
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.classList.remove('success', 'error');
        messageDiv.classList.add(type);
        messageDiv.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 8000);
        }
    }
}

// Utility functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add scroll-to-top functionality
window.addEventListener('scroll', function () {
    // Add any scroll-based functionality here
});

// Smooth animations on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .doctor-card, .result-item');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Initialize animations
animateOnScroll();

// ============================================
// Backend Integration - User Registration
// ============================================

/**
 * Handles the user registration form submission
 * Sends user data to the backend API and stores it in MongoDB
 */
async function handleFormSubmission(event) {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();

    // Get form elements
    const form = event.target;
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const messageDiv = document.getElementById('registration-message');
    const submitButton = form.querySelector('button[type="submit"]');

    // Get form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Validate input
    if (!name || !email) {
        showRegistrationMessage('Please fill in all fields.', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showRegistrationMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Disable submit button to prevent multiple submissions
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

    // Prepare data to send to backend
    const userData = {
        name: name,
        email: email
    };

    try {
        // Registration via backend API coming soon
        showRegistrationMessage(
            'This feature will be available soon. Stay tuned! In the meantime, use the Sign Up page to create your account.',
            'info'
        );
    } catch (error) {
        showRegistrationMessage(
            'This feature will be available soon. Stay tuned!',
            'error'
        );
    } finally {
        // Re-enable submit button regardless of success or failure
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Register Account';
    }
}

/**
 * Displays a message to the user about registration status
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showRegistrationMessage(message, type) {
    const messageDiv = document.getElementById('registration-message');

    if (messageDiv) {
        // Set the message content
        messageDiv.textContent = message;

        // Remove any existing classes
        messageDiv.classList.remove('success', 'error');

        // Add appropriate class based on type
        messageDiv.classList.add(type);

        // Make sure the message is visible
        messageDiv.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Also log to console for debugging
    if (type === 'success') {
        console.log('✅', message);
    } else {
        console.error('❌', message);
    }
}

/* ── My Bookings (localStorage) ───────────── */
const STORAGE_KEY_BOOKINGS = 'neuracare_bookings';

function getBookings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
        if (!raw) return [];
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list : [];
    } catch (e) {
        console.warn('getBookings:', e);
        return [];
    }
}

function saveBooking(bookingData) {
    try {
        const list = getBookings();
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        list.unshift({ id: id, doctorId: bookingData.doctorId, doctorName: bookingData.doctorName, patientName: bookingData.patientName, email: bookingData.email, phone: bookingData.phone, date: bookingData.date, time: bookingData.time, reason: bookingData.reason, createdAt: bookingData.createdAt });
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
    } catch (e) {
        console.error('saveBooking:', e);
    }
}

function cancelBooking(bookingId) {
    if (!confirm('Cancel this appointment?')) return;
    try {
        let list = getBookings().filter(function (b) { return b.id !== bookingId; });
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
        if (typeof renderMyBookings === 'function') renderMyBookings();
    } catch (e) {
        console.error('cancelBooking:', e);
    }
}

function renderMyBookings() {
    const listEl = document.getElementById('bookings-list');
    const emptyEl = document.getElementById('bookings-empty');
    if (!listEl || !emptyEl) return;

    const bookings = getBookings();
    if (bookings.length === 0) {
        listEl.innerHTML = '';
        listEl.style.display = 'none';
        emptyEl.style.display = 'block';
        return;
    }

    emptyEl.style.display = 'none';
    listEl.style.display = 'flex';
    try {
        listEl.innerHTML = bookings.map(b => {
            let dateStr = '—';
            let timeStr = '—';
            try {
                if (b.date) dateStr = typeof formatDate === 'function' ? formatDate(b.date) : b.date;
                if (b.time) timeStr = typeof formatTime === 'function' ? formatTime(b.time) : b.time;
            } catch (e) {
                if (b.date) dateStr = b.date;
                if (b.time) timeStr = b.time;
            }
            const isPast = b.date && new Date(b.date + 'T' + (b.time || '00:00')) < new Date();
            return (
                '<div class="booking-card glass-card animate-on-scroll ' + (isPast ? 'booking-past' : '') + '" data-booking-id="' + (b.id || '') + '">' +
                '<div class="booking-card-main">' +
                '<div class="booking-doctor">' +
                '<div class="booking-avatar"><i class="fas fa-user-md"></i></div>' +
                '<div><strong>' + escapeHtml(b.doctorName || 'Doctor') + '</strong>' +
                '<span class="booking-meta">' + dateStr + ' at ' + timeStr + '</span></div></div>' +
                '<span class="booking-status ' + (isPast ? 'status-past' : 'status-upcoming') + '">' + (isPast ? 'Completed' : 'Upcoming') + '</span></div>' +
                '<div class="booking-card-details">' +
                '<p><i class="fas fa-info-circle"></i> ' + escapeHtml(b.reason || 'No reason specified') + '</p>' +
                '<p><i class="fas fa-envelope"></i> ' + escapeHtml(b.email || '') + '</p>' +
                (isPast ? '' : '<button type="button" class="btn btn-ghost btn-sm booking-cancel" onclick="cancelBooking(\'' + (b.id || '') + '\')">Cancel appointment</button>') +
                '</div></div>'
            );
        }).join('');
    } catch (err) {
        console.error('renderMyBookings error:', err);
        listEl.style.display = 'none';
        emptyEl.style.display = 'block';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ── FAQ Accordion ───────────────────────── */
function toggleFaq(answerId, questionId) {
    const answer = document.getElementById(answerId);
    const question = document.getElementById(questionId);
    if (!answer || !question) return;
    const item = question.closest('.faq-item');
    const isOpen = item && item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    document.querySelectorAll('.faq-answer').forEach(a => { a.hidden = true; });
    document.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));
    if (!isOpen && item) {
        item.classList.add('open');
        answer.hidden = false;
        question.setAttribute('aria-expanded', 'true');
    }
}

