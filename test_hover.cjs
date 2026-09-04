const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://localhost:5174');
  await new Promise(r => setTimeout(r, 2000));
  
  // Hover over the first term
  const termHandle = await page.$('.term');
  if (!termHandle) {
    console.log('No term found');
    await browser.close();
    return;
  }
  
  await termHandle.hover();
  await new Promise(r => setTimeout(r, 500));
  
  const popupStyle = await page.evaluate(() => {
    const term = document.querySelector('.term');
    const popup = term.querySelector('.term-pop-injected');
    if (!popup) return 'No popup';
    return popup.getAttribute('style') || 'no inline styles';
  });
  console.log('Popup inline style after hover:', popupStyle);
  
  const computedStyle = await page.evaluate(() => {
    const term = document.querySelector('.term');
    const popup = term.querySelector('.term-pop-injected');
    if (!popup) return 'No popup';
    const s = window.getComputedStyle(popup);
    return { visibility: s.visibility, opacity: s.opacity, transform: s.transform };
  });
  console.log('Popup computed style:', computedStyle);

  await browser.close();
})();
