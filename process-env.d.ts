declare module NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        CDK_DEPLOY_REGION: string;
        ENVIRONMENT: string;
        APP_NAME: string;
        VPC_ID: string;
        VPC_SUBNET_TYPE: string;
        OWNER: string;
        VALKEY_USER_PASSWORD: string;
        VALKEY_ENGINE_VERSION: string;
        VALKEY_USER_NAME: string;
        REDIS_ENGINE: string;
    }
}
