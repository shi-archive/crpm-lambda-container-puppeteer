import * as cdk from '@aws-cdk/core';
import * as crpm from 'crpm';
import * as ecra from '@aws-cdk/aws-ecr-assets'
import * as fs from 'fs';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';

export class PuppeteerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucketProps = crpm.load<s3.CfnBucketProps>(`${__dirname}/../res/storage/s3/bucket/props.yaml`);
    const bucket = new s3.CfnBucket(this, 'Bucket', bucketProps);
    
    const dockerImage = new ecra.DockerImageAsset(this, 'DockerImage', {directory: '../', exclude: ['node_modules', 'infra']});
    
    const fnRoleProps = crpm.load<iam.CfnRoleProps>(`${__dirname}/../res/security-identity-compliance/iam/role-lambda/props.yaml`);
    const fnRole = new iam.CfnRole(this, 'LambdaRole', fnRoleProps);
    
    const appFnProps = crpm.load<lambda.CfnFunctionProps>(`${__dirname}/../res/compute/lambda/function-puppeteer/props.yaml`);
    appFnProps.code = {
      imageUri: dockerImage.imageUri
    };
    appFnProps.role = fnRole.attrArn;
    const appFn = new lambda.CfnFunction(this, 'PuppeteerFunction', appFnProps);
    
    const invokeFnDir = `${__dirname}/../res/compute/lambda/function-invoke`;
    const invokeFnProps = crpm.load<lambda.CfnFunctionProps>(`${__dirname}/../res/compute/lambda/function-invoke/props.yaml`);
    invokeFnProps.code = {
      zipFile: fs.readFileSync(`${invokeFnDir}/index.js`, 'utf8')
    };
    invokeFnProps.role = fnRole.attrArn;
    invokeFnProps.environment = {
      variables: {
        'puppeteerFunctionName': appFn.ref,
        'bucketName': bucket.ref
      }
    }
    const invokeFn = new lambda.CfnFunction(this, 'InvokeFunction', invokeFnProps);
    
    new cdk.CfnOutput(this, 'ECRImageURI', {value: dockerImage.imageUri});
    new cdk.CfnOutput(this, 'InvokeLambdaFunctionName', {value: invokeFn.ref});
    new cdk.CfnOutput(this, 'BucketName', {value: bucket.ref});
  }
}
