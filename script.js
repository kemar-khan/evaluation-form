// IMPORTANT: Replace with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';

// Get DOM elements
const form = document.getElementById('evalForm');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const successView = document.getElementById('successView');
const docLink = document.getElementById('docLink');
const displaySubmissionId = document.getElementById('displaySubmissionId');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Submitting...';
    statusMessage.textContent = '';

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // Send to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Show success view with animation
            form.style.animation = 'fadeInUp 0.5s ease-out reverse';
            
            setTimeout(() => {
                form.classList.add('hidden');
                successView.classList.remove('hidden');
                displaySubmissionId.textContent = result.submissionId;
                docLink.href = result.docUrl;
                
                // Scroll to success view
                successView.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        } else {
            throw new Error('Submission failed');
        }

    } catch (error) {
        console.error('Error:', error);
        statusMessage.textContent = '❌ Error submitting form. Please try again.';
        statusMessage.style.color = '#ef4444';
        statusMessage.style.background = 'rgba(239, 68, 68, 0.1)';
        statusMessage.style.padding = '1rem';
        statusMessage.style.borderRadius = '8px';
        statusMessage.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Evaluation';
    }
});

// Smooth scroll for navigation links
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

// Add scroll animations for portfolio items
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all portfolio items and form sections
document.querySelectorAll('.portfolio-item, .form-section').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(item);
});

// Add floating animation to task placeholders
document.querySelectorAll('.task-image-placeholder').forEach((placeholder, index) => {
    placeholder.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
});

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Form validation feedback
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value) {
            this.style.borderColor = '#ef4444';
        } else if (this.value) {
            this.style.borderColor = '#10b981';
        }
    });

    input.addEventListener('focus', function() {
        this.style.borderColor = '#0ea5e9';
    });
});

// Add celebration effect on successful submission
function createConfetti() {
    const colors = ['#0ea5e9', '#06b6d4', '#10b981', '#38bdf8'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);

        const fallDuration = Math.random() * 3 + 2;
        const fallDelay = Math.random() * 0.5;
        
        confetti.animate([
            { 
                transform: 'translateY(0px) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, 
                opacity: 0 
            }
        ], {
            duration: fallDuration * 1000,
            delay: fallDelay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => {
            confetti.remove();
        }, (fallDuration + fallDelay) * 1000);
    }
}

// Trigger confetti on success (you can call this after successful submission)
// Uncomment the line below in the success handler if you want confetti
// createConfetti();