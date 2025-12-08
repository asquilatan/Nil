/**
 * Post-build script to fix Vite output for Chrome extension compatibility.
 * Removes crossorigin attributes and ensures proper CSS linking.
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'src', 'popup', 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // 1. Remove crossorigin attribute from link and script tags
    html = html.replace(/ crossorigin/g, '');

    // 2. Ensure the stylesheet uses simple relative path
    html = html.replace(
        /<link rel="stylesheet"[^>]*href="[^"]+"[^>]*>/,
        '<link rel="stylesheet" href="./assets/style.css">'
    );

    // 3. Ensure background color is set immediately to avoid flash
    if (!html.includes('style="background')) {
        html = html.replace('<body', '<body style="background-color: #0d0d0d;"');
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
} else {
    console.error('❌ dist/index.html not found!');
    process.exit(1);
}
