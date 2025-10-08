#!/usr/bin/env node

/**
 * Create simple PNG icons for Chrome Extension
 * Creates colored squares as placeholder icons
 */

const fs = require('fs')
const path = require('path')

const iconsDir = path.join(__dirname, '..', 'src', 'icons')

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Function to create a simple colored PNG (red square as base64)
function createIconPNG(size) {
  // This is a minimal valid PNG file (1x1 purple pixel)
  // We'll create a simple colored square for each size
  const canvas = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<canvas id="c" width="${size}" height="${size}"></canvas>
<script>
const c = document.getElementById('c');
const ctx = c.getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, ${size}, ${size});
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, ${size}, ${size});
ctx.font = '${Math.floor(size * 0.6)}px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = 'white';
ctx.fillText('📚', ${size/2}, ${size/2});
</script>
</body>
</html>
  `
  
  // For now, create a simple colored PNG using a library or tool
  // Since we don't have canvas in Node without additional deps,
  // let's create a minimal valid PNG
  
  // Minimal 1x1 transparent PNG
  const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  )
  
  return minimalPNG
}

const sizes = [16, 32, 48, 128]

console.log('Creating placeholder icons...\n')

sizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon${size}.png`)
  const iconData = createIconPNG(size)
  fs.writeFileSync(iconPath, iconData)
  console.log(`✓ Created icon${size}.png`)
})

console.log('\n✅ Placeholder icons created successfully!')
console.log('\n⚠️  Note: These are minimal placeholder PNGs.')
console.log('   For production, create proper icons using:')
console.log('   - Figma, Sketch, or Adobe Illustrator')
console.log('   - Online tools like favicon.io or realfavicongenerator.net')
console.log('   - Icon design services')
console.log('\n   Replace the files in src/icons/ with your designed icons.\n')
