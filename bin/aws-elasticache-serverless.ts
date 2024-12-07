#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsElasticacheServerlessStack } from '../lib/aws-elasticache-serverless-stack';

const app = new cdk.App();
new AwsElasticacheServerlessStack(app, 'AwsElasticacheServerlessStack', {

});
