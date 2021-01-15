const aws = require('aws-sdk');
const lambda = new aws.Lambda({apiVersion: '2015-03-31'});

exports.handler =  async function(event, context) {
  const puppeteerFunctionName = process.env.puppeteerFunctionName;
  const bucketName = process.env.bucketName;
  console.log('Puppeteer Lambda Function Name:', puppeteerFunctionName);
  console.log('Bucket Name:', bucketName);
  console.log('Invoking Puppeteer Lambda function for each URL');
  await Promise.all(event.map(async (url) => {
    console.log('URL:', url);
    await lambda.invoke({
      FunctionName: puppeteerFunctionName,
      InvocationType: 'Event',
      LogType: 'None',
      Payload: JSON.stringify({
        'url': url,
        'bucketName': bucketName
      })
    }).promise();
  }));
};