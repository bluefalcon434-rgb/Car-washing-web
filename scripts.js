/* ============================================
   Car Wash Landing Page - JavaScript
   ============================================ */

// ============================================
// Mobile Menu Toggle
// ============================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Booking Form - Date & Time Management
// ============================================
const bookingForm = document.getElementById('bookingForm');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const timeSuggestion = document.getElementById('timeSuggestion');
const serviceSelect = document.getElementById('service');
const vehicleTypeSelect = document.getElementById('vehicleType');
const formMessage = document.getElementById('formMessage');
const printReceiptBtn = document.getElementById('printReceipt');

// Set minimum date to today
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

// Sample unavailable time slots (simulated data)
const unavailableSlots = {
    '2024-12-20': ['09:00', '10:00', '14:00'],
    '2024-12-21': ['11:00', '15:00'],
    '2024-12-22': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
};

// Available time slots
const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
];

// Generate time slots based on selected date
function generateTimeSlots(selectedDate) {
    if (!timeSelect) return;
    
    // Clear existing options except the first one
    timeSelect.innerHTML = '<option value="">Select a time</option>';
    timeSuggestion.textContent = '';
    
    if (!selectedDate) return;
    
    const unavailable = unavailableSlots[selectedDate] || [];
    const available = availableTimes.filter(time => !unavailable.includes(time));
    
    if (available.length === 0) {
        timeSelect.innerHTML = '<option value="">No available slots</option>';
        timeSuggestion.textContent = 'This date is fully booked. Please select another date.';
        timeSuggestion.style.color = '#ff4444';
        return;
    }
    
    // Add available time slots
    available.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    // Suggest first available time
    if (available.length > 0) {
        timeSuggestion.textContent = `Recommended: ${available[0]} (first available)`;
        timeSuggestion.style.color = 'var(--accent)';
    }
}

// Listen for date changes
if (dateInput) {
    dateInput.addEventListener('change', (e) => {
        generateTimeSlots(e.target.value);
    });
}

// ============================================
// Booking Form Validation & Submission
// ============================================
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous messages
        formMessage.className = 'form-message';
        formMessage.textContent = '';
        printReceiptBtn.style.display = 'none';
        
        // Get form values
        const service = serviceSelect.value;
        const vehicleType = vehicleTypeSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Validation
        let isValid = true;
        let errors = [];
        
        if (!service) {
            errors.push('Please select a service type');
            isValid = false;
        }
        
        if (!vehicleType) {
            errors.push('Please select a vehicle type');
            isValid = false;
        }
        
        if (!date) {
            errors.push('Please select a date');
            isValid = false;
        }
        
        if (!time) {
            errors.push('Please select a time');
            isValid = false;
        }
        
        if (!name) {
            errors.push('Please enter your name');
            isValid = false;
        }
        
        if (!email) {
            errors.push('Please enter your email');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }
        
        // Display errors or success
        if (!isValid) {
            formMessage.className = 'form-message error';
            formMessage.textContent = errors.join('. ') + '.';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Simulate successful booking
            const bookingData = {
                service: serviceSelect.options[serviceSelect.selectedIndex].text,
                vehicleType: vehicleTypeSelect.options[vehicleTypeSelect.selectedIndex].text,
                date,
                time,
                name,
                email,
                phone
            };
            
            // Store booking data for receipt
            window.bookingData = bookingData;
            
            formMessage.className = 'form-message success';
            formMessage.textContent = `Booking confirmed! Your appointment is scheduled for ${date} at ${time}. A confirmation email has been sent to ${email}.`;
            printReceiptBtn.style.display = 'inline-block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset form after 3 seconds (optional)
            // setTimeout(() => {
            //     bookingForm.reset();
            //     generateTimeSlots('');
            // }, 5000);
        }
    });
}

// ============================================
// Print Receipt Functionality
// ============================================
if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
        if (!window.bookingData) {
            alert('No booking data available');
            return;
        }
        
        const { service, vehicleType, date, time, name, email, phone } = window.bookingData;
        
        // Create printable receipt window
        const receiptWindow = window.open('', '_blank');
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Booking Receipt - Elite Auto Detailing</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background: white;
                        color: black;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #00c2ff;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #00c2ff;
                        margin: 0;
                    }
                    .receipt-content {
                        line-height: 1.8;
                    }
                    .receipt-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .receipt-label {
                        font-weight: bold;
                        color: #333;
                    }
                    .receipt-value {
                        color: #666;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        text-align: center;
                        color: #999;
                        font-size: 0.9em;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Elite Auto Detailing</h1>
                    <p>Booking Confirmation Receipt</p>
                </div>
                <div class="receipt-content">
                    <div class="receipt-row">
                        <span class="receipt-label">Service:</span>
                        <span class="receipt-value">${service}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Vehicle Type:</span>
                        <span class="receipt-value">${vehicleType}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Date:</span>
                        <span class="receipt-value">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Time:</span>
                        <span class="receipt-value">${time}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Name:</span>
                        <span class="receipt-value">${name}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Email:</span>
                        <span class="receipt-value">${email}</span>
                    </div>
                    ${phone ? `
                    <div class="receipt-row">
                        <span class="receipt-label">Phone:</span>
                        <span class="receipt-value">${phone}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="footer">
                    <p>Thank you for choosing Elite Auto Detailing!</p>
                    <p>123 Auto Care Blvd, City, State 12345 | (555) 123-4567</p>
                </div>
            </body>
            </html>
        `;
        
        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.close();
        
        // Wait for content to load, then print
        receiptWindow.onload = () => {
            setTimeout(() => {
                receiptWindow.print();
            }, 250);
        };
    });
}

// ============================================
// Gallery Slider
// ============================================
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
const galleryDots = document.querySelectorAll('.gallery-dot');
const gallerySlides = document.querySelectorAll('.gallery-slide');

let currentSlide = 0;
const totalSlides = gallerySlides.length;

function showSlide(index) {
    // Ensure index is within bounds
    if (index < 0) {
        currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    
    // Update slides
    gallerySlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    
    // Update dots
    galleryDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
}

if (galleryNext) {
    galleryNext.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
}

// Dot navigation
galleryDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    const rect = gallerySection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
        } else {
            showSlide(currentSlide + 1);
        }
    }
});

// Auto-advance gallery (optional)
// let galleryInterval = setInterval(() => {
//     showSlide(currentSlide + 1);
// }, 5000);

// ============================================
// FAQ Accordion
// ============================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const answer = document.getElementById(question.getAttribute('aria-controls'));
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
                const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
                if (otherAnswer) {
                    otherAnswer.classList.remove('active');
                }
            }
        });
        
        // Toggle current FAQ
        question.setAttribute('aria-expanded', !isExpanded);
        if (answer) {
            answer.classList.toggle('active', !isExpanded);
        }
    });
    
    // Keyboard support
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// ============================================
// Card Hover Effects (Subtle Lift)
// ============================================
const serviceCards = document.querySelectorAll('.service-card');
const testimonialCards = document.querySelectorAll('.testimonial-card');

// Cards already have hover effects in CSS, but we can add additional JS if needed
// The CSS transform: translateY() handles the lift effect

// ============================================
// Initialize on DOM Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial date minimum
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Initialize first gallery slide
    if (gallerySlides.length > 0) {
        showSlide(0);
    }
    
    console.log('Elite Auto Detailing - Page loaded successfully');
});

