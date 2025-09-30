const { createCanvas } = require('canvas');
const fs = require('fs');

// Simple test to verify canvas works
console.log('Testing canvas image generation...');

try {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');
    
    // Test basic drawing
    ctx.fillStyle = '#ff6b9d';
    ctx.fillRect(0, 0, 400, 200);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Canvas Test Success! ✅', 200, 100);
    
    // Save test image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('test-output.png', buffer);
    
    console.log('✅ Canvas test successful! Check test-output.png');
    console.log('🎨 Image generation is working correctly.');
    
} catch (error) {
    console.error('❌ Canvas test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have run: npm install');
    console.log('2. On Windows, you might need: npm install --global --production windows-build-tools');
    console.log('3. On Linux: sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev');
    console.log('4. On macOS: brew install pkg-config cairo pango libpng jpeg giflib librsvg');
}