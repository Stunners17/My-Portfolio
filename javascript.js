// ========================================
// Portfolio Website - JavaScript
// ========================================

// ========================================
// Smooth Scroll Behavior
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Get all nav links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just '#'
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ========================================
// Animate Skill Bars on Scroll
// ========================================

const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate skill bars
      const skillFills = entry.target.querySelectorAll('.skill-fill');
      
      skillFills.forEach((fill, index) => {
        const skillPercentage = fill.parentElement.parentElement.querySelector('.skill-title span:last-child').textContent;
        const percentage = parseInt(skillPercentage);
        
        setTimeout(() => {
          fill.style.setProperty('--skill-percentage', percentage + '%');
        }, index * 150);
      });

      // Stop observing this element
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe skills section
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  observer.observe(skillsSection);
}

// ========================================
// Form Handling
// ========================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate form
    if (!name || !email || !message) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 1500);
  });
}

// ========================================
// Notification System
// ========================================

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
    max-width: 400px;
  `;

  // Add animation styles
  const style = document.createElement('style');
  if (!document.querySelector('#notification-styles')) {
    style.id = 'notification-styles';
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
  }

  // Add to DOM
  document.body.appendChild(notification);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// ========================================
// Add Active Class to Navigation Links
// ========================================

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// Add CSS for active links
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .main-nav a.active {
    color: var(--primary-color);
    font-weight: 600;
  }

  .main-nav a.active::after {
    width: 100%;
  }
`;
document.head.appendChild(activeStyle);

// ========================================

// ========================================
// Scroll Progress Indicator (Optional)
// ========================================

function addScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    z-index: 1001;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Initialize scroll progress
addScrollProgress();

// ========================================
// Lazy Loading Images (Optional Enhancement)
// ========================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.transition = 'opacity 0.3s ease';

        const showImage = () => {
          img.style.opacity = '1';
        };

        if (img.complete && img.naturalWidth > 0) {
          showImage();
        } else {
          img.addEventListener('load', showImage, { once: true });
          img.addEventListener('error', showImage, { once: true });
        }

        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    imageObserver.observe(img);
  });
}

// ========================================
// Hover Effects for Interactive Elements
// ========================================

// Add subtle animation to service and project cards
const interactiveElements = document.querySelectorAll(
  '.service-card, .project-card, .testimonial-card, .contact-card'
);

interactiveElements.forEach(element => {
  element.style.transition = 'all 0.3s ease';
});

// ========================================
// Initialize on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize everything
  updateActiveLink();
  addMobileMenuToggle();
  
  // Add console message
  console.log('Portfolio website loaded successfully!');
});

// ========================================
// Window Resize Handler
// ========================================

let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    addMobileMenuToggle();
  }, 250);
});
