import { Context } from 'aws-lambda';
import * as aws from 'aws-sdk';
import * as puppeteer from 'puppeteer';

export const lambdaHandler = async(event: any, context: Context) => {
  const url = event.url;
  console.log(`URL: ${url}`);
  
  let attempt = 0;
  do {
    attempt++;
    try {
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
      page.setDefaultNavigationTimeout(60000);
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url);
      const screenshot = await page.screenshot({ fullPage: true }) as Buffer;
      await page.close();
      await browser.close();
      
      const s3 = new aws.S3();
      const key = `screenshots/${context.awsRequestId}.png`;
      console.log(`Screenshot location: ${event.bucketName}/${key}`);
      await s3.putObject({
        Bucket: event.bucketName,
        Key: key,
        Body: screenshot,
        ContentType: 'image'
      }).promise();
      
      return {
        statusCode: 200,
        body: key
      }
    } catch (err) {
      console.log('Error:', err);
      if (attempt <= 3) {
        console.log('Trying again');
      }
    }
  } while (attempt <= 3)
  
  return {
    statusCode: 400,
    body: 'Error'
  }
}
