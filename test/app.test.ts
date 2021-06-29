import * as puppeteer from 'puppeteer';

it('test browser', async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  });
  const browserVersion = await browser.version()
  console.log(`Started ${browserVersion}`);
  const page = await browser.newPage();
  console.log('Browser page created');
  await page.close();
  console.log('Browser page closed');
  await browser.close();
  console.log('Browser closed');
});
