# Lambda / Container / Puppeteer

Example of how to deploy an AWS Lambda function as a container containing [Puppeteer](https://pptr.dev), with [CRPM](https://shi.github.io/crpm).

This example uses one Lambda function to asynchronously invoke multiple instances of another Lambda function, which takes a screenshot of a website.
This enables you to take several screenshots in parallel and scale horizontally.  The screenshots are stored in an S3 bucket.

## Instructions

Deploy the cloud infrastructure.

## Deploy Stack

```bash
# Change to infrastructure directory
cd infra

# Install and build the CDK application
npm i
npm run build

# Deploy the CDK bootstrap stack
cdk bootstrap aws://unknown-account/unknown-region

# Deploy the CloudFormation stack
cdk deploy puppeteer
```

## Test

In the AWS Console, open the Invoke Lambda function that was created by CDK above.
Create a test with the following JSON, and run it.

```bash
["https://news.yahoo.com/",
"https://news.google.com/",
"https://www.huffpost.com/",
"https://www.cnn.com/",
"https://www.nytimes.com/",
"https://www.foxnews.com/",
"https://www.nbcnews.com/",
"https://www.washingtonpost.com/",
"https://www.wsj.com/",
"https://abcnews.go.com/",
"https://www.usatoday.com/"]
```

## Destroy Stack

In the AWS Console, manually empty the bucket that was created by CDK above.
Then, run the following command.

```bash
# Destroy the CloudFormation stack
cdk destroy puppeteer
```

