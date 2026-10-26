const puppeteer = require('puppeteer-core');
const path = require('path');

async function run() {
  const artifactDir = '/home/patricia/.gemini/antigravity/brain/72c2d6d3-fb57-4db6-99cd-c89323093893';
  const fullScreenshotPath = path.join(artifactDir, 'cultivar_mobile_full.png');
  const heroScreenshotPath = path.join(artifactDir, 'cultivar_mobile_hero.png');

  console.log('Launching Chrome in headless mode...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  console.log('Navigating to http://localhost:4321/ ...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });

  // Auto-scroll to trigger any lazy-loaded images
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
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

  // Wait a moment for any triggered images to decode/render
  await new Promise(r => setTimeout(r, 1000));

  // Check horizontal overflow
  const layoutMetrics = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const hasHorizontalOverflow = scrollWidth > docWidth || bodyScrollWidth > docWidth;

    return {
      docWidth,
      scrollWidth,
      bodyScrollWidth,
      hasHorizontalOverflow
    };
  });

  console.log('--- METRICAS DE LAYOUT ---');
  console.log(JSON.stringify(layoutMetrics, null, 2));

  // Screenshot hero viewport
  await page.screenshot({ path: heroScreenshotPath, fullPage: false });
  console.log(`Hero screenshot saved to ${heroScreenshotPath}`);

  // Screenshot full page
  await page.screenshot({ path: fullScreenshotPath, fullPage: true });
  console.log(`Full-page screenshot saved to ${fullScreenshotPath}`);

  await browser.close();
  console.log('Done!');
}

run().catch((err) => {
  console.error('Error running puppeteer script:', err);
  process.exit(1);
});
