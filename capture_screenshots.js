const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // helpful for some environments
    });
    const page = await browser.newPage();
    
    // Create output directory inside public so user can potentially see them, though strictly for the docx
    // Actually, let's put them in a temp folder for the report generator
    const outputDir = path.join(__dirname, 'public', 'report_screenshots');
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to Home...');
    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
        await page.screenshot({ path: path.join(outputDir, 'home.png') });
        console.log('Saved home.png');
    } catch (e) {
        console.error('Error capturing home:', e);
    }

    console.log('Navigating to Visualizer...');
    try {
        await page.goto('http://localhost:3000/visualizer', { waitUntil: 'load', timeout: 30000 });
        // Wait for animation or render
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outputDir, 'visualizer.png') });
         console.log('Saved visualizer.png');
    } catch (e) {
        console.error('Error capturing visualizer:', e);
    }

    console.log('Navigating to Profile...');
    try {
        await page.goto('http://localhost:3000/profile', { waitUntil: 'load', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: path.join(outputDir, 'profile.png') });
        console.log('Saved profile.png');
    } catch (e) {
        console.error('Error capturing profile:', e);
    }

    await browser.close();
    console.log('Screenshots captured.');
  } catch (err) {
      console.error("Puppeteer error:", err);
  }
})();
