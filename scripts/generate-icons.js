#!/usr/bin/env node

/**
 * Generate placeholder icons for Chrome Extension
 * Creates simple SVG icons converted to PNG
 */

const fs = require('fs')
const path = require('path')

const iconsDir = path.join(__dirname, '..', 'src', 'icons')
const sizes = [16, 32, 48, 128]

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
  console.log('✓ Created icons directory')
}

// Generate SVG for each size
sizes.forEach(size => {
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="${size * 0.1}" font-size="${size * 0.6}" fill="white" font-family="Arial, sans-serif">📚</text>
</svg>`.trim()

  const svgPath = path.join(iconsDir, `icon${size}.svg`)
  fs.writeFileSync(svgPath, svg)
  console.log(`✓ Generated icon${size}.svg`)
})

console.log('\n✅ All icons generated successfully!')
console.log('\nNote: SVG icons work in Chrome. If you need PNG icons, use an image')
console.log('conversion tool or design tool like Figma, Photoshop, or GIMP.')
console.log('\nTo use these icons, update manifest.json to reference .svg files')
console.log('or convert them to .png using an online converter.\n')
