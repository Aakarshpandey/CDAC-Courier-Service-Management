# Kubernetes Deployment Guide (EKS + RDS)

This guide explains how to deploy the Courier Service application to Amazon EKS with an AWS RDS database.

## Prerequisites
1.  **AWS EKS Cluster** created and `kubectl` configured.
2.  **AWS RDS (MySQL)** instance created.
3.  **Docker Registry** (ECR or DockerHub) to store images.

## Step 1: Configure Database Credentials

### 1. Update ConfigMap
Edit `configmap.yaml` and replace `rds-endpoint` with your actual AWS RDS endpoint URL.

```yaml
SPRING_DATASOURCE_URL: "jdbc:mysql://<YOUR-RDS-ENDPOINT>:3306/courier_service2?createDatabaseIfNotExist=true"
```

### 2. Update Secrets
You need to base64 encode your database username and password before putting them in `secrets.yaml`.

```bash
# Linux/Mac
echo -n "your-db-username" | base64
echo -n "your-db-password" | base64

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("your-db-username"))
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("your-db-password"))
```
Update `secrets.yaml` with these base64 values.

## Step 2: Deploy Backend

```bash
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml
kubectl apply -f backend.yaml
```

Wait for the backend to start and get its external IP/URL:
```bash
kubectl get svc
# Copy the EXTERNAL-IP of courier-backend-service
```

## Step 3: Build and Deploy Frontend

The frontend needs to know where the backend API is located. Since we are using a LoadBalancer, you need the Backend Service IP *before* building the frontend (unless you use a more advanced runtime config setup).

1.  **Get Backend URL**: From the previous step `http://<BACKEND-EXTERNAL-IP>:8080`.
2.  **Build Frontend Image**:
    You can pass the API URL as a build argument or set it in your environment.
    
    ```bash
    # Setting ENV var for the build (if your dockerfile supports ARG or you just set it locally)
    # The code looks for VITE_API_URL.
    
    # IMPORTANT: Since it's a static build, you might need to supply this env var to the 'npm run build' command inside the Dockerfile via --build-arg, OR just modify the .env file locally before building.
    ```
    
    *Recommendation*: Create a `.env` file in `Frontend/Courier-Service-Management/` with:
    ```
    VITE_API_URL=http://<BACKEND-EXTERNAL-IP>:8080
    ```
    
    Then build the image:
    ```bash
    docker build -t courier-frontend:latest ../Frontend/Courier-Service-Management
    ```

3.  **Deploy Frontend**:
    ```bash
    kubectl apply -f frontend.yaml
    ```

## Cleanup
To remove resources:
```bash
kubectl delete -f frontend.yaml
kubectl delete -f backend.yaml
kubectl delete -f configmap.yaml
kubectl delete -f secrets.yaml
```
