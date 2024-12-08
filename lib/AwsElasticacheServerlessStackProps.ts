import { StackProps } from "aws-cdk-lib";

export interface AwsElasticacheServerlessStackProps extends StackProps {
    readonly resourcePrefix: string;
    readonly deployRegion: string | undefined;
    readonly deployEnvironment: string;
    readonly appName: string;
    readonly vpcSubnetType: string;
    readonly owner: string;
    readonly vpcId: string;
    readonly valkeyEngineVersion: string;
    readonly valkeyUserName: string;
    readonly valkeyUserPassword: string;
    readonly redisEngine: string;
}
