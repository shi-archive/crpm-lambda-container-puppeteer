#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PuppeteerStack } from '../lib/puppeteer-stack';

const app = new cdk.App();
new PuppeteerStack(app, 'puppeteer', {
  stackName: 'lambda-puppeteer',
  description: 'Example of how to deploy an AWS Lambda function as a container containing Puppeteer'
});
