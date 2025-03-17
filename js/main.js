// Intersection Observer for section animations
const options = { 
  threshold: 0.15, 
  rootMargin: "0px 0px -30% 0px"
};

const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    } else {
      entry.target.classList.remove('in-view');
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
      targetSection.scrollIntoView({ behavior: 'smooth' });
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  typeLetter();
  createStaticBackground();
  
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
});

// Handle page load
window.addEventListener('load', function() {
  setTimeout(function() {
    document.querySelector('.loader')?.classList.add('hidden');
  }, 300);
}); 
