import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { aws_elasticache as ElastiCache } from "aws-cdk-lib";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import * as kms from 'aws-cdk-lib/aws-kms';
import { AwsElasticacheServerlessStackProps } from './AwsElasticacheServerlessStackProps';
import { validatePassword, validateRedisEngine, validateRedisEngineVersion } from '../utils/check-environment-variable';

/**
 * AWS CDK Stack for deploying an Amazon ElastiCache Serverless instance.
 *
 * This stack creates the following AWS resources:
 * - ElastiCache Serverless instance in specified VPC
 * - Security Group for ElastiCache access control
 * - KMS Key for encryption
 * - ElastiCache User and User Group for authentication
 * - Daily snapshots configuration
 *
 * The stack supports both Redis and Valkey engines, with configurable engine versions,
 * and implements security best practices including:
 * - Password validation
 * - KMS encryption
 * - VPC isolation
 * - Security group controls
 *
 * @example
 * ```typescript
 * new AwsElasticacheServerlessStack(app, 'MyElastiCacheStack', {
 *   resourcePrefix: 'myapp-prod',
 *   deployEnvironment: 'production',
 *   // ... other required properties
 * });
 * ```
 */
export class AwsElasticacheServerlessStack extends cdk.Stack {
  /**
   * Creates a new instance of AwsElasticacheServerlessStack
   *
   * @param scope - The scope in which to define this construct
   * @param id - The scoped construct ID. Must be unique amongst siblings
   * @param props - Configuration properties for the stack
   * @throws {Error} If password validation fails
   * @throws {Error} If unsupported engine is specified
   * @throws {Error} If unsupported engine version is specified
   */
  constructor(scope: Construct, id: string, props: AwsElasticacheServerlessStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, `${props.resourcePrefix}-VPC-Imported`, {
      vpcId: props.vpcId,
    });

    const elastiCacheSecurityGroup = new SecurityGroup(this, `${props.resourcePrefix}-ElastiCache-Security-Group`, {
      vpc,
      allowAllOutbound: false,
      description: `${props.resourcePrefix}-ElastiCache-Security-Group`,
    });
    elastiCacheSecurityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const kmsKey = new kms.Key(this, `${props.resourcePrefix}-KMS-Key`, {
      enabled: true,
      enableKeyRotation: true,
      description: `${props.resourcePrefix}-KMS-Key`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      rotationPeriod: cdk.Duration.days(30),
    });

    // todo create user and group (CfnUser, CfnUserGroup)
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticache-user.html
    // https://stackoverflow.com/questions/46569432/does-redis-use-a-username-for-authentication
    // Replaced redis with Valkey https://github.com/infiniflow/ragflow/pull/3164/files

    if (!validatePassword(props.redisUserPassword)) {
      throw new Error('Password must be at least 16 characters long, maximum 128 characters, and contain a mix of uppercase, lowercase, numbers and special characters.');
    }

    if (!validateRedisEngine(props.redisEngine)) {
      throw new Error('Unsupported Redis engine. Supported engines are valkey, redis, memcached.');
    }

    const user = new ElastiCache.CfnUser(this, `${props.resourcePrefix}-ElastiCache-User`, {
      engine: props.redisEngine,
      noPasswordRequired: false,
      userId: `${props.resourcePrefix}-usr`,
      userName: props.redisUserName,
      passwords: [props.redisUserPassword],
    });
    user.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const userGroup = new ElastiCache.CfnUserGroup(this, `${props.resourcePrefix}-ElastiCache-User-Group`, {
      engine: props.redisEngine,
      userGroupId: `${props.resourcePrefix}-usr-grp`,
      userIds: [user.ref],
    });
    userGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // check if the engine version is supported
    if (!validateRedisEngineVersion(props.redisEngineVersion)) {
      throw new Error('Unsupported Valkey engine version. Supported versions are 7 and 8.');
    }

    const elastiCacheServerless = new ElastiCache.CfnServerlessCache(
      this,
      `${props.resourcePrefix}-ElastiCache-Serverless`,
      {
        engine: props.redisEngine,
        serverlessCacheName: `${props.appName}-${props.deployEnvironment}`,
        securityGroupIds: [elastiCacheSecurityGroup.securityGroupId],
        subnetIds: props.vpcPrivateSubnetIds,
        kmsKeyId: kmsKey.keyId,
        description: `${props.resourcePrefix}-ElastiCache-Serverless`,
        majorEngineVersion: props.redisEngineVersion,
        dailySnapshotTime: "00:00",
        snapshotRetentionLimit: 2,
        tags: [
          { key: 'environment', value: props.deployEnvironment },
          { key: 'project', value: props.appName },
          { key: 'owner', value: props.owner }
        ],
        userGroupId: userGroup.ref,
      },
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

    // export kmsKey Id
    new cdk.CfnOutput(this, `${props.resourcePrefix}-KMS-Key-Id`, {
      value: kmsKey.keyId,
      exportName: `${props.resourcePrefix}-KMS-Key-Id`,
      description: `${props.resourcePrefix}-KMS-Key-Id`,
    });

    // export kmsKey arn
    new cdk.CfnOutput(this, `${props.resourcePrefix}-KMS-Key-Arn`, {
      value: kmsKey.keyArn,
      exportName: `${props.resourcePrefix}-KMS-Key-Arn`,
      description: `${props.resourcePrefix}-KMS-Key-Arn`,
    });

    const endpointAddress = elastiCacheServerless.attrEndpointAddress;
    const endpointPort = elastiCacheServerless.attrEndpointPort;

    new cdk.CfnOutput(this, `${props.resourcePrefix}-ElastiCache-Serverless-Endpoint-Address`, {
      value: endpointAddress,
      exportName: `${props.resourcePrefix}-ElastiCache-Serverless-Endpoint-Address`,
      description: `${props.resourcePrefix}-ElastiCache-Serverless-Endpoint-Address`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-ElastiCache-Serverless-Endpoint-Port`, {
      value: endpointPort,
      exportName: `${props.resourcePrefix}-ElastiCache-Serverless-Endpoint-Port`,
      description: `${props.resourcePrefix}-ElastiCache-Serverless-Endpoint-Port`,
    });
  }
}
