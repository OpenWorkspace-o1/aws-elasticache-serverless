# AWS ElastiCache Serverless CDK Project

This project deploys an AWS ElastiCache Serverless instance using AWS CDK with TypeScript.

## Prerequisites

1. **AWS CLI v2**

   ```bash
   # Install AWS CLI v2 (macOS)
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /

   # Configure AWS CLI
   aws configure
   ```

2. **Node.js & npm**
   - Install Node.js LTS version (16.x or higher)

3. **AWS CDK**

   ```bash
   npm install -g aws-cdk
   ```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env file with your values:
   APP_NAME=ow-elasticache-serverless
   CDK_DEPLOY_REGION=ap-southeast-1
   ENVIRONMENT=development
   OWNER=OPENWORKSPACE
   VPC_ID=vpc-xxxxxxxx           # Your VPC ID
   VPC_SUBNET_TYPE=PRIVATE_ISOLATED
   ```

## Deployment

1. **Bootstrap CDK (first time only)**

   ```bash
   # Bootstrap in your target region
   cdk bootstrap aws://ACCOUNT-NUMBER/REGION
   ```

2. **Deploy the stack**

   ```bash
   # Review the CloudFormation template
   cdk synth

   # Compare changes
   cdk diff

   # Deploy
   cdk deploy
   ```

## Useful Commands

- `npm run build`   compile typescript to js
- `npm run watch`   watch for changes and compile
- `npm run test`    perform the jest unit tests
- `cdk deploy`      deploy this stack to your default AWS account/region
- `cdk diff`        compare deployed stack with current state
- `cdk synth`       emits the synthesized CloudFormation template

## Security

This project creates:

- ElastiCache Serverless instance
- Security Group
- KMS Key for encryption
- VPC subnet associations

Make sure you have the necessary permissions in your AWS account to create these resources.

## Clean Up

To avoid incurring charges, destroy the stack when no longer needed:

```bash
cdk destroy
```
