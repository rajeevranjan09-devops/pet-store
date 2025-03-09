pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'  // Change to your AWS region
        AWS_ACCOUNT_ID = '125512903427'  // Replace with your AWS Account ID
        ECR_REPO = 'pet-store-ui'  // ECR repository name
        CLUSTER_NAME = 'pet-store-ecs'
        SERVICE_NAME = 'pet-store-ui-service'
        IMAGE_TAG = "latest"  // Change if you want versioning
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {  // Use Jenkins AWS credentials
                    sh """
                    echo "Logging into AWS ECR..."
                    /opt/homebrew/bin/aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                    echo "Building Docker Image..."
                    /usr/local/bin/docker build --platform linux/amd64 -t ${ECR_REPO} .

                    echo "Tagging Docker Image..."
                    /usr/local/bin/docker tag ${ECR_REPO}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                    echo "Pushing Image to AWS ECR..."
                    /usr/local/bin/docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                    echo "Updating ECS Service..."
                    /opt/homebrew/bin/aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --force-new-deployment
                    """
                }
            }
        }
    }
}