# Ryan Kiapour - Portfolio Website

## Project Overview

This is the personal portfolio website for **Ryan Kiapour**, a Front-End Developer. The site showcases his work, skills, and professional journey. It acts as a central hub for his online presence, linking to his GitHub, Twitter (X), and various projects.

**Key Features:**
*   **Portfolio Showcase:** Displays projects like "WatchPal," "War Card Game," and "Eco Educator."
*   **Skills Section:** Highlights proficiency in Swift, JavaScript, Python, and other technologies.
*   **Timeline:** Chronicles the evolution of his website versions.
*   **Interactive UI:** Features a custom cursor, typing effects, and scroll animations.
*   **No Frameworks:** Built entirely with vanilla HTML, CSS, and JavaScript, ensuring a lightweight and performant experience.

## Architecture & Technology

*   **Frontend:** Pure HTML5, CSS3, and JavaScript (ES6+).
*   **Styling:** Custom CSS located in `css/styles.css` and `css/cursor.css`.
*   **Logic:**
    *   `js/main.js`: Handles page interactions, animations (typing effect, counters), and navigation.
    *   `js/cursor.js`: Manages the custom cursor behavior.
*   **Assets:** Images and project screenshots are stored in the `Portfolio/` directory.
*   **External Integrations:** Uses Google Fonts, Google Analytics (gtag.js), and links to external platforms like GitHub and the App Store.

## Building and Running

Since this is a static website, there is no compilation or build step required.

**To run the site locally:**

1.  **Open the directory:** Navigate to the project root.
2.  **Serve the files:** Use any static file server.
    *   **Python:** `python3 -m http.server`
    *   **Node.js (via npx):** `npx serve .`
    *   **VS Code:** Use the "Live Server" extension.
3.  **Access:** Open your browser to `http://localhost:8000` (or the port specified by your server).

## Development Conventions

*   **HTML Structure:** The `index.html` file serves as the single-page application entry point. Sections are divided by IDs (e.g., `#home`, `#about`, `#projects`) to facilitate smooth scrolling navigation.
*   **Styling:**
    *   Responsive design is a priority (desktop vs. mobile handling in JS).
    *   Animations are often handled via `IntersectionObserver` in JS to trigger CSS classes like `.in-view`.
*   **JavaScript:**
    *   Code is written in vanilla JS without bundlers (like Webpack or Vite).
    *   `defer` attribute is used on script tags to ensure the DOM is ready before execution.
*   **Versioning:** The site maintains a history of previous versions (`alpha.html`, `v1.html`, etc.), which are linked in the "Website Timeline" section.

## Directory Structure

*   `css/`: Stylesheets for the main site and cursor.
*   `js/`: JavaScript files for logic and interactivity.
*   `Portfolio/`: Images for project cards.
*   `*.html`: Main entry point (`index.html`) and archived versions of the site.
