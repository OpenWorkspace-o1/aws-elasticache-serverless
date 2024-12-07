import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { aws_elasticache as ElastiCache } from "aws-cdk-lib";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { AwsElasticacheServerlessStackProps } from './AwsElasticacheServerlessStackProps';
import { parseVpcSubnetType } from '../utils/vpc-type-parser';

export class AwsElasticacheServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsElasticacheServerlessStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, `${props.resourcePrefix}-VPC-Imported`, {
      vpcId: props.vpcId,
    });

    const vpcSubnetType = parseVpcSubnetType(props.vpcSubnetType);
    const elastiCacheSubnetIds = vpc.selectSubnets({
      subnetType: vpcSubnetType,
    }).subnetIds;

    const elastiCacheSecurityGroup = new SecurityGroup(this, `${props.resourcePrefix}-ElastiCache-Security-Group`, {
      vpc,
      description: `${props.resourcePrefix}-ElastiCache-Security-Group`,
      allowAllOutbound: true,
    });

    const elastiCacheServerless = new ElastiCache.CfnServerlessCache(
      this,
      `${props.resourcePrefix}-ElastiCache-Serverless`,
      {
        engine: "redis",
        serverlessCacheName: `${props.resourcePrefix}-ElastiCache-Serverless`,
        securityGroupIds: [elastiCacheSecurityGroup.securityGroupId],
        subnetIds: elastiCacheSubnetIds,
      }
    );

    // export elastiCacheSecurityGroup Id
    new cdk.CfnOutput(this, `${props.resourcePrefix}-ElastiCache-Security-Group-Id`, {
      value: elastiCacheSecurityGroup.securityGroupId,
      exportName: `${props.resourcePrefix}-ElastiCache-Security-Group-Id`,
      description: `${props.resourcePrefix}-ElastiCache-Security-Group-Id`,
    });

    // export elastiCacheServerless Id
    new cdk.CfnOutput(this, `${props.resourcePrefix}-ElastiCache-Serverless-Id`, {
      value: elastiCacheServerless.ref,
      exportName: `${props.resourcePrefix}-ElastiCache-Serverless-Id`,
      description: `${props.resourcePrefix}-ElastiCache-Serverless-Id`,
    });
  }
}
