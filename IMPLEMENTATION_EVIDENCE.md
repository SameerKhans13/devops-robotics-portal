# 🚀 Robotics Lab Portal — Live Implementation & Operations Manual

An end-to-end technical guide to the architecture, cloud infrastructure, container workflows, Kubernetes deployment, and real-time observability of the **Robotics Lab Operations Portal**.

---

## 📑 Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Fullstack Application & UI Showcase](#2-fullstack-application--ui-showcase)
3. [Containerization & Local Orchestration](#3-containerization--local-orchestration)
4. [Continuous Integration & Automated Delivery (CI/CD)](#4-continuous-integration--automated-delivery-cicd)
5. [DevSecOps & Container Vulnerability Hardening](#5-devsecops--container-vulnerability-hardening)
6. [Cloud Infrastructure Provisioning (AWS & Terraform)](#6-cloud-infrastructure-provisioning-aws--terraform)
7. [Kubernetes Orchestration & Helm Packaging](#7-kubernetes-orchestration--helm-packaging)
8. [Production Observability & Monitoring](#8-production-observability--monitoring)
9. [Automated Testing & Reliability](#9-automated-testing--reliability)

---

## 1. Architectural Overview

The **Robotics Lab Portal** coordinates hardware assets, procurement lifecycles, research initiatives, and personnel for advanced robotics development.

```text
                                 ┌───────────────────────────────┐
                                 │     Browser / Ingress Host    │
                                 └───────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │ (HTTP / )                                       │ (HTTP /api/*)
                        ▼                                                 ▼
          ┌───────────────────────────┐                     ┌───────────────────────────┐
          │  Frontend Service (Nginx) │                     │   Backend Service (FastAPI)│
          │  React 18 + Vite SPA      │                     │   Python 3.12 (Alpine)    │
          └───────────────────────────┘                     └─────────────┬─────────────┘
                                                                          │
                                                ┌─────────────────────────┴────────────────────────┐
                                                │ (SQLAlchemy ORM)                                 │ (/metrics OpenMetrics)
                                                ▼                                                  ▼
                                  ┌───────────────────────────┐                      ┌───────────────────────────┐
                                  │   PostgreSQL 16 Database  │                      │ Prometheus & Grafana      │
                                  │   Relational Schema       │                      │ Telemetry & Dashboard     │
                                  └───────────────────────────┘                      └───────────────────────────┘
```

---

## 2. Fullstack Application & UI Showcase

The portal user interface is engineered with **React 18**, **Tailwind CSS**, and modern SVG/vector robotics iconography, designed for operational clarity in bright laboratory environments.

### 2.1 Operations Command Center (Dashboard)
Aggregates active hardware allocation (Titan-X Quadruped, Nautilus Subsea ROV, AeroGlide VTOL Drone), live battery levels, open research projects, and budgetary utilization metrics.

![Operations Command Center](screenshots/dashboard.png)

### 2.2 Robotics Projects Directory
Tracks high-priority initiatives, team leads, milestone deadlines, and real-time budget consumption against allocated funds.

![Robotics Project Catalog](screenshots/projects.png)

### 2.3 Interactive Project Creation & Validation
Modal dialog handling real-time payload sanitization, automatic ISO date normalization, and error handling.

![Interactive Project Creation](screenshots/new_project_modal.png)

### 2.4 Research Personnel & Member Management
Comprehensive directory detailing engineering specializations, access clearance tiers, and assigned lab divisions.

![Lab Members Directory](screenshots/members.png)

### 2.5 Procurement & Purchase Orders
End-to-end procurement ledger tracking hardware vendors, line item expenses, and order fulfillment states.

![Procurement & Purchases](screenshots/purchases.png)

---

## 3. Containerization & Local Orchestration

The platform implements multi-stage OCI-compliant container builds optimized for footprint and security:

- **Backend Container (`backend/Dockerfile`):**
  - Base: Alpine Linux `python:3.12-alpine` with security upgrades.
  - Security: Executes as non-root user `appuser` (`UID 10001`).
  - Size: Compacted from ~180MB (Debian) down to ~60MB.
- **Frontend Container (`frontend/Dockerfile`):**
  - Build Stage: `node:20-alpine` builds optimized static bundles.
  - Runtime Stage: `nginx:alpine` delivers production static files with custom reverse proxy directives.
  - Security: Non-root runtime execution.

### Local Stack Verification (`docker compose up --build`)
Single-command local environment running frontend, backend, PostgreSQL database, Prometheus, and Grafana.

![Docker Compose Running](screenshots/docker.png)

---

## 4. Continuous Integration & Automated Delivery (CI/CD)

The pipeline is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and runs on all pushes and pull requests to `main`.

### Pipeline Stages
1. **🧪 Automated Pytest:** Runs 10/10 test cases in Python 3.12 with isolated SQLite database fixtures.
2. **🏗️ Frontend Build:** Compiles React 18 TypeScript/JSX assets via Vite.
3. **🐳 Docker Buildx & GHCR Push:** Builds both images with GitHub Actions layer caching (`type=gha`) and publishes to GitHub Container Registry (`ghcr.io`).
4. **🏷️ Commit SHA Tagging:** Images receive immutable Git commit SHA tags (e.g., `ghcr.io/sameerkhans13/robotics-lab-portal-backend:aa3d38a`) rather than unstable `latest` tags.

### Production Pipeline Execution
All build, test, and security stages passing with 100% green status:

![GitHub Actions CI/CD Pipeline](screenshots/github-ci-cd-pip.png)

---

## 5. DevSecOps & Container Vulnerability Hardening

Container security is enforced via **Aqua Security Trivy** directly integrated as a gate in the CI/CD pipeline:

- **Enforcement Policy:** The build strictly aborts on any unfixed `HIGH` or `CRITICAL` severity CVE (`exit-code: 1`).
- **Base Image Hardening:** By shifting the backend image from Debian Trixie to Alpine Linux and locking dependencies (`python-multipart>=0.0.30`, `starlette>=0.49.1`), all 48 unpatched OS-level vulnerabilities were eliminated.

---

## 6. Cloud Infrastructure Provisioning (AWS & Terraform)

All cloud infrastructure is declared as code under [`terraform/`](terraform/) for AWS cloud environments.

### 6.1 Terraform Initialization
Configuring AWS provider credentials, plugins, and remote state backends:

![Terraform Init](screenshots/teraform-init.png)

### 6.2 Syntax & Configuration Validation
Validating declarative HCL syntax and resource parameter definitions:

![Terraform Validate](screenshots/teraform%20validate.png)

### 6.3 Infrastructure Execution Plan
Generating execution blueprint provisioning VPC, multi-AZ public subnets, internet gateways, and EKS node groups:

![Terraform Plan](screenshots/terraform-plan.png)

### 6.4 Cloud State Application
Applying real-world infrastructure state across the target AWS region:

![Terraform State Apply](screenshots/teraform-check.png)

### 6.5 AWS Cloud Console — EC2 & Subnet Verification
Provisioned EC2 worker node instances and public routing tables:

![AWS EC2 Console](screenshots/ec2-dash.png)

### 6.6 AWS Cloud Console — Amazon EKS Control Plane
Amazon EKS cluster in `Active` status orchestrating the Kubernetes control plane:

![AWS EKS Console](screenshots/eks-dash.png)

---

## 7. Kubernetes Orchestration & Helm Packaging

Cloud-native application workloads are packaged into production Helm v2 charts under [`helm/robotics-portal/`](helm/robotics-portal/).

### 7.1 Helm Chart Validation & Template Rendering
Linting templates, parameter injections, and manifest integrity:

![Helm Template Check](screenshots/helm-temp.png)

### 7.2 Helm Release Deployment
Deploying the microservices stack to the target namespace:

![Helm List](screenshots/helm.png)

### 7.3 Rolling Upgrades & Rollout Status
Applying declarative zero-downtime rolling upgrades:

![Helm Upgrade](screenshots/helm-upg.png)

### 7.4 Kubernetes Workloads & Pod Health (`kubectl get pods`)
Multi-replica backend and frontend pods running with healthy liveness and readiness probes:

![Kubectl Workload Health](screenshots/kubectl.png)

### 7.5 Portal Deployed via Helm
Direct ingress routing serving the portal application:

![Portal Deployed via Helm](screenshots/portal-helm.png)

### 7.6 Cluster Nodes & Minikube Verification
Kubernetes node topologies and namespace configuration:

![Cluster Node Proof](screenshots/minikube.png)

---

## 8. Production Observability & Monitoring

The system exposes full application-level and infrastructure-level telemetry.

### 8.1 Prometheus Telemetry Targets (100% UP)
Scraping microservice metrics endpoints at `/metrics` over port `8000`:

![Prometheus Targets UP](screenshots/prometheus_targets.png)

### 8.2 Grafana Real-Time Operations Dashboard
Visual metrics visualizing HTTP request throughput (RPS), p95 response latencies, and service telemetry:

![Grafana Dashboard](screenshots/grafana_dashboard.png)

---

## 9. Automated Testing & Reliability

The test suite runs automatically during every CI run and can be executed locally:

```bash
cd backend
python -m pytest -q --tb=short
```

```text
..........                                                               [100%]
============================== 10 passed in 2.61s ==============================
```

- **Health & Readiness:** Proves `/health` and `/ready` respond with `200 OK`.
- **Relational Integrity:** Tests entity creation, updating, retrieval, and relational cascades across all tables.
- **Constraints Validation:** Enforces purchase order number uniqueness and budget calculations.
- **Isolation:** Executes in memory without modifying production databases.

---

*Robotics Lab Operations Portal — Engineered with modern DevOps principles.*
