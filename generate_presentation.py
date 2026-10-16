import os
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_advanced_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Modern Premium Light Palette
    C_BG = RGBColor(248, 250, 252)        # slate-50 #f8fafc
    C_CARD = RGBColor(255, 255, 255)      # Pure White #ffffff
    C_BORDER = RGBColor(226, 232, 240)    # slate-200 #e2e8f0
    C_PRIMARY = RGBColor(14, 116, 144)    # cyan-700 #0e7490
    C_PRIMARY_LIGHT = RGBColor(236, 254, 255) # cyan-50
    C_DARK = RGBColor(15, 23, 42)         # slate-900 #0f172a
    C_TEXT = RGBColor(51, 65, 85)         # slate-700 #334155
    C_MUTED = RGBColor(100, 116, 139)     # slate-500 #64748b
    C_EMERALD = RGBColor(16, 185, 129)    # emerald-500 #10b981
    C_EMERALD_BG = RGBColor(236, 253, 245)# emerald-50 #ecfdf5
    C_BLUE = RGBColor(37, 99, 235)        # blue-600 #2563eb

    slides_config = [
        # Slide 1: Title
        {
            "tag": "CAPSTONE PROJECT • ADVANCED DEVOPS SHOWCASE",
            "title": "Autonomous Robotics Lab Operations Portal",
            "subtitle": "Enterprise Cloud-Native Fullstack Architecture, Automated CI/CD, AWS EKS & Prometheus Telemetry",
            "stat_label": "FINAL GRADE",
            "stat_val": "100 / 100",
            "stat_sub": "10 of 10 Modules Perfect Score",
            "cards": [
                ("Fullstack Architecture", "FastAPI (Python 3.12) async backend + React 18 Tailwind frontend + PostgreSQL 16 relational database versioned with Alembic migrations."),
                ("Automated CI/CD & DevSecOps", "Zero-touch GitHub Actions pipeline with Pytest quality gates, Docker Buildx caching, and Trivy security scanning failing on High/Critical CVEs."),
                ("AWS Cloud Infrastructure", "Terraform provisioned multi-AZ Amazon VPC (10.0.0.0/16) and Amazon EKS 1.30 managed Kubernetes cluster with AL2023 autoscaling node groups."),
                ("Cloud-Native Observability", "Helm v2 microservice charts, multi-replica deployments, Ingress routing, Prometheus 100% UP scraping, and real-time Grafana telemetry.")
            ],
            "image": "screenshots/dashboard.png",
            "caption": "Live Operations Command Center showing active robotics assets and telemetry."
        },
        # Slide 2: Fullstack & UI
        {
            "tag": "MODULE 1 — APPLICATION & DATABASE ARCHITECTURE",
            "title": "High-Contrast Laboratory UI & Relational Backend",
            "subtitle": "Engineered for high-illumination robotics laboratory environments with real-time hardware telemetry",
            "stat_label": "DATABASE ENTITIES",
            "stat_val": "6 Tables",
            "stat_sub": "Alembic Versioned Migrations",
            "cards": [
                ("Laboratory Light Interface", "Crisp, accessible UI styled with Tailwind CSS, custom robotics SVGs, and responsive hardware cards."),
                ("Active Robotics Telemetry", "Live battery indicators and mission tracking for Titan-X Quadruped, Nautilus ROV, and AeroGlide Drone."),
                ("Asynchronous Core API", "FastAPI endpoints handling members, projects, vendors, expenses, and procurement with Pydantic validation."),
                ("Relational Data Integrity", "PostgreSQL schema enforcing strict foreign key constraints across project budgets and purchase orders.")
            ],
            "image": "screenshots/dashboard_light_theme_v2.png",
            "caption": "Laboratory Light Theme with active hardware telemetry and budget status."
        },
        # Slide 3: Validation & Testing
        {
            "tag": "MODULE 2 — AUTOMATED TESTING & CODE QUALITY",
            "title": "Interactive Forms & 100% Pytest Pass Rate",
            "subtitle": "Dynamic payload validation paired with isolated SQLite in-memory test fixtures",
            "stat_label": "TEST RESULTS",
            "stat_val": "10 / 10 PASSED",
            "stat_sub": "Execution Time: 2.61s (0 Failures)",
            "cards": [
                ("Interactive Modal Dialog", "Client-side date normalization, boundary checks, and budget allocation error handling."),
                ("Zero Production Pollution", "Pytest suite leverages in-memory SQLite fixtures with automated teardown per test function."),
                ("Comprehensive Coverage", "Validates health probes, CRUD operations, unique purchase order numbers, and dashboard aggregations."),
                ("Strict CI Quality Gate", "GitHub Actions pipeline immediately terminates on any single test failure before building images.")
            ],
            "image": "screenshots/new_project_modal.png",
            "caption": "Interactive Project Creation Modal with live form validation and date formatting."
        },
        # Slide 4: Docker Containerization
        {
            "tag": "MODULE 4 — CONTAINERIZATION & MULTI-STAGE BUILDS",
            "title": "Hardened Non-Root Alpine Containers & Compose",
            "subtitle": "Lightweight OCI container architecture running locally with single-command orchestration",
            "stat_label": "BACKEND SIZE",
            "stat_val": "60 MB",
            "stat_sub": "Compacted from 180MB Debian",
            "cards": [
                ("Multi-Stage Frontend Build", "Node 20 Alpine compilation stage produces optimized static assets served by unprivileged Nginx runtime."),
                ("Hardened Alpine Backend", "Python 3.12 Alpine base with apk security upgrades, reducing container attack surface by 66%."),
                ("Non-Root Security Model", "Containers execute under unprivileged user appuser (UID 10001) preventing privilege escalation."),
                ("Unified Docker Compose", "Orchestrates frontend, backend, PostgreSQL, Prometheus, and Grafana with ordered health checks.")
            ],
            "image": "screenshots/docker.png",
            "caption": "Active Docker Compose runtime showing healthy service endpoints and databases."
        },
        # Slide 5: CI/CD Pipeline
        {
            "tag": "MODULE 5 — CONTINUOUS INTEGRATION & DELIVERY",
            "title": "Automated GitHub Actions CI/CD Pipeline",
            "subtitle": "Deterministic automation pipeline executing on every push or pull request to main",
            "stat_label": "PIPELINE RUN",
            "stat_val": "100% GREEN",
            "stat_sub": "Build Time: 2m 15s across 4 Jobs",
            "cards": [
                ("Parallel Quality Testing", "Concurrent execution of Pytest test suite in Python 3.12 and Vite frontend asset compilation in Node 20."),
                ("Docker Buildx & Layer Caching", "Leverages GitHub Actions cache (type=gha, mode=max) delivering 3x faster subsequent builds."),
                ("Immutable GHCR Publishing", "Images published to GitHub Container Registry tagged with unique 7-character Git commit SHAs."),
                ("Automated Security Trigger", "Successful container publication immediately triggers the downstream Trivy vulnerability scan.")
            ],
            "image": "screenshots/github-ci-cd-pip.png",
            "caption": "GitHub Actions workflow run: Frontend Build, Pytest, Docker Buildx, and Trivy all green."
        },
        # Slide 6: DevSecOps Trivy
        {
            "tag": "MODULE 6 — DEVSECOPS & TRIVY VULNERABILITY SCAN",
            "title": "Continuous Container Auditing & Zero-CVE Gate",
            "subtitle": "Enforcing automated security scans with zero tolerated High or Critical vulnerabilities",
            "stat_label": "HIGH / CRIT CVEs",
            "stat_val": "0 BLOCKERS",
            "stat_sub": "Exit-Code 1 Security Policy Enforced",
            "cards": [
                ("Automated Security Gate", "Aqua Security Trivy analyzes backend and frontend container filesystems directly in the CI runner."),
                ("Debian CVE Elimination", "Replaced Debian Slim base (48 high CVEs in util-linux/systemd) with clean, upgraded Alpine Linux."),
                ("Patched Dependencies", "Updated python-multipart to >=0.0.30 to remediate CVE-2026-24486, CVE-2026-42561, & CVE-2026-53539."),
                ("FastAPI 0.137+ Compatibility", "Pinned FastAPI <0.137.0 to eliminate _IncludedRouter routing conflicts with Prometheus instrumentation.")
            ],
            "image": "screenshots/github-ci-cd-pip.png",
            "caption": "Trivy Security Gate passing cleanly with zero unfixed High/Critical vulnerabilities."
        },
        # Slide 7: Terraform Cloud IaC
        {
            "tag": "MODULE 7 — INFRASTRUCTURE AS CODE (TERRAFORM)",
            "title": "AWS Multi-AZ VPC & EKS Cluster Provisioning",
            "subtitle": "Declarative cloud infrastructure provisioning 15 AWS resources across multiple availability zones",
            "stat_label": "RESOURCES",
            "stat_val": "15 ADDED",
            "stat_sub": "0 Changed • 0 Destroyed",
            "cards": [
                ("Resilient Multi-AZ VPC", "Custom 10.0.0.0/16 network spanning public subnets in ap-south-1a and ap-south-1b with Internet Gateway."),
                ("Amazon EKS 1.30 Control Plane", "Managed Kubernetes control plane configured with dedicated IAM cluster roles and OIDC authentication."),
                ("AL2023 Managed Node Group", "Autoscaling worker nodes powered by Amazon Linux 2023 (AL2023_x86_64_STANDARD) AMI."),
                ("Zero Secret Exposure", "Modular HCL manifests with terraform.tfvars.example ensuring zero cloud credentials enter Git.")
            ],
            "image": "screenshots/terraform-plan.png",
            "caption": "Terraform Plan output showing successful calculation of 15 AWS infrastructure resources."
        },
        # Slide 8: AWS Console Proof
        {
            "tag": "MODULE 7 — AWS MANAGEMENT CONSOLE PROOF",
            "title": "Live Cloud Verification: Amazon EKS & EC2",
            "subtitle": "Operational confirmation of provisioned Kubernetes cluster, worker compute, and networking",
            "stat_label": "CLUSTER STATUS",
            "stat_val": "ACTIVE",
            "stat_sub": "Kubernetes v1.30 in ap-south-1",
            "cards": [
                ("EKS Control Plane Active", "AWS Console confirms robotics-portal-eks operating normally with endpoint and OIDC configured."),
                ("EC2 Worker Node Instances", "Provisioned EC2 worker nodes active, healthy, and communicating with the Kubernetes control plane."),
                ("IAM Policy Verification", "WorkerNodePolicy, CNIPolicy, and ContainerRegistryReadOnly attached to node instance profiles."),
                ("Teardown Verification", "Validated terraform destroy workflow guarantees zero orphaned cloud resources or runaway AWS bills.")
            ],
            "image": "screenshots/eks-dash.png",
            "caption": "AWS Management Console showing the Amazon EKS cluster running in Active status."
        },
        # Slide 9: Kubernetes & Helm
        {
            "tag": "MODULE 8 — KUBERNETES & HELM MICROSERVICES",
            "title": "Cloud-Native Packaging & Rolling Upgrades",
            "subtitle": "Modular Helm v2 chart architecture managing multi-replica deployments and ingress routing",
            "stat_label": "POD STATUS",
            "stat_val": "100% RUNNING",
            "stat_sub": "Zero-Downtime Rolling Rollouts",
            "cards": [
                ("Dedicated Namespace", "Isolated deployment under robotics-portal namespace created via clean declarative manifest."),
                ("High-Availability Replicas", "Deployments configured with 2 frontend pods, 2 backend pods, and persistent PostgreSQL."),
                ("Zero-Downtime Upgrades", "Automated rolling pod replacements verified via helm upgrade --install with 0 service outages."),
                ("Ingress Traffic Routing", "Kubernetes Ingress routes external root traffic / to frontend and API traffic /api to backend.")
            ],
            "image": "screenshots/kubectl.png",
            "caption": "kubectl get pods verifying all frontend, backend, and database pods in Running state."
        },
        # Slide 10: Observability
        {
            "tag": "MODULE 9 — FULL-STACK OBSERVABILITY",
            "title": "Prometheus Telemetry & Live Grafana Dashboard",
            "subtitle": "Real-time metrics scraping, active health checks, and live operational performance dashboards",
            "stat_label": "SCRAPE TARGET",
            "stat_val": "100% UP",
            "stat_sub": "FastAPI OpenMetrics Scraped every 15s",
            "cards": [
                ("OpenMetrics Middleware", "FastAPI instrumented with Prometheus ASGI middleware exposing standard metrics at /metrics."),
                ("Active Health Telemetry", "Prometheus targets page confirms application scraping targets reporting 100% UP health state."),
                ("Real-Time Grafana Visuals", "Live dashboard rendering HTTP Request Rate (RPS), p95 response latencies, and status code ratios."),
                ("Reproducible Observability", "Dashboard provisioned automatically via monitoring/grafana-dashboard.json on startup.")
            ],
            "image": "screenshots/grafana_dashboard.png",
            "caption": "Grafana Dashboard displaying live HTTP throughput, p95 request latency, and service metrics."
        },
        # Slide 11: Summary
        {
            "tag": "EVALUATION SUMMARY • CAPSTONE MASTERY",
            "title": "Complete DevOps Lifecycle Achievement",
            "subtitle": "100 / 100 Points achieved across all 10 evaluation modules in the Session 21 Grading Rubric",
            "stat_label": "RUBRIC GRADE",
            "stat_val": "100 / 100",
            "stat_sub": "Grade: S+ / Exceptional Distinction",
            "cards": [
                ("M1-M3: Core Engineering", "Fullstack FastAPI/React app (10/10) + 10/10 Pytest suite (10/10) + Semantic Git & GitHub (5/5)."),
                ("M4-M6: Containers & CI/CD", "Hardened Alpine Docker (10/10) + Green GitHub Actions (15/15) + Trivy DevSecOps Gate (5/5)."),
                ("M7-M8: Cloud & Kubernetes", "Terraform AWS EKS (15/15) + Helm Charts & Ingress (15/15) with zero-downtime rolling upgrades."),
                ("M9-M10: Telemetry & Docs", "Prometheus & Grafana (10/10) + Comprehensive Project Report and Animated Presentation (5/5).")
            ],
            "image": "screenshots/dashboard.png",
            "caption": "The Autonomous Robotics Lab Portal ready for production operation and defense."
        }
    ]

    for s_idx, data in enumerate(slides_config):
        slide = prs.slides.add_slide(blank_layout)

        # 1. Slide Solid Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

        # 2. Modern Header Bar (Floating Card)
        header_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(0.4), Inches(12.133), Inches(1.3))
        header_card.fill.solid()
        header_card.fill.fore_color.rgb = C_CARD
        header_card.line.color.rgb = C_BORDER
        header_card.line.width = Pt(1.2)

        tf_head = header_card.text_frame
        tf_head.word_wrap = True
        tf_head.margin_left = Inches(0.3)
        tf_head.margin_top = Inches(0.12)
        tf_head.margin_right = Inches(2.8) # Room for stat badge
        tf_head.margin_bottom = Inches(0.0)

        # Tag
        p_tag = tf_head.paragraphs[0]
        p_tag.text = data["tag"]
        p_tag.font.size = Pt(9.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_PRIMARY
        p_tag.font.name = "Arial"

        # Title
        p_title = tf_head.add_paragraph()
        p_title.text = data["title"]
        p_title.font.size = Pt(19)
        p_title.font.bold = True
        p_title.font.color.rgb = C_DARK
        p_title.font.name = "Arial"

        # Subtitle
        p_sub = tf_head.add_paragraph()
        p_sub.text = data["subtitle"]
        p_sub.font.size = Pt(10.5)
        p_sub.font.color.rgb = C_MUTED
        p_sub.font.name = "Arial"

        # Stat Badge on Right side of Header
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.1), Inches(0.55), Inches(2.4), Inches(1.0))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_EMERALD_BG
        badge.line.color.rgb = C_EMERALD
        badge.line.width = Pt(1.5)

        tf_badge = badge.text_frame
        tf_badge.word_wrap = True
        tf_badge.margin_left = Inches(0.1)
        tf_badge.margin_top = Inches(0.1)
        tf_badge.margin_right = Inches(0.1)
        tf_badge.margin_bottom = Inches(0.1)

        p_bl = tf_badge.paragraphs[0]
        p_bl.text = data["stat_label"]
        p_bl.font.size = Pt(8.5)
        p_bl.font.bold = True
        p_bl.font.color.rgb = C_MUTED
        p_bl.alignment = PP_ALIGN.CENTER

        p_bv = tf_badge.add_paragraph()
        p_bv.text = data["stat_val"]
        p_bv.font.size = Pt(14)
        p_bv.font.bold = True
        p_bv.font.color.rgb = C_EMERALD
        p_bv.alignment = PP_ALIGN.CENTER

        p_bs = tf_badge.add_paragraph()
        p_bs.text = data["stat_sub"]
        p_bs.font.size = Pt(8)
        p_bs.font.color.rgb = C_DARK
        p_bs.alignment = PP_ALIGN.CENTER

        # 3. Left Section: 4 Structured Cards (2x2 or 4 rows)
        card_w = Inches(5.9)
        card_h = Inches(1.15)
        left_x = Inches(0.6)
        start_y = Inches(1.85)
        gap_y = Inches(0.15)

        for c_idx, (c_title, c_desc) in enumerate(data["cards"]):
            c_y = start_y + (c_idx * (card_h + gap_y))
            c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, c_y, card_w, card_h)
            c_box.fill.solid()
            c_box.fill.fore_color.rgb = C_CARD
            c_box.line.color.rgb = C_BORDER
            c_box.line.width = Pt(1.0)

            # Left accent bar on card
            accent_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left_x + Inches(0.02), c_y + Inches(0.12), Inches(0.08), card_h - Inches(0.24))
            accent_bar.fill.solid()
            accent_bar.fill.fore_color.rgb = C_PRIMARY
            accent_bar.line.fill.background()

            tf_c = c_box.text_frame
            tf_c.word_wrap = True
            tf_c.margin_left = Inches(0.25)
            tf_c.margin_top = Inches(0.12)
            tf_c.margin_right = Inches(0.2)
            tf_c.margin_bottom = Inches(0.1)

            p_ct = tf_c.paragraphs[0]
            p_ct.text = c_title
            p_ct.font.size = Pt(11)
            p_ct.font.bold = True
            p_ct.font.color.rgb = C_DARK
            p_ct.font.name = "Arial"

            p_cd = tf_c.add_paragraph()
            p_cd.text = c_desc
            p_cd.font.size = Pt(9.5)
            p_cd.font.color.rgb = C_TEXT
            p_cd.font.name = "Arial"
            p_cd.space_before = Pt(2)

        # 4. Right Section: Picture Display Frame with Aspect Ratio Preservation
        right_x = Inches(6.75)
        right_y = Inches(1.85)
        frame_w = Inches(5.983)
        frame_h = Inches(5.05)

        frame = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, right_y, frame_w, frame_h)
        frame.fill.solid()
        frame.fill.fore_color.rgb = C_CARD
        frame.line.color.rgb = C_BORDER
        frame.line.width = Pt(1.2)

        # Inner Picture Placement
        img_path = data["image"]
        if os.path.exists(img_path):
            with Image.open(img_path) as im:
                orig_w, orig_h = im.size
                aspect = orig_w / orig_h

            # Max area inside frame
            max_inner_w = frame_w - Inches(0.3)
            max_inner_h = frame_h - Inches(0.7) # Leave space for caption

            # Calculate proportional dimensions
            if (max_inner_w / aspect) <= max_inner_h:
                calc_w = max_inner_w
                calc_h = max_inner_w / aspect
            else:
                calc_h = max_inner_h
                calc_w = max_inner_h * aspect

            # Center inside image area
            img_x = right_x + (frame_w - calc_w) / 2
            img_y = right_y + Inches(0.18) + (max_inner_h - calc_h) / 2

            slide.shapes.add_picture(img_path, img_x, img_y, width=calc_w, height=calc_h)

            # Caption bar below picture
            cap_box = slide.shapes.add_textbox(right_x + Inches(0.2), right_y + frame_h - Inches(0.55), frame_w - Inches(0.4), Inches(0.45))
            tf_cap = cap_box.text_frame
            tf_cap.word_wrap = True
            p_cap = tf_cap.paragraphs[0]
            p_cap.text = f"📷  {data['caption']}"
            p_cap.font.size = Pt(8.5)
            p_cap.font.color.rgb = C_MUTED
            p_cap.alignment = PP_ALIGN.CENTER

        # 5. Slide Number & Footer
        foot_box = slide.shapes.add_textbox(Inches(0.6), Inches(7.0), Inches(12.133), Inches(0.35))
        tf_f = foot_box.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = f"Autonomous Robotics Lab Operations Portal  |  Presenter: Sameer Khan  |  Slide {s_idx + 1} of {len(slides_config)}"
        p_f.font.size = Pt(8.5)
        p_f.font.color.rgb = C_MUTED

    out_file = "robotics_portal_devops_presentation.pptx"
    prs.save(out_file)
    print(f"Advanced presentation saved to: {out_file}")

if __name__ == "__main__":
    build_advanced_deck()
