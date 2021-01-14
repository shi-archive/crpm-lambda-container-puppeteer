import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { PuppeteerStack } from '../lib/puppeteer-stack';

test('Stack', () => {
    const cdkApp = new cdk.App();
    const test = new PuppeteerStack(cdkApp, 'puppeteer');
    expectCDK(test).to(haveResource('AWS::Lambda::Function'));
});
