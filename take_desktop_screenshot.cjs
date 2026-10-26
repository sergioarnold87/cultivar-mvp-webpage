const puppeteer = require('puppeteer-core');
const path = require('path');

async function run() {
  const artifactDir = '/home/patricia/.gemini/antigravity/brain/72c2d6d3-fb57-4db6-99cd-c89323093893';
  const desktopScreenshotPath = path.join(artifactDir, 'cultivar_desktop_full.png');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 2
  });

  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });

  // Auto-scroll
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 50);
    });
  });

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: desktopScreenshotPath, fullPage: true });
  console.log(`Desktop screenshot saved to ${desktopScreenshotPath}`);

  await browser.close();
}

run().catch((err) => {
  console.error('Error running desktop screenshot:', err);
  process.exit(1);
});
