/**
 * Custom cursor functionality
 * Handles cursor movement, trail effects, and click animations
 */
document.addEventListener('DOMContentLoaded', function() {
  const cursorOuter = document.querySelector('.cursor-outer');
  const cursorInner = document.querySelector('.cursor-inner');
  
  // Ensure cursor is hidden on all elements
  function applyNoMouseCursor() {
    document.documentElement.style.cursor = 'none !important';
    document.body.style.cursor = 'none !important';
    document.querySelectorAll('*').forEach(el => el.style.cursor = 'none');
  }
  
  // Apply initial cursor hiding
  applyNoMouseCursor();
  
  // Watch for new elements added to the DOM and hide cursor on them
  const cursorObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) node.style.cursor = 'none';
        });
      }
    });
  });
  
  // Start observing the document with the configured parameters
  cursorObserver.observe(document.body, { childList: true, subtree: true });
  
  // Interactive elements for smoother hover handling
  const interactiveElements = 'a, button, .nav-pill, .project-btn, .social-button, .skill-item';
  let isHovering = false;
  let hoverTimeout;
  
  // Handle hover states with debouncing to prevent flickering
  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      isHovering = true;
      cursorOuter.style.width = '30px';
      cursorOuter.style.height = '30px';
      cursorInner.style.width = '8px';
      cursorInner.style.height = '8px';
    });
    
    el.addEventListener('mouseleave', () => {
      // Delay the hover state change to prevent flickering
      hoverTimeout = setTimeout(() => {
        isHovering = false;
        cursorOuter.style.width = '20px';
        cursorOuter.style.height = '20px';
        cursorInner.style.width = '5px';
        cursorInner.style.height = '5px';
      }, 100);
    });
  });
  
  // Track mouse movement for custom cursor
  document.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(() => {
      cursorOuter.style.left = e.clientX + 'px';
      cursorOuter.style.top = e.clientY + 'px';
      cursorInner.style.left = e.clientX + 'px';
      cursorInner.style.top = e.clientY + 'px';
      cursorOuter.style.opacity = '1';
      cursorInner.style.opacity = '1';
    });
    
    // Create trailing effect
    createTrail(e.clientX, e.clientY);
  });
  
  // Handle mouse clicks with animation
  document.addEventListener('mousedown', () => {
    cursorOuter.classList.add('click-animation');
    cursorInner.classList.add('click-animation');
  });
  
  // Remove animation classes when animations end
  cursorOuter.addEventListener('animationend', () => cursorOuter.classList.remove('click-animation'));
  cursorInner.addEventListener('animationend', () => cursorInner.classList.remove('click-animation'));

  // Create trail elements with minimal throttling
  let lastTrailTime = 0;
  function createTrail(x, y) {
    const now = Date.now();
    // Reduced from 50ms to 10ms for a much fuller trail
    if (now - lastTrailTime > 10) {
      lastTrailTime = now;
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      document.body.appendChild(trail);
      
      // Remove trail element after animation completes
      setTimeout(() => trail.remove(), 500);
    }
  }
}); 