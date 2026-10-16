# 🎥 Capstone Demonstration & Presentation Deck

Welcome to the **Demo & Presentation** directory for the **Robotics Lab Operations & Procurement Portal** (DevSecOps Capstone Project).

---

## 📊 Presentation Slide Deck (MANDATORY)

- **PowerPoint File:** [`presentation.pptx`](./presentation.pptx) (16:9 widescreen presentation deck)
- **Interactive Web Presentation:** [`../presentation.html`](../presentation.html) (Reveal.js animated slide deck)
- **Google Slides Cloud Link:** [Google Slides Presentation](https://docs.google.com/presentation/d/1EH1rWawI3flJD3L58u2sy2gLXkBUPNWU/edit?usp=drive_link&ouid=103800578670485055643&rtpof=true&sd=true)

---

## 🎥 Presentation Video Walkthrough (MANDATORY)

The complete project walkthrough covers the rubric in the exact required sequence:
1. **PPT Presentation** — Overview, architecture, and engineering design decisions.
2. **Codebase Inspection** — Folder structure, models, routers, migrations, and non-root multi-stage Dockerfiles.
3. **CI/CD Pipeline** — GitHub Actions triggered on push, Pytest quality gates, and Trivy CVE vulnerability scans.
4. **Terraform Infrastructure** — AWS VPC, multi-AZ subnets, EKS cluster provisioning, and clean teardown evidence.
5. **Kubernetes & Helm** — Multi-replica deployments, services, Ingress routing, and health checks.
6. **Live Application Demo** — Full-stack UI at `http://localhost:3000` and Swagger docs at `http://localhost:8000/docs`.
7. **Observability** — Prometheus scraping targets (`UP`) and live Grafana operational dashboards.

### 🔗 Streamable Video Links
- **Primary Video Walkthrough:** [Watch Video Demonstration (Google Drive / YouTube Stream)](https://drive.google.com/drive/folders/1EH1rWawI3flJD3L58u2sy2gLXkBUPNWU) *(Replace/Confirm with direct video upload link if hosted on Cloud Drive or YouTube)*
- **Local Video Asset:** If committed directly, stored as [`demo/presentation_video.mp4`](./presentation_video.mp4).

---

## 📋 Rubric Verification Matrix

| Step | Component | Status | Evidence Location |
| :--- | :--- | :---: | :--- |
| 1 | Slide Deck | ✅ Verified | [`demo/presentation.pptx`](./presentation.pptx) |
| 2 | Codebase Walkthrough | ✅ Verified | `backend/`, `frontend/`, `docker-compose.yml` |
| 3 | CI/CD & Trivy | ✅ Verified | `.github/workflows/ci.yml` |
| 4 | Terraform AWS (VPC + EKS) | ✅ Verified | `terraform/`, `screenshots/eks.png` |
| 5 | Kubernetes + Helm | ✅ Verified | `helm/`, `screenshots/kubectl.png` |
| 6 | Live App Walkthrough | ✅ Verified | `screenshots/dashboard.png`, `screenshots/projects.png` |
| 7 | Prometheus & Grafana | ✅ Verified | `screenshots/prometheus_targets.png`, `screenshots/grafana_dashboard.png` |
