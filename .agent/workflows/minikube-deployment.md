---
description: Deploy the Courier Service application on Minikube
---

# Running the Courier Service on Minikube

This guide provides step-by-step instructions to deploy the CDAC Courier Service Management application on Minikube.

## Prerequisites

Ensure you have the following installed:
- Docker
- Minikube
- kubectl

## Step-by-Step Deployment

### 1. Start Minikube

Start your Minikube cluster with sufficient resources:

```bash
minikube start --driver=docker --cpus=4 --memory=4096
```

### 2. Configure Docker to Use Minikube's Docker Daemon

This allows you to build images directly in Minikube's environment without pushing to a registry:

```bash
eval $(minikube docker-env)
```

**Note:** This command needs to be run in each new terminal session where you want to build images.

### 3. Build the Backend Docker Image

Navigate to the backend directory and build the image:

```bash
cd Backend/CourierKaro
docker build -t courier-backend:latest .
cd ../..
```

### 4. Build the Frontend Docker Image

Navigate to the frontend directory and build the image:

```bash
cd Frontend/Courier-Service-Management
docker build -t courier-frontend:latest .
cd ../..
```

### 5. Verify Images are Built

Check that both images are available in Minikube's Docker environment:

```bash
docker images | grep courier
```

You should see both `courier-backend:latest` and `courier-frontend:latest`.

### 6. Deploy MySQL Database (Optional - if not using external RDS)

If you're not using AWS RDS and want to run MySQL in Minikube, create a MySQL deployment:

```bash
kubectl create deployment mysql --image=mysql:8.0
kubectl set env deployment/mysql MYSQL_ROOT_PASSWORD=123456789
kubectl set env deployment/mysql MYSQL_DATABASE=courier_service2
kubectl expose deployment mysql --port=3306 --target-port=3306 --name=mysql-service
```

### 7. Update ConfigMap (if using local MySQL)

If you deployed MySQL in step 6, update the ConfigMap to point to the local MySQL service:

Edit `kubernetes/configmap.yaml` and change the `SPRING_DATASOURCE_URL` to:
```
SPRING_DATASOURCE_URL: "jdbc:mysql://mysql-service:3306/courier_service2?createDatabaseIfNotExist=true"
```

### 8. Apply Kubernetes Secrets

Apply the secrets configuration (contains database credentials):

```bash
kubectl apply -f kubernetes/secrets.yaml
```

### 9. Apply ConfigMap

Apply the configuration map:

```bash
kubectl apply -f kubernetes/configmap.yaml
```

### 10. Deploy the Backend

Deploy the backend application:

```bash
kubectl apply -f kubernetes/backend.yaml
```

### 11. Deploy the Frontend

Deploy the frontend application:

```bash
kubectl apply -f kubernetes/frontend.yaml
```

### 12. Verify Deployments

Check that all pods are running:

```bash
kubectl get pods
```

Wait until all pods show `Running` status. You can watch the status with:

```bash
kubectl get pods -w
```

Press `Ctrl+C` to stop watching.

### 13. Check Services

Verify that all services are created:

```bash
kubectl get services
```

You should see:
- `courier-backend-service`
- `courier-frontend-service`
- `mysql-service` (if you deployed MySQL locally)

### 14. Access the Application

Since Minikube doesn't support LoadBalancer type services natively, you need to use Minikube's tunnel or NodePort.

#### Option A: Using Minikube Tunnel (Recommended)

In a separate terminal, run:

```bash
minikube tunnel
```

Keep this running. Then get the external IPs:

```bash
kubectl get services
```

Access the application:
- Frontend: `http://<EXTERNAL-IP>:80`
- Backend: `http://<EXTERNAL-IP>:8080`

#### Option B: Using Minikube Service Command

Get the URL for the frontend:

```bash
minikube service courier-frontend-service --url
```

Get the URL for the backend:

```bash
minikube service courier-backend-service --url
```

Open these URLs in your browser.

### 15. View Logs (Troubleshooting)

If something isn't working, check the logs:

```bash
# Backend logs
kubectl logs -l app=courier-backend

# Frontend logs
kubectl logs -l app=courier-frontend

# MySQL logs (if deployed locally)
kubectl logs -l app=mysql
```

### 16. Access Kubernetes Dashboard (Optional)

To view the Minikube dashboard:

```bash
minikube dashboard
```

## Updating the Application

If you make changes to your code and need to redeploy:

1. Rebuild the Docker image (make sure you're using Minikube's Docker daemon):
```bash
eval $(minikube docker-env)
cd Backend/CourierKaro  # or Frontend/Courier-Service-Management
docker build -t courier-backend:latest .  # or courier-frontend:latest
```

2. Delete and recreate the pods:
```bash
kubectl rollout restart deployment/courier-backend  # or courier-frontend
```

## Cleaning Up

To stop and delete everything:

```bash
# Delete all deployments and services
kubectl delete -f kubernetes/

# Stop Minikube
minikube stop

# Delete Minikube cluster (optional - removes everything)
minikube delete
```

## Common Issues and Solutions

### Issue: ImagePullBackOff Error

**Solution:** Make sure you're using Minikube's Docker daemon when building images:
```bash
eval $(minikube docker-env)
```

### Issue: Pods in CrashLoopBackOff

**Solution:** Check the logs to see what's wrong:
```bash
kubectl logs <pod-name>
kubectl describe pod <pod-name>
```

### Issue: Cannot Access Services

**Solution:** Make sure `minikube tunnel` is running, or use `minikube service <service-name> --url` to get the correct URL.

### Issue: Database Connection Failed

**Solution:** Verify that:
1. MySQL is running: `kubectl get pods`
2. ConfigMap has the correct database URL
3. Secrets are applied correctly
4. Backend can reach the database service

## Quick Reference Commands

```bash
# Check cluster status
minikube status

# View all resources
kubectl get all

# Get detailed pod information
kubectl describe pod <pod-name>

# Execute commands in a pod
kubectl exec -it <pod-name> -- /bin/bash

# Port forward to a specific pod
kubectl port-forward <pod-name> 8080:8080

# View cluster events
kubectl get events --sort-by=.metadata.creationTimestamp
```
