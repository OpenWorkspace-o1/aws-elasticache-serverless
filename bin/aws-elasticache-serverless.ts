#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { checkEnvVariables, getShortEnvironmentName } from '../utils/check-environment-variable';

import { ApplyTags } from '../utils/apply-tag';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { AwsElasticacheServerlessStackProps } from '../lib/AwsElasticacheServerlessStackProps';
import { AwsElasticacheServerlessStack } from '../lib/aws-elasticache-serverless-stack';

dotenv.config(); // Load environment variables from .env file
const app = new cdk.App();

const appAspects = Aspects.of(app);

// check APP_NAME variable
checkEnvVariables('APP_NAME',
    'CDK_DEPLOY_REGION',
    'ENVIRONMENT',
    'VPC_SUBNET_TYPE',
    'VPC_PRIVATE_SUBNET_IDS',
    'OWNER',
    'VPC_ID',
    'REDIS_USER_PASSWORD',
    'REDIS_ENGINE_VERSION',
    'REDIS_USER_NAME',
    'REDIS_ENGINE',
);

const { CDK_DEFAULT_ACCOUNT: account } = process.env;

const cdkRegion = process.env.CDK_DEPLOY_REGION;
const deployEnvironment = process.env.ENVIRONMENT!;
const shortDeployEnvironment = getShortEnvironmentName(deployEnvironment);
const appName = process.env.APP_NAME!;
const owner = process.env.OWNER!;

// check best practices based on AWS Solutions Security Matrix
appAspects.add(new AwsSolutionsChecks());

appAspects.add(new ApplyTags({
    environment: deployEnvironment as 'development' | 'staging' | 'production' | 'feature',
    project: appName,
    owner: owner,
}));

const stackProps: AwsElasticacheServerlessStackProps = {
    resourcePrefix: `${appName}-${shortDeployEnvironment}`,
    env: {
        region: cdkRegion,
        account,
    },
    deployRegion: cdkRegion,
    deployEnvironment,
    shortDeployEnvironment,
    appName,
    vpcSubnetType: process.env.VPC_SUBNET_TYPE!,
    owner,
    vpcId: process.env.VPC_ID!,
    vpcPrivateSubnetIds: process.env.VPC_PRIVATE_SUBNET_IDS!.split(','),
    redisUserPassword: process.env.REDIS_USER_PASSWORD!,
    redisEngineVersion: process.env.REDIS_ENGINE_VERSION!,
    redisUserName: process.env.REDIS_USER_NAME!,
    redisEngine: process.env.REDIS_ENGINE!,
};
new AwsElasticacheServerlessStack(app, `AwsElasticacheServerlessStack`, {
    ...stackProps,
    stackName: `${appName}-${deployEnvironment}-${cdkRegion}-AwsElasticacheServerlessStack`,
    description: `AwsElasticacheServerlessStack for ${appName} in ${cdkRegion} ${deployEnvironment}.`,
});

app.synth();
