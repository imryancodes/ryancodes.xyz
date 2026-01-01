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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  typeLetter();
  createStaticBackground();
  animateCounters();
  
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
});

// Handle page load
window.addEventListener('load', function() {
  setTimeout(function() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.add('hidden');
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
