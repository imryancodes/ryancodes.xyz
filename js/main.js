// Intersection Observer for section animations
const options = { 
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5], 
  rootMargin: "0px 0px -10% 0px"
};

const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      requestAnimationFrame(() => {
        entry.target.classList.add('in-view');
      });
    } else {
      requestAnimationFrame(() => {
        entry.target.classList.remove('in-view');
      });
    }
  });
}, options);

// Internal link smooth scroll for nav pills
document.querySelectorAll('.nav-pill[href^="#"]').forEach(pill => {
  pill.addEventListener('click', (e) => {
    e.preventDefault();
    const anchorHash = pill.getAttribute('href');
    const targetSection = document.querySelector(anchorHash);
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
      history.pushState(null, null, anchorHash);
    }
  });
});

// Typing effect for the hero text
const typedTextSpan = document.getElementById('typed-text');
const fullText = "Hi, my name is Ryan and I'm a Full-Stack Developer";
const typingSpeed = 100;
let charIndex = 0;
const highlightWord = "Full-Stack Developer";
const coderStart = fullText.indexOf(highlightWord);
const coderEnd = coderStart + highlightWord.length;

function typeLetter() {
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
  const accentLines = document.getElementById('accent-lines');
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
}

// Counter Animation for About Me stats
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(numberElement => {
    const originalText = numberElement.textContent;
    const target = parseInt(originalText, 10);
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.requestAnimationFrame(updateCounter);
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(numberElement);
  });
}

// Project Carousel Functionality
function initProjectCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-next');
  const prevButton = document.querySelector('.carousel-prev');
  const dotsNav = document.querySelector('.carousel-dots');
  const dots = Array.from(dotsNav.children);
  
  // Position all cards in the center (they'll be hidden by CSS opacity)
  slides.forEach(slide => {
    slide.style.left = '50%';
  });
  
  // Set first slide as active
  slides[0].classList.add('active');
  
  function moveToSlide(currentSlide, targetSlide, direction) {
    // Prepare the slides for animation
    if (direction === 'next') {
      targetSlide.style.transform = 'translateX(-50%) scale(0.8) translateX(100%)';
      setTimeout(() => {
        targetSlide.style.transition = 'all 0.4s ease';
        targetSlide.style.transform = 'translateX(-50%) scale(1)';
      }, 10);
      
      currentSlide.style.transform = 'translateX(-50%) scale(0.8) translateX(-100%)';
    } else if (direction === 'prev') {
      targetSlide.style.transform = 'translateX(-50%) scale(0.8) translateX(-100%)';
      setTimeout(() => {
        targetSlide.style.transition = 'all 0.4s ease';
        targetSlide.style.transform = 'translateX(-50%) scale(1)';
      }, 10);
      
      currentSlide.style.transform = 'translateX(-50%) scale(0.8) translateX(100%)';
    }
    
    // Update active class
    currentSlide.classList.remove('active');
    targetSlide.classList.add('active');
    
    // Reset transition after animation completes
    setTimeout(() => {
      currentSlide.style.transition = 'none';
      currentSlide.style.transform = 'translateX(-50%) scale(0.8)';
      setTimeout(() => {
        currentSlide.style.transition = 'all 0.4s ease';
      }, 10);
    }, 400);
  }
  
  function updateDots(currentDot, targetDot) {
    currentDot.classList.remove('active');
    targetDot.classList.add('active');
  }
  
  function hideShowArrows(targetIndex) {
    if (targetIndex === 0) {
      prevButton.classList.add('is-hidden');
      nextButton.classList.remove('is-hidden');
    } else if (targetIndex === slides.length - 1) {
      prevButton.classList.remove('is-hidden');
      nextButton.classList.add('is-hidden');
    } else {
      prevButton.classList.remove('is-hidden');
      nextButton.classList.remove('is-hidden');
    }
  }
  
  // Initial arrow state
  hideShowArrows(0);
  
  // Click right button, move slides to the right
  nextButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.active');
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector('.active');
    const nextDot = currentDot.nextElementSibling;
    const nextIndex = slides.findIndex(slide => slide === nextSlide);
    
    if (nextSlide) {
      moveToSlide(currentSlide, nextSlide, 'next');
      updateDots(currentDot, nextDot);
      hideShowArrows(nextIndex);
    }
  });
  
  // Click left button, move slides to the left
  prevButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.active');
    const prevSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector('.active');
    const prevDot = currentDot.previousElementSibling;
    const prevIndex = slides.findIndex(slide => slide === prevSlide);
    
    if (prevSlide) {
      moveToSlide(currentSlide, prevSlide, 'prev');
      updateDots(currentDot, prevDot);
      hideShowArrows(prevIndex);
    }
  });
  
  // Click nav indicators, move to that slide
  dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('button');
    
    if (!targetDot) return;
    
    const currentSlide = track.querySelector('.active');
    const currentDot = dotsNav.querySelector('.active');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];
    const currentIndex = slides.findIndex(slide => slide === currentSlide);
    
    if (targetIndex !== currentIndex) {
      const direction = targetIndex > currentIndex ? 'next' : 'prev';
      moveToSlide(currentSlide, targetSlide, direction);
      updateDots(currentDot, targetDot);
      hideShowArrows(targetIndex);
    }
  });
  
  // Auto-rotate carousel
  let carouselInterval = setInterval(() => {
    const currentSlide = track.querySelector('.active');
    const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop back to first slide
    const currentDot = dotsNav.querySelector('.active');
    const nextDot = currentDot.nextElementSibling || dots[0]; // Loop back to first dot
    const nextIndex = slides.findIndex(slide => slide === nextSlide);
    
    moveToSlide(currentSlide, nextSlide, 'next');
    updateDots(currentDot, nextDot);
    hideShowArrows(nextIndex);
  }, 5000); // Change slide every 5 seconds
  
  // Pause rotation on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
  });
  
  // Resume rotation on mouse leave
  track.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
      const currentSlide = track.querySelector('.active');
      const nextSlide = currentSlide.nextElementSibling || slides[0];
      const currentDot = dotsNav.querySelector('.active');
      const nextDot = currentDot.nextElementSibling || dots[0];
      const nextIndex = slides.findIndex(slide => slide === nextSlide);
      
      moveToSlide(currentSlide, nextSlide, 'next');
      updateDots(currentDot, nextDot);
      hideShowArrows(nextIndex);
    }, 5000);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      nextButton.click();
    } else if (e.key === 'ArrowLeft') {
      prevButton.click();
    }
  });
  
  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    // Pause auto-rotation during swipe
    clearInterval(carouselInterval);
  });
  
  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    
    // Resume auto-rotation after swipe
    carouselInterval = setInterval(() => {
      const currentSlide = track.querySelector('.active');
      const nextSlide = currentSlide.nextElementSibling || slides[0];
      const currentDot = dotsNav.querySelector('.active');
      const nextDot = currentDot.nextElementSibling || dots[0];
      const nextIndex = slides.findIndex(slide => slide === nextSlide);
      
      moveToSlide(currentSlide, nextSlide, 'next');
      updateDots(currentDot, nextDot);
      hideShowArrows(nextIndex);
    }, 5000);
  });
  
  function handleSwipe() {
    const currentSlide = track.querySelector('.active');
    const currentDot = dotsNav.querySelector('.active');
    
    if (touchEndX < touchStartX - 50) {
      // Swipe left, go to next slide
      const nextSlide = currentSlide.nextElementSibling;
      const nextDot = currentDot.nextElementSibling;
      
      if (nextSlide) {
        const nextIndex = slides.findIndex(slide => slide === nextSlide);
        moveToSlide(currentSlide, nextSlide, 'next');
        updateDots(currentDot, nextDot);
        hideShowArrows(nextIndex);
      }
    } else if (touchEndX > touchStartX + 50) {
      // Swipe right, go to previous slide
      const prevSlide = currentSlide.previousElementSibling;
      const prevDot = currentDot.previousElementSibling;
      
      if (prevSlide) {
        const prevIndex = slides.findIndex(slide => slide === prevSlide);
        moveToSlide(currentSlide, prevSlide, 'prev');
        updateDots(currentDot, prevDot);
        hideShowArrows(prevIndex);
      }
    }
  }
}

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
  initProjectCarousel();
  
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
    document.querySelector('.loader')?.classList.add('hidden');
  }, 300);
}); 
