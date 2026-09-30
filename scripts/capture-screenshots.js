const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const outDir = path.join(__dirname, '..', 'presentation_assets', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\mohan\\AppData\\Local\\ms-playwright\\chromium-1155\\chrome-win\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5000 ...');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Landing Page
  console.log('Capturing Landing Page...');
  await page.screenshot({ path: path.join(outDir, '01_landing_page.png') });

  // 2. Guest Booking Modal & Voucher
  console.log('Capturing Guest Booking Voucher...');
  await page.click('#nav-btn-reserve-suite');
  await page.waitForTimeout(600);
  // Fill form
  await page.fill('input[placeholder*="Lord Julian"]', 'Duchess Aurelia Sterling');
  await page.fill('input[placeholder*="555"]', '+1 (555) 392-8190');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '02_booking_voucher.png') });

  // Close modal
  const closeBtn = await page.$('button:has-text("Return to Sanctuary")');
  if (closeBtn) await closeBtn.click();
  await page.waitForTimeout(600);

  // 3. Staff Role Selection Modal
  console.log('Capturing Staff Role Selection Modal...');
  await page.click('#nav-btn-staff-portal');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '03_staff_modal.png') });

  // 4. Front Desk & Allotment Terminal
  console.log('Capturing Front Desk Terminal...');
  await page.click('h3:has-text("Front Desk & Allotment")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '04_front_desk.png') });

  // 5. Culinary & In-Room Dining Logger
  console.log('Capturing Culinary & Catering Terminal...');
  await page.click('#tab-catering');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '05_catering.png') });

  // 6. Dynamic Tariff & Occupancy Management
  console.log('Capturing Manager Dynamic Tariff Terminal...');
  await page.click('#tab-manager');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '06_manager_tariff.png') });

  // 7. Settled Folios & Printable Invoice Modal
  console.log('Capturing Settled Folio Audit Terminal & Invoice...');
  await page.click('#tab-invoices');
  await page.waitForTimeout(800);
  // View invoice modal
  const viewInvoiceBtn = await page.$('button:has-text("View Folio")');
  if (viewInvoiceBtn) {
    await viewInvoiceBtn.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: path.join(outDir, '07_tax_invoice_folio.png') });

  await browser.close();
  console.log('All screenshots captured successfully in presentation_assets/screenshots/');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
