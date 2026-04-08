const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
const outputPath = path.join(__dirname, 'figma-template.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// Replace /assets/ with dist/assets/
html = html.replace(/\/assets\//g, 'dist/assets/');

// Inline CSS
const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="([^"]*)">/);
if (cssMatch) {
  const cssHref = cssMatch[1];
  const cssPath = path.join(__dirname, 'dist', cssHref.replace(/^\//, ''));
  const css = fs.readFileSync(cssPath, 'utf8');
  html = html.replace(cssMatch[0], `<style>${css}</style>`);
}

// Inline JS
const jsMatch = html.match(/<script[^>]*src="([^"]*)"[^>]*><\/script>/);
if (jsMatch) {
  const jsSrc = jsMatch[1];
  const jsPath = path.join(__dirname, 'dist', jsSrc.replace(/^\//, ''));
  const js = fs.readFileSync(jsPath, 'utf8');
  html = html.replace(jsMatch[0], `<script>${js}</script>`);
}

// Remove crossorigin
html = html.replace(/ crossorigin/g, '');

fs.writeFileSync(outputPath, html);
console.log('Template created at figma-template.html');