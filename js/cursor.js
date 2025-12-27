/**
 * Custom cursor functionality
 * Handles cursor movement, trail effects, and click animations
 */
document.addEventListener('DOMContentLoaded', function() {
  const cursorOuter = document.querySelector('.cursor-outer');
  const cursorInner = document.querySelector('.cursor-inner');
  
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   (window.matchMedia("(hover: none) and (pointer: coarse)").matches);

  if (isMobile) {
    document.body.classList.add('custom-cursor-disabled');
    // Hide the toggle if it's mobile
    document.querySelectorAll('.cursor-toggle').forEach(el => el.style.display = 'none');
    return; // Exit early on mobile
  }

  // Check for saved preference
  const isCursorDisabled = localStorage.getItem('customCursorDisabled') === 'true';
  if (isCursorDisabled) {
    document.body.classList.add('custom-cursor-disabled');
  }

  // Ensure cursor is hidden on all elements
  function applyNoMouseCursor() {
    if (document.body.classList.contains('custom-cursor-disabled')) {
      document.documentElement.style.setProperty('cursor', 'auto');
      document.body.style.setProperty('cursor', 'auto');
      document.querySelectorAll('*').forEach(el => {
        if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('clickable') || el.classList.contains('cursor-toggle')) {
          el.style.setProperty('cursor', 'pointer');
        } else {
          el.style.setProperty('cursor', 'auto');
        }
      });
      return;
    }
    document.documentElement.style.setProperty('cursor', 'none', 'important');
    document.body.style.setProperty('cursor', 'none', 'important');
    document.querySelectorAll('*').forEach(el => el.style.setProperty('cursor', 'none', 'important'));
  }
  
  // Apply initial cursor hiding
  applyNoMouseCursor();
  
  // Watch for new elements added to the DOM and hide cursor on them
  const cursorObserver = new MutationObserver((mutationsList) => {
    if (document.body.classList.contains('custom-cursor-disabled')) return;
    mutationsList.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) node.style.setProperty('cursor', 'none', 'important');
        });
      }
    });
  });
  
  // Start observing the document with the configured parameters
  cursorObserver.observe(document.body, { childList: true, subtree: true });
  
  // Interactive elements for smoother hover handling
  const interactiveElements = 'a, button, .nav-pill, .project-btn, .social-button, .skill-item, .cursor-toggle';
  let isHovering = false;
  let hoverTimeout;
  
  // Handle hover states with debouncing to prevent flickering
  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('custom-cursor-disabled')) return;
      clearTimeout(hoverTimeout);
      isHovering = true;
      cursorOuter.style.width = '30px';
      cursorOuter.style.height = '30px';
      cursorInner.style.width = '8px';
      cursorInner.style.height = '8px';
    });
    
    el.addEventListener('mouseleave', () => {
      if (document.body.classList.contains('custom-cursor-disabled')) return;
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
    if (document.body.classList.contains('custom-cursor-disabled')) return;
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
    if (document.body.classList.contains('custom-cursor-disabled')) return;
    cursorOuter.classList.add('click-animation');
    cursorInner.classList.add('click-animation');
  });
  
  // Remove animation classes when animations end
  cursorOuter.addEventListener('animationend', () => cursorOuter.classList.remove('click-animation'));
  cursorInner.addEventListener('animationend', () => cursorInner.classList.remove('click-animation'));

  // Create trail elements with minimal throttling
  let lastTrailTime = 0;
  function createTrail(x, y) {
    if (document.body.classList.contains('custom-cursor-disabled')) return;
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

  // Handle toggle logic
  const cursorToggles = document.querySelectorAll('.cursor-toggle');
  cursorToggles.forEach(toggle => {
    const icon = toggle.querySelector('.cursor-icon');
    // Set initial state of checkboxes if they exist
    const checkbox = toggle.querySelector('input[type="checkbox"]');
    
    function updateIcon(disabled) {
      if (!icon) return;
      if (disabled) {
        // Cursor off icon (with slash)
        icon.innerHTML = '<path d="M7 2l12 11.2l-5.8 0.5l3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z" /><line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />';
      } else {
        // Original cursor icon
        icon.innerHTML = '<path d="M7 2l12 11.2l-5.8 0.5l3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z"/>';
      }
    }

    if (checkbox) {
      checkbox.checked = !document.body.classList.contains('custom-cursor-disabled');
    }
    updateIcon(document.body.classList.contains('custom-cursor-disabled'));

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isDisabled = document.body.classList.toggle('custom-cursor-disabled');
      localStorage.setItem('customCursorDisabled', isDisabled);
      
      if (checkbox) {
        checkbox.checked = !isDisabled;
      }
      updateIcon(isDisabled);
      
      applyNoMouseCursor();
      
      // Update opacity immediately when toggled
      if (isDisabled) {
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';
      }
    });
  });
}); 