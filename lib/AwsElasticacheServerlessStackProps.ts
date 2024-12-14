import { StackProps } from "aws-cdk-lib";

export interface AwsElasticacheServerlessStackProps extends StackProps {
    /**
     * Prefix used for naming AWS resources
     * Example: "myapp-prod"
     */
    readonly resourcePrefix: string;

    /**
     * AWS region where resources will be deployed
     * Example: "us-east-1"
     */
    readonly deployRegion: string | undefined;

    /**
     * Full environment name where the stack is being deployed
     * Example: "production"
     */
    readonly deployEnvironment: string;

    /**
     * Shortened version of the environment name
     * Example: "prd", "dev",...
     */
    readonly shortDeployEnvironment: string;

    /**
     * Name of the application
     * Example: "myapp"
     */
    readonly appName: string;

    /**
     * Owner or team responsible for the resources
     * Example: "platform-team"
     */
    readonly owner: string;

    /**
     * Type of VPC subnet to use (PUBLIC, PRIVATE, or ISOLATED)
     * Example: "PRIVATE"
     */
    readonly vpcSubnetType: string;

    /**
     * ID of the VPC where ElastiCache will be deployed
     * Example: "vpc-1234567890abcdef0"
     */
    readonly vpcId: string;

    /**
     * IDs of the private subnets where ElastiCache will be deployed
     * Example: "subnet-1234567890abcdef0,subnet-1234567890abcdef1,subnet-1234567890abcdef2"
     */
    readonly vpcPrivateSubnetIds: string[];

    /**
     * Version of Redis engine to use
     * Example: "7.0"
     */
    readonly redisEngineVersion: string;

    /**
     * Username for Redis authentication
     * Example: "default"
     */
    readonly redisUserName: string;

    /**
     * Password for Redis authentication
     * Should be stored securely and never in plain text
     */
    readonly redisUserPassword: string;

    /**
     * Type of Redis engine
     * Example: "redis"
     */
    readonly redisEngine: string;
}
