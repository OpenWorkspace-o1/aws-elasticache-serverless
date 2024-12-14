declare module NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        CDK_DEPLOY_REGION: string;
        ENVIRONMENT: string;
        APP_NAME: string;
        OWNER: string;
        VPC_ID: string;
        VPC_SUBNET_TYPE: string;
        VPC_PRIVATE_SUBNET_IDS: string;
        REDIS_USER_PASSWORD: string;
        REDIS_ENGINE_VERSION: string;
        REDIS_USER_NAME: string;
        REDIS_ENGINE: string;
    }
}
