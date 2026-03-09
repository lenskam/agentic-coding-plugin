#!/usr/bin/env node

const { chromium } = require('playwright');
const url = process.argv[2];

if (!url) {
  console.error("Usage: node navigate_and_extract.js <url>");
  process.exit(1);
}

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    
    // Extract text content from the body
    const textContent = await page.evaluate(() => document.body.innerText || document.documentElement.innerText);
    
    console.log("\n--- Extracted Content ---");
    console.log(textContent.trim().substring(0, 5000)); // Truncating output to avoid overwhelming logs
    console.log("-------------------------\n");
    
    await browser.close();
    process.exit(0);
  } catch (error) {
    if (browser) await browser.close();
    console.error(`Error navigating or extracting from ${url}: ${error.message}`);
    process.exit(1);
  }
})();
