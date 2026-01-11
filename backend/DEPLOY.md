# Deployment Guide: FastAPI to AWS Lambda

This guide assumes you have the AWS CLI installed and configured.

## 1. Prerequisites
- Docker installed and running.
- AWS CLI configured (`aws configure`).
- An ECR repository created in AWS.

## 2. Update Dependencies
Ensure your `uv.lock` is up to date:
```bash
uv lock
```

## 3. Build the Docker Image
Replace `123456789012` with your AWS Account ID and `us-east-1` with your region.
Replace `my-repo-name` with your ECR repository name.

```powershell
docker build -t my-lambda-backend .
```

## 4. Authenticate Docker with ECR
```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
```

## 5. Tag and Push the Image
```powershell
docker tag my-lambda-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-repo-name:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-repo-name:latest
```

## 6. Create/Update Lambda Function
- Go to the AWS Lambda Console.
- Create a new function -> Container image.
- Select the image URI you just pushed.
- **IMPORTANT**: Under "Configuration" -> "Environment variables", add your `.env` variables (e.g., `MONGODB_URL`, `CLOUDINARY_CLOUD_NAME`, etc.).
- Increase the timeout (default is 3s, set to 30s or more).

## 7. Testing
Use the "Test" tab in Lambda Console with a default payload or configure an API Gateway trigger to expose it via HTTP.
