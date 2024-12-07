import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsElasticacheServerlessStackProps } from './AwsElasticacheServerlessStackProps';

export class AwsElasticacheServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsElasticacheServerlessStackProps) {
    super(scope, id, props);

  }
}
