Microservice Delivery Pipeline: Contract-Driven Architecture on Kubernetes
A production-grade Node.js/TypeScript microservice architecture demonstrating consumer-driven contract testing, multi-stage containerization, and Kubernetes orchestration with Helm.

This project implements a shift-left testing strategy, validating API contracts asynchronously before deployment to eliminate brittle, expensive end-to-end integration environments.

🏗️ Architectural Overview
                      +---------------------------------------+
                      |       LLM / Offline Generation        |
                      |   Template-driven Pact Spec Creator   |
                      +---------------------------------------+
                                          |
                                          v
+------------------+         +-------------------------+         +----------------------+
|  Consumer App    | ---->   | Pact V3 Contract File   |  <----  | Provider Service     |
| (API Client)     |         |  (pacts/inventory.json) |         | (Inventory API)      |
+------------------+         +-------------------------+         +----------------------+
                                                                            |
                                                                            v
+------------------+         +-------------------------+         +----------------------+
|  Local K8s /     | <----   |   Helm Chart Release    |  <----  | Multi-Stage Docker   |
| Docker Desktop   |         |   (deploy/chart)        |         | Image (Node 18)      |
+------------------+         +-------------------------+         +----------------------+
Core Architecture Principles
Consumer-Driven Contracts: Enforces strict API schemas between services using Pact V3.

Clean Architecture: Strict separation of domain models, transport DTOs, and controller state handlers.

Shift-Left Quality Gates: Ensures provider compliance prior to image creation and Kubernetes deployment.

Deterministic Execution: CI/CD-ready builds with zero non-deterministic runtime dependencies.

🛠️ Tech Stack
Language/Runtime: Node.js 18, TypeScript, Express

Contract Testing: Pact V3 (@pact-foundation/pact)

Containerization: Docker (Multi-stage build)

Orchestration: Kubernetes (Docker Desktop / minikube), Helm 3

Automation: Jenkins (Jenkinsfile included)

📁 Repository Structure
Plaintext
.
├── deploy/
│   └── chart/              # Helm chart (Deployments, Services, Values)
├── pacts/                  # Generated Pact contract JSON artifacts
├── src/
│   ├── controllers/        # Route logic & state handlers
│   ├── models/             # Shared TypeScript domain models & DTOs
│   ├── app.ts              # Express application setup
│   └── server.ts           # Service entrypoint
├── test/
│   ├── consumer.spec.ts    # Consumer contract generation
│   └── provider.spec.ts    # Provider verification suite
├── Dockerfile              # Production-optimized multi-stage build
├── Jenkinsfile             # CI/CD pipeline definition
└── package.json
🚀 Getting Started
Prerequisites
Node.js v18+ and npm

Docker Desktop (with Kubernetes enabled)

Helm 3

1. Local Installation & Contract Tests
Install dependencies and run the consumer-driven contract test suite to verify provider adherence and generate Pact artifacts:

Bash
# Install dependencies
npm ci

# Run Pact consumer tests (generates pacts/)
npm run test:pact:consumer

# Run Pact provider verification
npm run test:pact:provider
🐳 Containerization & Kubernetes Deployment
1. Build Docker Image
Build the multi-stage production image:

Bash
docker build -t inventory-service:latest .
2. Deploy via Helm
Deploy the application chart to your local Kubernetes cluster:

Bash
# Install or upgrade the release
helm upgrade --install inventory-service deploy/chart \
  --set image.repository=inventory-service \
  --set image.tag=latest \
  --set image.pullPolicy=IfNotPresent

# Verify rollout status
kubectl rollout status deployment/inventory-service
3. Verify Endpoint Health
Port-forward the pod service locally to verify runtime execution:

Bash
# Forward local port 8081 to service port 8080
kubectl port-forward service/inventory-service 8081:8080
Execute a test query using PowerShell or cURL:

PowerShell
Invoke-RestMethod -Uri "http://localhost:8081/inventory/SKU-100"
Expected Response:

JSON
{
  "id": "item-uuid-123",
  "sku": "SKU-100",
  "quantity": 150,
  "status": "IN_STOCK"
}