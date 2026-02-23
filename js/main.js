// Intersection Observer for section animations
const options = { 
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5], 
  rootMargin: "0px 0px -10% 0px"
};

const sections = document.querySelectorAll('section');
let observer;

try {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.classList.add('in-view');
          // Once a section has been in view, stop observing it to prevent flickering
          observer.unobserve(entry.target);
        });
      }
    });
  }, options);
} catch (error) {
  console.warn('IntersectionObserver not supported:', error);
  // Fallback: show all sections immediately
  sections.forEach(section => section.classList.add('in-view'));
}

// Internal link smooth scroll for nav pills
document.querySelectorAll('.nav-pill[href^="#"]').forEach(pill => {
  pill.addEventListener('click', (e) => {
    e.preventDefault();
    const anchorHash = pill.getAttribute('href');
    const targetSection = document.querySelector(anchorHash);
    
    if (!targetSection) {
      console.warn('Target section not found:', anchorHash);
      return;
    }
    
    const currentPosition = window.scrollY;
    const targetPosition = targetSection.getBoundingClientRect().top + currentPosition;
    
    if (Math.abs(currentPosition - targetPosition) > 50) {
      // Use smooth scroll only on desktop devices
      if (window.innerWidth >= 1024) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // On mobile devices, use instant scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'instant'
        });
      }
    }
    
    if (window.location.hash !== anchorHash) {
      try {
        history.pushState(null, null, anchorHash);
      } catch (error) {
        console.warn('Could not update history:', error);
      }
    }
  });
  
  // Add keyboard support for Enter key
  pill.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pill.click();
    }
  });
});

// Typing effect for the hero text
const typedTextSpan = document.getElementById('typed-text');
const fullText = "Hi, my name is Ryan Kiapour and I'm a Front-End Developer";
const typingSpeed = 100;
let charIndex = 0;
const highlightWord = "Front-End Developer";
const coderStart = fullText.indexOf(highlightWord);
const coderEnd = coderStart + highlightWord.length;

function typeLetter() {
  if (!typedTextSpan) {
    console.warn('Typed text element not found');
    return;
  }
  
  if (charIndex <= fullText.length) {
    let currentHTML = "";
    if (charIndex <= coderStart) {
      currentHTML = fullText.slice(0, charIndex);
    } else if (charIndex > coderStart && charIndex < coderEnd) {
      currentHTML = fullText.slice(0, coderStart) +
        '<span class="highlight">' +
        fullText.slice(coderStart, charIndex) +
        '</span>';
    } else if (charIndex >= coderEnd) {
      currentHTML = fullText.slice(0, coderStart) +
        '<span class="highlight">' +
        fullText.slice(coderStart, coderEnd) +
        '</span>' +
        fullText.slice(coderEnd, charIndex);
    }
    typedTextSpan.innerHTML = currentHTML;
    charIndex++;
    setTimeout(typeLetter, typingSpeed);
  }
}

// Create static background elements
function createStaticBackground() {
  try {
    const accentLines = document.getElementById('accent-lines');
    if (!accentLines) {
      console.warn('Accent lines container not found');
      return;
    }
    
    const lineCount = 5;
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.classList.add('accent-line');
      const posY = 10 + (i * 20);
      line.style.top = `${posY}%`;
      line.style.left = '0';
      line.style.width = '100%';
      accentLines.appendChild(line);
    }
    
    const codeSnippets = [
      "function hello() { return world; }",
      "<div class='code'>Hello World</div>",
      "import { future } from 'dreams';",
      "while(true) { keepCoding(); }",
      "class Developer extends Human { }",
      "git commit -m 'Fixed everything'",
      "npm install future-skills"
    ];
    
    const body = document.body;
    const snippetCount = 6;
    for (let i = 0; i < snippetCount; i++) {
      const snippet = document.createElement('div');
      snippet.classList.add('floating-code');
      snippet.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      const posX = 5 + Math.floor(Math.random() * 90);
      const posY = 5 + Math.floor(Math.random() * 90);
      snippet.style.left = `${posX}%`;
      snippet.style.top = `${posY}%`;
      snippet.style.opacity = 0.07 + (Math.random() * 0.05);
      body.appendChild(snippet);
    }
  } catch (error) {
    console.error('Error creating static background:', error);
  }
}

// Counter Animation for About Me stats
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length === 0) {
    return;
  }
  
  statNumbers.forEach(numberElement => {
    try {
      const originalText = numberElement.textContent;
      const target = parseInt(originalText, 10);
      
      if (isNaN(target)) {
        console.warn('Invalid target number:', originalText);
        return;
      }
      
      const duration = 1800; // Reduced duration for faster animation
      const shouldAddPlus = originalText.includes('+') || numberElement.getAttribute('data-plus') === 'true';
      
      // Start from 0
      numberElement.textContent = '0';
      
      let startTime = null;
      
      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3); // Less aggressive easing for more consistent speed
      }
      
      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        // Calculate the current value with easing (keeping decimals for smoother animation)
        const exactValue = easedProgress * target; 
        
        // For display purposes, round to nearest integer
        const displayValue = Math.round(exactValue);
        
        // Add the + sign if needed
        numberElement.textContent = shouldAddPlus ? displayValue + '+' : displayValue;
        
        if (progress < 1) {
          window.requestAnimationFrame(updateCounter);
        } else {
          // Ensure we end at exactly the target value
          numberElement.textContent = shouldAddPlus ? target + '+' : target;
        }
      }
      
      // Use IntersectionObserver to trigger the animation when counters come into view
      try {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              window.requestAnimationFrame(updateCounter);
              observer.unobserve(entry.target); // Only animate once
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(numberElement);
      } catch (error) {
        console.warn('IntersectionObserver not available for counter animation:', error);
        // Fallback: animate immediately
        window.requestAnimationFrame(updateCounter);
      }
    } catch (error) {
      console.error('Error animating counter:', error);
    }
  });
}

// Project Gallery - No carousel functionality needed, all projects display at once

// Add archive banner for archived versions
function addArchiveBanner() {
  const hostname = window.location.hostname;
  if (hostname.includes('alpha.ryancodes.xyz') || 
      hostname.includes('v1.ryancodes.xyz') || 
      hostname.includes('v2.ryancodes.xyz')) {
    
    // Create banner element
    const banner = document.createElement('div');
    banner.className = 'archive-banner';
    banner.innerHTML = '⚠️ This is an archived version of the site. <a href="https://ryancodes.xyz" target="_blank">View the current version</a>';
    
    // Add banner to the page
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.classList.add('has-archive-banner');
  }
}

// Create floating stars effect
function createStars() {
  try {
    // Check if stars container already exists to avoid duplicates
    if (document.querySelector('.stars-container')) {
      return;
    }
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    starsContainer.setAttribute('aria-hidden', 'true');
    
    const starCount = 50; // Number of stars
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size (1-3px)
      const size = 1 + Math.random() * 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation delay and duration for varied twinkling
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
      
      starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
  } catch (error) {
    console.error('Error creating stars:', error);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  typeLetter();
  createStaticBackground();
  animateCounters();
  createStars(); // Add floating stars
  
  // Handle mobile modal popup
  if (window.location.hash === "#mobile") {
    document.getElementById("mobile-popup").style.display = "flex";
  }
  
  document.querySelector(".modal .close").addEventListener("click", function() {
    document.getElementById("mobile-popup").style.display = "none";
  });
  
  window.addEventListener("click", function(e) {
    const modal = document.getElementById("mobile-popup");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  
  // Initialize the section observers
  sections.forEach(section => observer.observe(section));
  
  // Call the function when the page loads
  addArchiveBanner();

  // ====== Mouse Glow Aura Effect ======
  const glowSelectors = '.project-card, .skill-item, .stat-item, .about-list li, .skills-category';
  const glowCards = document.querySelectorAll(glowSelectors);
  
  glowCards.forEach(card => {
    card.classList.add('glow-card');
    const overlay = document.createElement('div');
    overlay.classList.add('glow-overlay');
    card.appendChild(overlay);
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlay.style.setProperty('--mouse-x', x + 'px');
      overlay.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ====== Hamburger Menu Toggle ======
  const hamburger = document.querySelector('.hamburger');
  const navWrapper = document.querySelector('.nav-wrapper');
  const mobileHeader = document.querySelector('header');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    navWrapper.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  
  if (hamburger && navWrapper) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = hamburger.classList.toggle('open');
      navWrapper.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && navWrapper.classList.contains('open')) {
        if (!mobileHeader.contains(e.target) && !navWrapper.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close menu when a nav link is clicked (mobile)
    document.querySelectorAll('.nav-pill[href^="#"]').forEach(pill => {
      pill.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });
  }

  // ====== Scroll Spy — Sliding Active Indicator ======
  const navPills = document.querySelectorAll('.nav-pill[data-section]');
  const spySections = document.querySelectorAll('section[id]');
  const navIndicator = document.querySelector('.nav-indicator');
  const navLeft = document.querySelector('.nav-left');
  let scrollSpyLocked = false;

  function moveIndicator(pill) {
    if (!navIndicator || !navLeft || !pill) return;
    const parentRect = navLeft.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    navIndicator.style.left = (pillRect.left - parentRect.left) + 'px';
    navIndicator.style.width = pillRect.width + 'px';
  }

  // On click, immediately move indicator and lock scroll-spy
  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      scrollSpyLocked = true;
      navPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      moveIndicator(pill);
      // Unlock after scroll finishes
      clearTimeout(scrollSpyLocked._timer);
      scrollSpyLocked._timer = setTimeout(() => {
        scrollSpyLocked = false;
      }, 800);
    });
  });

  function updateActiveNav() {
    if (scrollSpyLocked) return;
    const scrollPos = window.scrollY + 120;

    let currentSection = '';
    spySections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    navPills.forEach(pill => {
      if (pill.getAttribute('data-section') === currentSection) {
        pill.classList.add('active');
        moveIndicator(pill);
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Throttle scroll events for performance
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Position indicator on load (after pills are visible)
  setTimeout(() => {
    updateActiveNav();
  }, 600);

  // Reposition indicator on resize
  window.addEventListener('resize', () => {
    const activePill = document.querySelector('.nav-pill[data-section].active');
    if (activePill) moveIndicator(activePill);
  });
});

// Handle page load
window.addEventListener('load', function() {
  setTimeout(function() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.add('hidden');
    }
    // Reposition indicator after loader hides
    const activePill = document.querySelector('.nav-pill[data-section].active');
    const navIndicator = document.querySelector('.nav-indicator');
    const navLeft = document.querySelector('.nav-left');
    if (activePill && navIndicator && navLeft) {
      const parentRect = navLeft.getBoundingClientRect();
      const pillRect = activePill.getBoundingClientRect();
      navIndicator.style.left = (pillRect.left - parentRect.left) + 'px';
      navIndicator.style.width = pillRect.width + 'px';
    }
  }, 300);
});

// Handle errors gracefully
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
  // Don't break the page, just log the error
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  // Prevent default browser error handling
  e.preventDefault();
}); 

// Helper Portal Animation
document.addEventListener('DOMContentLoaded', () => {
  const helperPortal = document.getElementById('helper-portal');
  const helperClose = document.querySelector('.helper-close');
  const mysteriousCards = document.querySelectorAll('.mysterious-card');
  
  if (helperPortal && helperClose && mysteriousCards.length > 0) {
    // We use sessionStorage so it resets if you completely close the tab/browser
    if (sessionStorage.getItem('helperDismissed') === 'true') {
      helperPortal.style.display = 'none';
      return; 
    }

    helperPortal.classList.add('hidden');
    helperPortal.style.display = '';

    const showHelper = () => {
      if (helperPortal.classList.contains('hidden')) {
        helperPortal.classList.remove('hidden');
        mysteriousCards.forEach(card => card.removeEventListener('mouseenter', showHelper));
        mysteriousCards.forEach(card => card.removeEventListener('touchstart', showHelper));
      }
    };
    
    // Trigger on hover or tap
    mysteriousCards.forEach(card => {
      card.addEventListener('mouseenter', showHelper);
      card.addEventListener('touchstart', showHelper);
    });

    helperClose.addEventListener('click', () => {
      helperPortal.classList.add('dismissing');
      sessionStorage.setItem('helperDismissed', 'true');
      
      setTimeout(() => {
        helperPortal.style.display = 'none';
      }, 1500);
    });
  }
});
