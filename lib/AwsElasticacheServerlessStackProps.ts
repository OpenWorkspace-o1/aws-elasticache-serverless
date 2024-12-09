import { StackProps } from "aws-cdk-lib";

export interface AwsElasticacheServerlessStackProps extends StackProps {
    readonly resourcePrefix: string;
    readonly deployRegion: string | undefined;
    readonly deployEnvironment: string;
    readonly shortDeployEnvironment: string;
    readonly appName: string;
    readonly owner: string;
    readonly vpcSubnetType: string;
    readonly vpcId: string;
    readonly redisEngineVersion: string;
    readonly redisUserName: string;
    readonly redisUserPassword: string;
    readonly redisEngine: string;
}
