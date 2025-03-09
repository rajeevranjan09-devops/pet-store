pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '125512903427'
        ECR_REPO = 'pet-store-ui'
        CLUSTER_NAME = 'pet-store-ecs'
        SERVICE_NAME = 'pet-store-ui-service'
        IMAGE_TAG = "latest"
        PATH+EXTRA = "/usr/local/bin:/opt/homebrew/bin"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                    echo "Logging into AWS ECR..."
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                    echo "Building Docker Image..."
                    docker build --platform linux/amd64 -t ${ECR_REPO} .

                    echo "Tagging Docker Image..."
                    docker tag ${ECR_REPO}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                    echo "Pushing Image to AWS ECR..."
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    script {
                        // Run the ECS update-service command and capture the exit code
                        def updateServiceExitCode = sh(script: """
                            echo "Updating ECS Service..."
                            aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --force-new-deployment
                        """, returnStatus: true)

                        // Check if the update-service command failed
                        if (updateServiceExitCode != 0) {
                            error "Failed to update ECS service. Exit code: ${updateServiceExitCode}"
                        }

                        // Optionally, wait and verify the deployment status
                        echo "Waiting for ECS service to stabilize..."
                        sh """
                            aws ecs wait services-stable \
                                --cluster ${CLUSTER_NAME} \
                                --services ${SERVICE_NAME}
                        """

                        // Check the service status after waiting
                        def serviceStatus = sh(script: """
                            aws ecs describe-services \
                                --cluster ${CLUSTER_NAME} \
                                --services ${SERVICE_NAME} \
                                --query 'services[0].status' \
                                --output text
                        """, returnStdout: true).trim()

                        if (serviceStatus != "ACTIVE") {
                            error "ECS service is not in ACTIVE state. Current status: ${serviceStatus}"
                        }

                        echo "ECS service deployed successfully!"
                    }
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed! Check the logs for details."
        }
        success {
            echo "Pipeline completed successfully! ECS deployment is verified."
        }
    }
}