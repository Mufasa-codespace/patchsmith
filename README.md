# Patchsmith

Static site for Patchsmith, a custom patch workshop. HTML, CSS and JS at the repo root. No build step. Vercel serves `index.html` as-is.

Motion libraries (GSAP, ScrollTrigger, Lenis, three.js) load from CDNs. three.js loads only on wider screens, after idle, and stays off when the visitor prefers reduced motion.
