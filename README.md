# E-Commerce Platform — CI/CD Pipeline

A full-stack e-commerce application with a fully automated CI/CD pipeline using GitHub Actions, Docker, and AWS ECS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Jest, Supertest |
| Frontend | React, Create React App |
| Containerisation | Docker, Nginx |
| CI/CD | GitHub Actions |
| Registry | Amazon ECR |
| Hosting | Amazon ECS (Fargate) |

---

## Project Structure

```
ecommerce-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline — install, test, build, Docker
│       └── deploy.yml      # CD pipeline — push to ECR, deploy to ECS
├── api/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .gitignore
│   ├── index.js            # Express API
│   ├── index.test.js       # Unit tests
│   └── package.json
├── webapp/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .gitignore
│   ├── public/
│   └── src/
│       ├── App.js
│       └── components/
│           ├── ProductList.jsx
│           ├── Login.jsx
│           └── PlaceOrder.jsx
└── README.md
```

---

## Milestones

| # | Milestone | Tasks | Days |
|---|---|---|---|
| 1 | Foundation | Tasks 1 & 2 | Days 1–2 |
| 2 | Application Code | Tasks 3 & 4 | Days 3–6 |
| 3 | CI Pipeline | Tasks 5 & 6 | Days 7–9 |
| 4 | Cloud Deployment & Hardening | Tasks 7, 8 & 9 | Days 10–13 |
| 5 | Documentation | Task 10 | Day 14 |

---

## Milestone 1 — Foundation

### Task 1 — Create the GitHub Repository

**Step 1 — Create the repository on GitHub**

Go to github.com, click **+** → **New repository**, name it `ecommerce-platform`, set visibility to **Public**, check **Add a README file**, then click **Create repository**.

![Create ecommerce-platform repo](img/1.create_a_repo_name_ecommerce-platform_and_add_a_README.png)

---

**Step 2 — Copy the clone link**

On the repository page click the green **Code** button and copy the HTTPS clone URL.

![Copy clone link](img/2.copy_clone_link.png)

---

**Step 3 — Clone the repository and cd into it**

```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-platform.git
cd ecommerce-platform
```

![Clone repo and cd into it](img/3.clone_repo_and_cd_into_it.png)

---

**Step 4 — Create the required directories**

```bash
mkdir -p api webapp .github/workflows
```

![Create api, webapp and workflows directories](img/4.create_api_webapp_and_workflow_directories.png)

---

**Step 5 — Add .gitkeep placeholder files**

Git does not track empty directories. Add placeholder files so the folders are committed.

```bash
touch api/.gitkeep webapp/.gitkeep
```

![Add .gitkeep to api and webapp](img/5.touch_.gitkeep_in_webapp_and_api_folders.png)

---

### Task 2 — Initialize GitHub Actions

**Step 6 — Commit and push the initial structure**

```bash
git add .
git commit -m "feat: initial project structure with api, webapp, and workflows dirs"
git push origin main
```

![Commit and push initial structure](img/6.commit_and_push_to_github.png)

**Step 7 — Verify on GitHub**

Confirm all three directories are visible on GitHub.

![Initial commit confirmed on GitHub](img/7.commit_now_confirmed_on_github.png)

> ✅ **Milestone 1 complete.** Repository is live on GitHub with `api/`, `webapp/`, and `.github/workflows/` directories.

---

## Milestone 2 — Application Code

### Task 3 — Backend API Setup (Node.js / Express)

**Step 1 — Initialise the Node.js project**

```bash
cd api
npm init -y
```

![cd into api and run npm init](img/8.cd_into_api_and_initialize_with_npm.png)

---

**Step 2 — Install dependencies**

```bash
npm install express
npm install --save-dev jest supertest
```

![Install express, jest and supertest](img/9.install_express_after_jest_and_--save-dev_supertest.png)

---

**Step 3 — Create `api/index.js`**

Create the Express app with three routes — `GET /products`, `POST /login`, and `POST /orders`. Export the app and conditionally start the server so Jest can import it without binding a port.

```js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Wireless Headphones', price: 49.99 },
    { id: 2, name: 'Mechanical Keyboard', price: 89.99 },
    { id: 3, name: 'USB-C Hub', price: 29.99 },
  ]);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ token: 'mock-jwt-token', user: { email } });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

app.post('/orders', (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: 'userId and items are required' });
  }
  res.status(201).json({ orderId: 'ORD-' + Date.now(), userId, items, status: 'placed' });
});

module.exports = app;

if (require.main === module) {
  app.listen(3001, () => console.log('API running on port 3001'));
}
```

![Create index.js and add Express route code](img/10.open_folder_in_vscode_in_api_create_index.js_file_and_add_code.png)

---

**Step 4 — Create `api/index.test.js`**

Write unit tests using supertest covering success and error cases for all three routes.

```js
const request = require('supertest');
const app = require('./index');

describe('GET /products', () => {
  it('returns a list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('POST /login', () => {
  it('returns a token with valid credentials', async () => {
    const res = await request(app).post('/login').send({ email: 'test@example.com', password: 'pass' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
  it('returns 400 if credentials are missing', async () => {
    const res = await request(app).post('/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /orders', () => {
  it('places an order successfully', async () => {
    const res = await request(app).post('/orders').send({ userId: 'user1', items: [{ id: 1, qty: 2 }] });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
  });
  it('returns 400 if items are missing', async () => {
    const res = await request(app).post('/orders').send({ userId: 'user1', items: [] });
    expect(res.statusCode).toBe(400);
  });
});
```

![Create index.test.js with supertest unit tests](img/11.still_in_api_create_index.test.js_file_and_add_code.png)

---

**Step 5 — Update `package.json` scripts**

```json
"scripts": {
  "start": "node index.js",
  "test": "jest"
}
```

![Update package.json scripts](img/12.update_script_section_of_package.json_to_start_node_index.js_and_test_jest.png)

---

**Step 6 — Run the tests**

```bash
npm test
```

All 5 tests should pass.

![All 5 backend tests pass](img/13.npm_test_to_run_the_5_tests.png)

---

### Task 4 — Frontend Web Application (React)

**Step 7 — Scaffold the React app**

```bash
cd ../webapp
rm .gitkeep
npx create-react-app .
```

![Scaffold React app with create-react-app](img/14.cd_webapp_and_rm_-rf_.gitkeep_then_npx_create-react-app.png)

---

**Step 8 — Navigate to the src directory**

```bash
cd src
```

![Navigate to src directory](img/15.navigate_to_src%20.png)

---

**Step 9 — Remove boilerplate files**

```bash
rm App.css logo.svg setupTests.js
```

![Delete unused boilerplate files](img/16.cd_src_delete_App.css_logo.svg_and_setupTests.js_files.png)

---

**Step 10 — Create the components folder**

```bash
mkdir components
```

![Create components directory](img/17.in_src_create_components_folder.png)

---

**Step 11 — Create `ProductList.jsx`**

Uses `useEffect` to call `GET /products` on mount and renders the product list. Uses native `fetch` for HTTP calls.

```jsx
import React, { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setError('Could not load products.'));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>{products.map(p => <li key={p.id}>{p.name} — ${p.price}</li>)}</ul>
    </div>
  );
}

export default ProductList;
```

![Create ProductList.jsx](img/18.in_components_folder_create_ProductList.jsx_and_add_code.png)

---

**Step 12 — Create `Login.jsx`**

Handles a form that POSTs credentials to `/login` and displays the returned token.

```jsx
import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage('Logged in! Token: ' + data.token);
    } catch { setMessage('Login failed.'); }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
```

![Create Login.jsx](img/19.also_create_Login.jsx_and_add_codes.png)

---

**Step 13 — Create `PlaceOrder.jsx`**

Takes a user ID input and POSTs to `/orders`, displaying the returned order ID.

```jsx
import React, { useState } from 'react';

function PlaceOrder() {
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: [{ id: 1, qty: 1 }] }),
      });
      const data = await res.json();
      setResult('Order placed! ID: ' + data.orderId);
    } catch { setResult('Order failed.'); }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleOrder}>
        <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} /><br />
        <button type="submit">Place Order</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}

export default PlaceOrder;
```

![Create PlaceOrder.jsx](img/20.also_create_PlaceOrder.jsx_and_add_codes.png)

---

**Step 14 — Update `App.js`**

Import and render all three components.

```jsx
import React from 'react';
import ProductList from './components/ProductList';
import Login from './components/Login';
import PlaceOrder from './components/PlaceOrder';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>E-Commerce Platform</h1>
      <hr /><ProductList />
      <hr /><Login />
      <hr /><PlaceOrder />
    </div>
  );
}

export default App;
```

![Wire all components into App.js](img/21.in_App.js_under_src_import_and_call_all_created_components.png)

---

**Step 15 — Run frontend tests**

```bash
npm test -- --watchAll=false
```

![Frontend test passes](img/22.ran_npm_test_was_successfully.png)

---

**Step 16 — Build the production bundle**

```bash
npm run build
```

![Production build compiles with no errors](img/23.ran_build_to_confirm_frontend_compile_with_no_error.png)

---

**Step 17 — Run both servers and verify in the browser**

Open two terminals:

```bash
# Terminal 1 — Backend
cd api
node index.js
# API running on port 3001

# Terminal 2 — Frontend
cd webapp
npm start
# App running on http://localhost:3000
```

![Run API and React app in two terminals](img/24.open_two_terminals_on_one_under_api_run_node_index.js_on_the_other_run_npm_start.png)

![App starts on port 3000](img/25.the_application_will_start_on_port_3000.png)

![Application showing products, login and order placement](img/26.application_logic.png)

---

**Step 18 — Add `.gitignore` files and commit**

Create `.gitignore` in `api/`, `webapp/`, and the repo root:

```
# api/.gitignore and webapp/.gitignore
node_modules/
build/
.env
```

![Add .gitignore files to api and webapp](img/27.ensure_gitkeek_files_are_deleted_then_add_.gitignore_to_both_api_and_webapp_folder_to_ignore_node_modules_and_.env_files.png)

```bash
git add .
git commit -m "feat: backend API with tests and React frontend"
git push origin main
```

![Commit and push all application code](img/28.commit_and_push_to_github.png)

![api and webapp directories confirmed on GitHub](img/29.api_and_webapp_directories_are_now_on_github.png)

> ✅ **Milestone 2 complete.** Backend has 5 passing tests. React frontend builds cleanly and runs locally.

---

## Milestone 3 — CI Pipeline

### Task 5 — GitHub Actions CI Workflow

**Step 1 — Create `.github/workflows/ci.yml`**

This workflow triggers on every push and pull request to `main`. It runs two parallel jobs — `backend` and `frontend` — each installing dependencies, running tests, building the app, and building the Docker image. npm caching is enabled via `actions/setup-node`.

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: api
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: api/package-lock.json
      - run: npm ci
      - run: npm test
      - run: npm run build --if-present
      - name: Build Docker image
        run: docker build -t ecommerce-api:latest .

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: webapp
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: webapp/package-lock.json
      - run: npm ci
      - run: npm test -- --watchAll=false
      - run: npm run build
      - name: Build Docker image
        run: docker build -t ecommerce-frontend:latest .
```

![Create ci.yml with backend and frontend jobs](img/30.create_ci.yml_and_add_workflow_for_frontend_and_backend_jobs.png)

---

**Step 2 — Commit and push**

```bash
git add .
git commit -m "ci: add GitHub Actions CI workflow for backend and frontend"
git push origin main
```

![Commit and push ci.yml](img/31.commit_and_push_to_github.png)

---

**Step 3 — Verify both jobs pass on the Actions tab**

Navigate to the **Actions** tab on GitHub. Click the latest workflow run and confirm both jobs show a green checkmark.

![Both CI jobs pass successfully](img/32.navigate_to_action_tab_and_click_on_pipeline_to_observe_all_jobs_ran_successfully.png)

---

### Task 6 — Docker Integration

**Step 4 — Create `api/Dockerfile`**

Uses `node:18-alpine` as base, installs production dependencies only, and starts the server on port 3001.

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

![Create Dockerfile in api/](img/33.in_api_folder_add_Dockerfile_and_its_script.png)

---

**Step 5 — Create `webapp/Dockerfile`**

Uses a multi-stage build. Stage 1 builds the React app, Stage 2 serves the output with Nginx on port 80.

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

![Create multi-stage Dockerfile in webapp/](img/34.in_webapp_folder_add_Dockerfile_and_its_script.png)

---

**Step 6 — Add `.dockerignore` files**

Prevents `node_modules`, `.env`, and build output from being copied into Docker images.

```
# api/.dockerignore
node_modules
.env
*.test.js

# webapp/.dockerignore
node_modules
build
.env
```

![Add .dockerignore to api and webapp](img/35.add_.dockerignore_to_both_api_and_webapp_for_docker_to_ignore_unnecesary.png)

---

**Step 7 — Update `ci.yml` to build Docker images**

Add a Docker build step to the end of both jobs in `ci.yml`.

![Update ci.yml to build Docker images](img/36.update_ci.yml_to_include_docker.png)

---

**Step 8 — Commit, push and verify**

```bash
git add .
git commit -m "feat: add Dockerfiles and Docker build steps to CI workflow"
git push origin main
```

![Commit and push Docker changes](img/37.commit_and_push_changes_to_github.png)

![All CI jobs pass including Docker build steps](img/38.navigate_to_action_tab_and_click_on_pipeline_to_observe_nothing_broke_all_jobs_ran_successfully.png)

> ✅ **Milestone 3 complete.** CI pipeline now tests, builds, and creates Docker images on every push to `main`.

---

## Milestone 4 — Cloud Deployment & Hardening

### Task 7 — Deploy to AWS

#### Amazon ECR — Container Registry

**Step 1 — Navigate to ECR and create repositories**

Go to AWS Console → search **ECR** → Elastic Container Registry.

![Navigate to ECR](img/39.login_to_AWS_and_navigate_to_ECR.png)

![Click Create repository](img/40.click_create_repository.png)

---

**Step 2 — Create `ecommerce-api` repository**

Name it `ecommerce-api`, visibility **Private**, click **Create**.

![Create ecommerce-api repository](img/41.name_it_ecommerce-api_and_click_create.png)

---

**Step 3 — Create `ecommerce-frontend` repository**

Repeat with name `ecommerce-frontend`.

![Create ecommerce-frontend repository](img/42.create_another_one_and_name_it_ecommerce-frontend.png)

![Both repositories created — note the registry URI](img/43.two_repositories_now_created_note_their_URIs.png)

> Note your registry URI: `123456789012.dkr.ecr.us-east-1.amazonaws.com`

---

#### Amazon ECS — Container Orchestration

**Step 4 — Navigate to ECS**

![Navigate to ECS](img/44.navigate_to_ecs.png)

![Click Get Started](img/45.click_get_started.png)

---

**Step 5 — Create the ECS cluster**

Clusters → **Create cluster** → Name: `ecommerce-cluster`, type: **AWS Fargate** → Create.

![Create ecommerce-cluster with Fargate](img/46.navigate_to_clusters_name_cluster_ecommerce-cluster_select_fargate_only_and_click_create.png)

---

**Step 6 — Create the API task definition**

Task Definitions → **Create new task definition**

- Family: `ecommerce-api-task`
- Launch type: Fargate, CPU: 1 vCPU, Memory: 2 GB
- Container name: `ecommerce-api`
- Image URI: `<ECR_REGISTRY>/ecommerce-api:latest`
- Port: `3001`

![Navigate to Task Definitions](img/47.still_on_ecs_navigate_to_task_definition_and_create_new_task_definition.png)

![Configure ecommerce-api-task](img/48.name_ecommerce-api-task_type_fargate_X864bit_linux_vCPU_1_2GB_memory.png)

![Add container with ECR URI and port 3001](img/49.container1_name-ecommerce-api_with_ecommerce-api_URI-latest_added_under_URI_port_3001.png)

![Create the task definition](img/50.scroll_down_and_click_create.png)

---

**Step 7 — Create the frontend task definition**

Repeat with:

- Family: `ecommerce-frontend-task`
- Container name: `ecommerce-frontend`
- Image URI: `<ECR_REGISTRY>/ecommerce-frontend:latest`
- Port: `80`

![Configure ecommerce-frontend-task](img/51.create_another_name_ecommerce-frontend-task_type_fargate_X864bit_linux_vCPU_1_2GB_memory.png)

![Add frontend container with ECR URI and port 80](img/52.container1_name-ecommerce-frontend_with_ecommerce-api_URI-latest_added_under_URI_port_80.png)

![Create the frontend task definition](img/53.scroll_down_and_click_create.png)

---

**Step 8 — Create ECS services**

Navigate to `ecommerce-cluster` → **Services** tab → **Create**.

![Navigate to cluster Services tab](img/54.navigate_to_ecommece-cluster_service_tab_and_click_create_new.png)

**API service:**
- Task definition: `ecommerce-api-task`
- Service name: `ecommerce-api-service`
- Launch type: Fargate, Desired tasks: 1

![Configure ecommerce-api-service](img/55.select_ecommerce-api-task_service_name_ecommerce-api-service_family.png)

![Select Fargate launch type](img/56.launch_type_Fargate.png)

![Create the API service](img/57.click_create.png)

**Frontend service:**
- Task definition: `ecommerce-frontend-task`
- Service name: `ecommerce-frontend-service`
- Launch type: Fargate, Desired tasks: 1

![Configure ecommerce-frontend-service](img/58.create_another_service_select_ecommerce-frontend-task_under_task_definition_family_service_name_ecommerce-frontend.png)

![Select Fargate launch type for frontend](img/59.launch_type_Fargate.png)

![Create the frontend service](img/60.click_create.png)

---

#### IAM — GitHub Actions Deployer

**Step 9 — Create IAM user with deployment permissions**

IAM → Users → **Create user**

- Name: `github-actions-deployer`
- Attach policies: `AmazonEC2ContainerRegistryFullAccess` and `AmazonECS_FullAccess`

![Create IAM user with ECR and ECS permissions](img/61.navigate_to_IAM_create_github-actions-deployer_attach_permission_AmazonEC2ContainerRegistryFullAccess_AmazonECS_FullAccess.png)

---

**Step 10 — Generate access keys**

Click the user → **Security credentials** → **Create access key** → select **Application running outside AWS** → create and download.

![Create access key](img/62.navigate_to_create_access_key_for_services_running_outside_AWS_for_github-actions-deployer.png)

![Download access key CSV](img/63.download_access_key_and_click_done.png)

---

### Task 8 — Continuous Deployment

**Step 11 — Add secrets to GitHub**

Go to the GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Add these four secrets:

| Secret Name | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key ID |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key |
| `AWS_REGION` | e.g. `us-east-1` |
| `ECR_REGISTRY` | e.g. `123456789012.dkr.ecr.us-east-1.amazonaws.com` |

![Add all four secrets to GitHub](img/64.on_repo_secrets_and_variables_add_AWS_ACCESS_KEY_ID_AWS_SECRET_ACCESS_KEY_AWS_REGION_ECR_REGISTRY.png)

---

**Step 12 — Create `.github/workflows/deploy.yml`**

This workflow triggers on every push to `main`. It authenticates with AWS, builds and pushes Docker images to ECR with both `:latest` and commit SHA tags, then force-deploys both ECS services.

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push API image
        run: |
          docker build \
            -t ${{ secrets.ECR_REGISTRY }}/ecommerce-api:${{ github.sha }} \
            -t ${{ secrets.ECR_REGISTRY }}/ecommerce-api:latest \
            ./api
          docker push ${{ secrets.ECR_REGISTRY }}/ecommerce-api:${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/ecommerce-api:latest

      - name: Build and push frontend image
        run: |
          docker build \
            -t ${{ secrets.ECR_REGISTRY }}/ecommerce-frontend:${{ github.sha }} \
            -t ${{ secrets.ECR_REGISTRY }}/ecommerce-frontend:latest \
            ./webapp
          docker push ${{ secrets.ECR_REGISTRY }}/ecommerce-frontend:${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/ecommerce-frontend:latest

      - name: Deploy API to ECS
        run: |
          aws ecs update-service \
            --cluster ecommerce-cluster \
            --service ecommerce-api-service \
            --force-new-deployment \
            --region ${{ secrets.AWS_REGION }}

      - name: Deploy frontend to ECS
        run: |
          aws ecs update-service \
            --cluster ecommerce-cluster \
            --service ecommerce-frontend-service \
            --force-new-deployment \
            --region ${{ secrets.AWS_REGION }}
```

![Create deploy.yml with AWS deploy pipeline](img/65.create_deploy.yml_file_and_add_pipeline_script.png)

---

### Task 9 — Performance & Security

**Step 13 — Add Docker layer caching to `ci.yml`**

Add `actions/cache` and `docker/setup-buildx-action` steps to both jobs in `ci.yml` to cache Docker Buildx layers and speed up subsequent builds.

![Add Docker layer caching to CI jobs](img/66.update_ci.yml_to_cache_layers_in_each_job.png)

---

**Secrets audit checklist:**

- No hardcoded IPs, keys, or passwords anywhere in the codebase
- `.env` is listed in all three `.gitignore` files
- All AWS credentials live in GitHub Secrets only
- `ECR_REGISTRY` is a secret, not hardcoded in the workflow

---

**Step 14 — Commit, push and verify both pipelines**

```bash
git add .
git commit -m "feat: add AWS deploy workflow with ECS, ECR, caching and secrets"
git push origin main
```

![Commit and push deploy workflow](img/67.commit_and_push_to_github.png)

![CI pipeline runs successfully with caching](img/68.check_on_repo_action_tab_and_ci_pipeline_ran_successfully.png)

![Deploy to AWS workflow runs successfully](img/69.deploy_to_AWS_also_ran_successfully.png)

---

**Step 15 — Verify services are running on ECS**

![Both services running in ECS cluster](img/70.both_service_now_running_under_ECS_cluster.png)

---

**Step 16 — Get the public IP and open security group ports**

1. ECS → Clusters → `ecommerce-cluster` → **Tasks** tab
2. Click the running task → note the **Public IP** under Network
3. Click the **Security Group** link → **Inbound rules** → **Edit inbound rules**
4. Add rules for HTTP port `80` and Custom TCP port `3001` from `0.0.0.0/0`

![Navigate to running task](img/71.click_to_navigate_to_ecommerce-frontend-service_and_click_the_running_task_under_task_tab.png)

![Note the public IP and click the security group](img/72.note_the_public_ip_of_running_task_then_click_on_the_securty_group.png)

![Add inbound rules for port 80 and 3001](img/73.set_http_port_80_and_custom_tcp_port_3001_from_anyware_on_the_internet_0.0.0.0_.png)

---

**Step 17 — Verify the application is live**

Open a browser and navigate to the task public IP. The React frontend should load on port `80` and the API products endpoint should respond on port `3001`.

![Frontend renders on ECS public IP](img/74.application_no_render_on_the_public_ip_of_ecommerce-frontend-service.png)

![API /products endpoint returns JSON](img/75.the_public_ip_of_ecommerce-api_also_shows_the_products_json.png)

> ✅ **Milestone 4 complete.** Both services are live on AWS. Every push to `main` automatically builds, pushes to ECR, and deploys to ECS.

---

## Milestone 5 — Documentation

### Task 10 — Project README

Document the project setup, workflow details, and local development instructions in this `README.md` file. The README covers:

- Project overview and tech stack
- Repository structure
- Local development setup and prerequisites
- Running tests for both services
- Docker build and run instructions
- CI/CD pipeline description
- AWS infrastructure reference
- GitHub Secrets reference
- Environment variables

> ✅ **Milestone 5 complete.** Project fully documented and ready for submission.

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
# API runs on http://localhost:3001
```

### Run the frontend

```bash
cd webapp
npm install
npm start
# App runs on http://localhost:3000
```

> Make sure the backend is running first so the frontend can fetch products.

### Run tests

```bash
# Backend — 5 unit tests
cd api && npm test

# Frontend — render test
cd webapp && npm test -- --watchAll=false
```

---

## Environment Variables

No credentials are hardcoded. All sensitive values are stored as GitHub Actions secrets.

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region e.g. `us-east-1` |
| `ECR_REGISTRY` | ECR registry URI |

For local development create a `.env` file in `api/`:

```
PORT=3001
```

> Never commit `.env` files — they are listed in `.gitignore`.

---

## AWS Infrastructure

| Resource | Name |
|---|---|
| ECR Repository (API) | `ecommerce-api` |
| ECR Repository (Frontend) | `ecommerce-frontend` |
| ECS Cluster | `ecommerce-cluster` |
| ECS Service (API) | `ecommerce-api-service` |
| ECS Service (Frontend) | `ecommerce-frontend-service` |
| IAM User | `github-actions-deployer` |
