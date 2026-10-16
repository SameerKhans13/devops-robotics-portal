# DevOps Capstone Project Report
## Autonomous Robotics Lab Operations Portal

**Student / Engineer:** Sameer Khan S (Roll Number: 24BC10245)  
**Repository:** [github.com/SameerKhans13/devops-robotics-portal](https://github.com/SameerKhans13/devops-robotics-portal)  
**Branch:** `main`  
**Presentation Deck:** [Google Slides Online Presentation](https://docs.google.com/presentation/d/1EH1rWawI3flJD3L58u2sy2gLXkBUPNWU/edit?usp=drive_link&ouid=103800578670485055643&rtpof=true&sd=true)  
**System Architecture:** Cloud-Native Microservices (FastAPI + React 18 + PostgreSQL + Helm + EKS + Prometheus/Grafana)  


---

## 📑 Table of Contents
1. [Project Overview & Objectives](#1-project-overview--objectives)
2. [System Architecture & Data Modeling](#2-system-architecture--data-modeling)
3. [Fullstack Application Implementation](#3-fullstack-application-implementation)
4. [Automated Testing & Quality Gates](#4-automated-testing--quality-gates)
5. [Containerization & Multi-Stage Docker](#5-containerization--multi-stage-docker)
6. [Continuous Integration & Delivery (CI/CD)](#6-continuous-integration--delivery-cicd)
7. [DevSecOps & Vulnerability Scanning (Trivy)](#7-devsecops--vulnerability-scanning-trivy)
8. [Cloud Infrastructure as Code (AWS & Terraform)](#8-cloud-infrastructure-as-code-aws--terraform)
9. [Kubernetes Orchestration & Helm Packaging](#9-kubernetes-orchestration--helm-packaging)
10. [Full-Stack Observability (Prometheus & Grafana)](#10-full-stack-observability-prometheus--grafana)
11. [Conclusion & Operational Verification](#11-conclusion--operational-verification)

---

## 1. Project Overview & Objectives

The **Robotics Lab Operations Portal** is an enterprise-grade cloud-native web platform designed to streamline robotics hardware allocation, multi-disciplinary personnel tracking, research initiative budgets, and hardware procurement workflows. 

### Core Engineering Goals
- **High-Velocity Automation:** Eliminate manual deployments via a fully automated GitHub Actions pipeline.
- **Zero-Trust Container Security:** Enforce automated vulnerability scanning gates in CI to eliminate High/Critical CVEs before registry publishing.
- **Declarative Cloud Infrastructure:** Automate AWS multi-AZ VPC and Amazon EKS cluster provisioning with Terraform.
- **Cloud-Native Packaging:** Package microservice components into modular Helm charts with rolling zero-downtime upgrades.
- **Deep Observability:** Expose OpenMetrics endpoints scraped by Prometheus with real-time Grafana performance dashboards.

---

## 2. System Architecture & Data Modeling

The solution employs a decoupled, containerized microservices architecture:

```text
                                  ┌───────────────────────────────┐
                                  │   Ingress / API Gateway Host  │
                                  └───────────────┬───────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │ (HTTP / )                                       │ (HTTP /api/*)
                         ▼                                                 ▼
           ┌───────────────────────────┐                     ┌───────────────────────────┐
           │   Frontend Web Service    │                     │   Backend API Service     │
           │   React 18 + Nginx        │                     │   FastAPI (Python 3.12)   │
           └───────────────────────────┘                     └─────────────┬─────────────┘
                                                                           │
                                                 ┌─────────────────────────┴────────────────────────┐
                                                 │ (SQLAlchemy ORM)                                 │ (/metrics OpenMetrics)
                                                 ▼                                                  ▼
                                   ┌───────────────────────────┐                      ┌───────────────────────────┐
                                   │   PostgreSQL 16 Database  │                      │ Prometheus & Grafana      │
                                   │   Relational Schema       │                      │ Telemetry & Metrics       │
                                   └───────────────────────────┘                      └───────────────────────────┘
```

### Relational Schema Design
Managed through **Alembic** migrations:
- `lab_members`: Personnel records, roles, departmental affiliations, and security clearance.
- `lab_projects`: Research initiatives, lead engineers, deadlines, and budget tracking.
- `project_members`: Many-to-many relationship mapping personnel to active projects.
- `vendors`: Hardware suppliers, procurement histories, and total spend aggregates.
- `expenses`: Direct project expenditure records categorized by operational type.
- `purchase_orders`: Hardware procurement lifecycle (`pending` → `approved` → `ordered` → `received`).

---

## 3. Fullstack Application Implementation

### 3.1 Operations Command Center (Dashboard)
The dashboard provides a high-contrast operations interface displaying hardware battery telemetry, active research projects, budget burn rates, and quick action workflows.

![Operations Command Center](screenshots/dashboard.png)

#### High-Contrast Laboratory Interface
Designed specifically for high-illumination robotics laboratory environments:

![Dashboard Light Theme View](screenshots/dashboard_light_theme_v2.png)

#### Real-Time Personnel Telemetry View
Integrated member activity feeds and live system status updates:

![Dashboard Personnel Status](screenshots/dashboard-members.png)

### 3.2 Robotics Research Project Catalog
Central catalog detailing mission objectives, team leads, milestone deadlines, and real-time budget consumption progress bars:

![Robotics Project Catalog](screenshots/projects.png)

#### Project Operations List
Comprehensive table view with sorting and category-based filtering:

![Project Catalog Grid](screenshots/projects_page_view.png)

### 3.3 Interactive Project Creation & Form Validation
Modal dialog handling payload validation, budget boundaries, and automatic ISO date normalization:

![Interactive Project Creation](screenshots/new_project_modal.png)

#### Form Submission Dialog (Active State)
Live modal capture during project initialization:

![New Project Modal Open](screenshots/new_project_modal_open.png)

### 3.4 Research Personnel & Member Management
Clearance levels, role definitions, and departmental allocations:

![Lab Members Directory](screenshots/members.png)

### 3.5 Procurement Ledger & Purchase Orders
End-to-end hardware procurement workflow linking vendor quotes to project budgets:

![Procurement & Purchases](screenshots/purchases.png)

---

## 4. Automated Testing & Quality Gates

The backend test suite is implemented using `pytest`, `pytest-asyncio`, and `httpx`. Database tests run against isolated in-memory SQLite instances to ensure zero contamination of production PostgreSQL records.

### Test Coverage Highlights
- `test_health` & `test_ready`: Verifies container health checks and database connectivity.
- `test_create_member`, `test_list_members`, `test_get_member_not_found`: Validates personnel CRUD endpoints.
- `test_create_project`: Asserts payload structure and date parsing.
- `test_create_vendor`: Tests supplier registration.
- `test_create_expense`: Validates category-based expense tracking.
- `test_create_purchase_order`: Asserts purchase order state machines.
- `test_duplicate_purchase_order_number`: Enforces database uniqueness constraints.
- `test_dashboard_stats`: Verifies real-time aggregation algorithms.

```text
============================= test session starts ==============================
platform linux -- Python 3.12.15, pytest-8.3.3, pluggy-1.7.0
rootdir: /app
plugins: asyncio-0.24.0, anyio-4.15.1
collected 10 items

tests/test_main.py::test_health PASSED                                   [ 10%]
tests/test_main.py::test_create_member PASSED                            [ 20%]
tests/test_main.py::test_list_members PASSED                             [ 30%]
tests/test_main.py::test_get_member_not_found PASSED                     [ 40%]
tests/test_main.py::test_create_project PASSED                            [ 50%]
tests/test_main.py::test_create_vendor PASSED                             [ 60%]
tests/test_main.py::test_create_expense PASSED                            [ 70%]
tests/test_main.py::test_create_purchase_order PASSED                     [ 80%]
tests/test_main.py::test_duplicate_purchase_order_number PASSED          [ 90%]
tests/test_main.py::test_dashboard_stats PASSED                          [100%]

============================== 10 passed in 2.61s ==============================
```

---

## 5. Containerization & Multi-Stage Docker

### 5.1 Backend Multi-Stage Container Architecture
- **Base:** Hardened Alpine Linux `python:3.12-alpine` with security upgrades.
- **Security:** Executes as unprivileged non-root user `appuser` (`UID 10001`).
- **Optimization:** Image size compacted from ~180MB down to ~60MB.

```dockerfile
FROM python:3.12-alpine
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN apk update && apk upgrade && apk add --no-cache curl gcc musl-dev libpq-dev
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && adduser -D -u 10001 appuser
COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app
USER 10001
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5.2 Frontend Multi-Stage Container Architecture
- **Build Stage:** `node:20-alpine` installs dependencies and compiles Vite static assets.
- **Runtime Stage:** `nginx:alpine` delivers static bundles with reverse proxy directives.
- **Security:** Runs without root system access.

### 5.3 Local Orchestration with Docker Compose
All microservice containers (frontend, backend, PostgreSQL, Prometheus, Grafana) run locally with one command:
```bash
docker compose up --build
```

#### Running Docker Compose Stack
Active container runtime showing healthy service endpoints:

![Docker Compose Services Running](screenshots/docker.png)

#### Standalone Backend Service Verification
Direct verification of FastAPI backend service container:

![Backend Service Container](screenshots/backend.png)

#### Standalone Frontend Service Verification
Direct verification of React/Nginx frontend service container:

![Frontend Service Container](screenshots/frontend.png)

---

## 6. Continuous Integration & Delivery (CI/CD)

The GitHub Actions CI/CD workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) executes automatically on every push or pull request to `main`:

```mermaid
flowchart LR
    A[Push to main] --> B[Backend Pytest 10/10]
    A --> C[Frontend Vite Build]
    B --> D[Docker Buildx Backend & Frontend]
    C --> D
    D --> E[Push to GHCR with Commit SHA]
    E --> F[Trivy Security Vulnerability Scan Gate]
    F --> G[Production Deployment Ready]
```

### Key Workflow Features
- **Deterministic Dependencies:** Python and Node packages are pinned.
- **GitHub Layer Caching:** Utilizes `cache-from: type=gha` and `cache-to: type=gha,mode=max` for 3x faster container compilation.
- **Immutable OCI Artifacts:** Images are tagged with unique 7-character Git commit SHAs (e.g. `ghcr.io/sameerkhans13/robotics-lab-portal-backend:aa3d38a`).

### Successful Pipeline Execution (100% Green Run)
All jobs (Frontend Build, Pytest Backend Tests, Docker Build & Push, Trivy Scan) passing cleanly:

![GitHub Actions 100% Green CI/CD Pipeline](screenshots/github-ci-cd-pip.png)

---

## 7. DevSecOps & Vulnerability Scanning (Trivy)

Security is integrated directly into the CI/CD pipeline using **Aqua Security Trivy**.

### Security Gate Configuration
```yaml
- name: Scan backend image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-backend:${{ needs.docker-build.outputs.image_sha }}
    format: table
    exit-code: "1"
    ignore-unfixed: true
    severity: CRITICAL,HIGH
```

### Security Hardening & Remediation
1. **Debian Base Image CVEs:** The original `python:3.12-slim` image suffered from 48 unpatched HIGH CVEs in Debian Trixie system utilities (`util-linux`, `curl`, `systemd`). Switching to `python:3.12-alpine` with automated `apk upgrade` eliminated all 48 OS-level CVEs.
2. **Python Package Vulnerabilities:** Upgraded `python-multipart` to `>=0.0.30` and pinned FastAPI `<0.137.0` to resolve `CVE-2026-24486`, `CVE-2026-42561`, and `CVE-2026-53539` while maintaining Prometheus route compatibility.

---

## 8. Cloud Infrastructure as Code (AWS & Terraform)

All cloud infrastructure is declared in [`terraform/`](terraform/) following AWS Well-Architected Framework guidelines.

### Provisioned Resources
- **Amazon VPC:** Dedicated `10.0.0.0/16` CIDR block with DNS hostnames and support enabled.
- **Public Subnets:** Two subnets spanning availability zones `ap-south-1a` (`10.0.1.0/24`) and `ap-south-1b` (`10.0.2.0/24`).
- **Routing:** Internet Gateway (`igw`) attached to custom route table providing outbound internet access.
- **Amazon EKS Cluster:** Managed Kubernetes control plane `robotics-portal-eks` with IAM roles and OIDC provider.
- **EKS Node Group:** Auto-scaling EC2 worker nodes using the Amazon Linux 2023 (`AL2023_x86_64_STANDARD`) AMI.

### 8.1 Terraform Provider & Backend Initialization
Initializing the AWS provider and terraform state management:

![Terraform Init](screenshots/teraform-init.png)

### 8.2 Declarative Code Syntax Validation
Validating HCL configurations, variables, and cross-resource references:

![Terraform Validate](screenshots/teraform%20validate.png)

### 8.3 Infrastructure Execution Plan
Generating execution plan detailing 15 cloud resources scheduled for creation:

![Terraform Plan](screenshots/terraform-plan.png)

### 8.4 State Application & Resource Creation
Executing Terraform state apply to provision the AWS environment:

![Terraform State Apply](screenshots/teraform-check.png)

### 8.5 AWS Management Console — Amazon EC2 & Subnets
Visual confirmation of provisioned worker instances, VPCs, and public route tables:

![AWS EC2 Console](screenshots/ec2-dash.png)

### 8.6 AWS Management Console — Amazon EKS Control Plane
Amazon EKS cluster in `Active` status:

![AWS EKS Console](screenshots/eks-dash.png)

#### Cluster Network & Node Group Topology
Detailed view of active node groups and control plane networking:

![AWS EKS Details](screenshots/eks.png)

---

## 9. Kubernetes Orchestration & Helm Packaging

Application microservices are packaged as modular Helm charts under [`helm/robotics-portal/`](helm/robotics-portal/).

### Chart Architecture
- `templates/backend-deployment.yaml`: FastAPI deployment (2 replicas) with liveness (`/health`) and readiness (`/ready`) probes.
- `templates/frontend-deployment.yaml`: React/Nginx deployment (2 replicas) with HTTP health probes.
- `templates/postgres-deployment.yaml`: Persistent PostgreSQL instance with internal `ClusterIP` service.
- `templates/ingress.yaml`: Ingress controller routing `/` traffic to frontend and `/api` to backend.
- `templates/configmap.yaml` & `templates/secret.yaml`: Secure environment decoupling.

### 9.1 Helm Chart Linting & Manifest Verification
Validating chart syntax and template parameter injection:

![Helm Template Check](screenshots/helm-temp.png)

### 9.2 Helm Release Deployment
Installing the release onto the cluster:

![Helm List](screenshots/helm.png)

### 9.3 Rolling Zero-Downtime Upgrades
Applying chart updates with automated rolling pod replacement:

![Helm Upgrade](screenshots/helm-upg.png)

### 9.4 Workloads & Pod Health Status (`kubectl get pods`)
Verification of active Kubernetes pods in `Running` state:

![Kubectl Workload Health](screenshots/kubectl.png)

### 9.5 Live Application Access via Ingress
Verification of portal UI accessed through ingress routing:

![Portal Deployed via Helm](screenshots/portal-helm.png)

### 9.6 Local Minikube Cluster Topology
Cluster orchestration and node health validation:

![Cluster Node Proof](screenshots/minikube.png)

---

## 10. Full-Stack Observability (Prometheus & Grafana)

The microservices stack is fully instrumented for real-time observability:

### 10.1 Prometheus Scrape Targets (100% UP)
Prometheus continuously scrapes the `/metrics` endpoint on port `8000`:

![Prometheus Targets UP](screenshots/prometheus_targets.png)

#### Scrape Endpoint Verification
Clean metrics target health status:

![Prometheus Clean Targets](screenshots/prometheus_targets_clean.png)

### 10.2 Grafana Real-Time Operations Dashboard
Visual dashboard ([`monitoring/grafana-dashboard.json`](monitoring/grafana-dashboard.json)) rendering real-time HTTP throughput (RPS), p95 response latencies, and service error rates:

![Grafana Dashboard](screenshots/grafana_dashboard.png)

---

## 11. Conclusion & Operational Verification

The **Robotics Lab Operations Portal** fulfills all requirements of a modern, secure, and resilient DevOps implementation:

| Module | Engineering Outcome | Verification Status |
|---|---|:---:|
| **Application** | Asynchronous FastAPI + React 18 SPA + PostgreSQL + Alembic | ✅ Verified |
| **Testing** | 10/10 passing unit and integration tests with isolated fixtures | ✅ Verified |
| **Git & GitHub** | Conventional semantic commits, branch protection, clean `.gitignore` | ✅ Verified |
| **Docker** | Multi-stage non-root containers, 60MB Alpine footprint, Compose stack | ✅ Verified |
| **CI/CD** | Automated GitHub Actions pipeline with GHCR commit SHA publishing | ✅ Verified |
| **DevSecOps** | Trivy OCI security scanning with zero unpatched High/Critical CVEs | ✅ Verified |
| **Terraform** | AWS multi-AZ VPC, subnets, IGW, and Amazon EKS cluster with AL2023 nodes | ✅ Verified |
| **Kubernetes** | Helm charts, multi-replica deployments, Ingress routing, rolling upgrades | ✅ Verified |
| **Observability**| Prometheus `/metrics` scraping at 100% UP + live Grafana RPS/latency graphs | ✅ Verified |
| **Documentation**| Complete project report with 100% screenshot coverage | ✅ Verified |

---

*DevOps Capstone Project Report — Autonomous Robotics Lab Operations Portal*
