# E-Commerce Platform

A full-stack e-commerce application with a fully automated CI/CD pipeline using GitHub Actions, Docker, and AWS.

---

## Project Structure
```
ecommerce-platform/
├── api/                  # Node.js/Express backend
├── webapp/               # React frontend
├── .github/
│   └── workflows/
│       ├── ci.yml        # CI pipeline (test + build)
│       └── deploy.yml    # CD pipeline (deploy to AWS)
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js v18+
- Docker Desktop
- Git

### Run the backend
```bash
cd api
npm install
npm start
```

API runs on `http://localhost:3001`

Available endpoints:
- `GET /products` — list all products
- `POST /login` — authenticate a user
- `POST /orders` — place an order

### Run the frontend
```bash
cd webapp
npm install
npm start
```

App runs on `http://localhost:3000`

> Make sure the backend is running first so the frontend can fetch products.

---

## Running Tests

**Backend:**
```bash
cd api
npm test
```

**Frontend:**
```bash
cd webapp
npm test -- --watchAll=false
```

---

## Docker

### Build images locally
```bash
docker build -t ecommerce-api:latest ./api
docker build -t ecommerce-frontend:latest ./webapp
```

### Run containers locally
```bash
docker run -p 3001:3001 ecommerce-api:latest
docker run -p 80:80 ecommerce-frontend:latest
```

---

## CI/CD Pipeline

### CI — `ci.yml`
Triggers on every push and pull request to `main`.

- Installs dependencies
- Runs tests
- Builds the application
- Builds Docker images

### CD — `deploy.yml`
Triggers on every push to `main` after CI passes.

- Authenticates with AWS
- Builds and pushes Docker images to Amazon ECR
- Deploys updated containers to Amazon ECS (Fargate)

---

## Cloud Infrastructure (AWS)

| Resource | Name |
|---|---|
| ECR Repository | `ecommerce-api` / `ecommerce-frontend` |
| ECS Cluster | `ecommerce-cluster` |
| ECS Service (API) | `ecommerce-api-service` |
| ECS Service (Frontend) | `ecommerce-frontend-service` |

---

## Environment Variables and Secrets

No credentials are hardcoded. All sensitive values are stored as GitHub Actions secrets:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region e.g. `us-east-1` |
| `ECR_REGISTRY` | ECR registry URI |

For local development, create a `.env` file in `api/` based on this template:
```
PORT=3001
```

> Never commit `.env` files — they are listed in `.gitignore`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Jest |
| Frontend | React, Create React App |
| Containerization | Docker, Nginx |
| CI/CD | GitHub Actions |
| Registry | Amazon ECR |
| Hosting | Amazon ECS (Fargate) |