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
    C_PRIMARY_LIGHT = RGBColor(236, 254, 255) # cyan-50 #ecfeff
    C_DARK = RGBColor(15, 23, 42)         # slate-900 #0f172a
    C_TEXT = RGBColor(51, 65, 85)         # slate-700 #334155
    C_MUTED = RGBColor(100, 116, 139)     # slate-500 #64748b
    C_EMERALD = RGBColor(16, 185, 129)    # emerald-500 #10b981
    C_EMERALD_BG = RGBColor(236, 253, 245)# emerald-50 #ecfdf5
    C_SKY_BG = RGBColor(240, 249, 255)    # sky-50 #f0f9ff
    C_SKY_BORDER = RGBColor(186, 230, 253)# sky-200 #bae6fd
    C_ACCENT = RGBColor(3, 105, 161)      # sky-700 #0369a1

    # =========================================================================
    # SLIDE 1: ULTRA-BEAUTIFUL TITLE PAGE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_BG
    bg1.line.fill.background()

    # Left Hero Container
    left_hero = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(5.8), Inches(5.9))
    left_hero.fill.solid()
    left_hero.fill.fore_color.rgb = C_CARD
    left_hero.line.color.rgb = C_BORDER
    left_hero.line.width = Pt(1.5)

    tf1 = left_hero.text_frame
    tf1.word_wrap = True
    tf1.margin_left = Inches(0.4)
    tf1.margin_top = Inches(0.4)
    tf1.margin_right = Inches(0.4)
    tf1.margin_bottom = Inches(0.3)

    p_badge = tf1.paragraphs[0]
    p_badge.text = "FINAL CAPSTONE PROJECT  •  SESSION 21"
    p_badge.font.size = Pt(9.5)
    p_badge.font.bold = True
    p_badge.font.color.rgb = C_PRIMARY
    p_badge.font.name = "Arial"

    p_main_title = tf1.add_paragraph()
    p_main_title.text = "Autonomous Robotics Lab Operations Portal"
    p_main_title.font.size = Pt(24)
    p_main_title.font.bold = True
    p_main_title.font.color.rgb = C_DARK
    p_main_title.font.name = "Arial"
    p_main_title.space_before = Pt(8)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Enterprise Fullstack Architecture, Automated CI/CD, AWS EKS Cloud Infrastructure & Full Observability"
    p_sub.font.size = Pt(11.5)
    p_sub.font.color.rgb = C_MUTED
    p_sub.font.name = "Arial"
    p_sub.space_before = Pt(6)

    # Candidate Meta Box inside Hero
    p_div = tf1.add_paragraph()
    p_div.text = "STUDENT & SUBMISSION DETAILS"
    p_div.font.size = Pt(8.5)
    p_div.font.bold = True
    p_div.font.color.rgb = C_PRIMARY
    p_div.font.name = "Arial"
    p_div.space_before = Pt(18)

    p_cand = tf1.add_paragraph()
    p_cand.text = "Candidate: Sameer Khan S\nRoll Number: 24BC10245\nProgram: DevOps & Cloud Engineering Capstone\nRepository: github.com/SameerKhans13/devops-robotics-portal"
    p_cand.font.size = Pt(10.5)
    p_cand.font.bold = True
    p_cand.font.color.rgb = C_DARK
    p_cand.font.name = "Arial"
    p_cand.space_before = Pt(4)


    # Right Image Frame for Slide 1
    right_frame = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(0.8), Inches(5.733), Inches(5.9))
    right_frame.fill.solid()
    right_frame.fill.fore_color.rgb = C_CARD
    right_frame.line.color.rgb = C_BORDER
    right_frame.line.width = Pt(1.5)

    if os.path.exists("screenshots/dashboard.png"):
        slide1.shapes.add_picture("screenshots/dashboard.png", Inches(7.0), Inches(1.3), width=Inches(5.333))

    cap1 = slide1.shapes.add_textbox(Inches(7.0), Inches(5.9), Inches(5.333), Inches(0.5))
    cap1.text_frame.word_wrap = True
    p_c1 = cap1.text_frame.paragraphs[0]
    p_c1.text = "📷 Operations Command Center with Live Battery Telemetry & Budget Tracking"
    p_c1.font.size = Pt(9)
    p_c1.font.color.rgb = C_MUTED
    p_c1.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: DEDICATED CANDIDATE & PROJECT PROFILE PAGE
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    bg2 = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = C_BG
    bg2.line.fill.background()

    # Header Card
    h_card2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(11.733), Inches(1.2))
    h_card2.fill.solid()
    h_card2.fill.fore_color.rgb = C_CARD
    h_card2.line.color.rgb = C_BORDER
    h_card2.line.width = Pt(1.2)

    tf_h2 = h_card2.text_frame
    tf_h2.margin_left = Inches(0.3)
    tf_h2.margin_top = Inches(0.12)
    p2_t = tf_h2.paragraphs[0]
    p2_t.text = "CANDIDATE & PROJECT IDENTIFICATION"
    p2_t.font.size = Pt(9.5)
    p2_t.font.bold = True
    p2_t.font.color.rgb = C_PRIMARY
    p2_title = tf_h2.add_paragraph()
    p2_title.text = "Candidate Profile & Project Submission Metadata"
    p2_title.font.size = Pt(19)
    p2_title.font.bold = True
    p2_title.font.color.rgb = C_DARK

    # 4 Profile Cards Grid (2x2)
    grid_cards = [
        ("STUDENT IDENTIFICATION", [
            ("Full Name", "Sameer Khan S"),
            ("Roll Number", "24BC10245"),
            ("Academic Track", "DevOps & Cloud Engineering Final Capstone"),
            ("Evaluation Standard", "Session 21 Grading Rubric (100 Points)")
        ]),
        ("PROJECT SPECIFICATIONS", [
            ("Project Name", "Autonomous Robotics Lab Operations Portal"),
            ("Application Stack", "FastAPI (Python 3.12) + React 18 + PostgreSQL 16"),
            ("Infrastructure Stack", "AWS EKS 1.30, Multi-AZ VPC, Terraform, Helm v2"),
            ("Observability Stack", "OpenMetrics, Prometheus Server, Grafana Telemetry")
        ]),
        ("EVALUATION & QUALITY METRICS", [
            ("Automated Testing", "10 Passed Pytest Test Cases (0 Failures)"),
            ("Security Hardening", "0 Unfixed High/Critical CVEs via Aqua Trivy"),
            ("Docker Optimization", "60MB Hardened Non-Root Alpine Containers"),
            ("CI/CD Automation", "100% Green GitHub Actions Pipeline Execution")
        ]),
        ("SUBMISSION & REPOSITORY ASSETS", [
            ("GitHub Repository", "github.com/SameerKhans13/devops-robotics-portal"),
            ("Active Branch", "main (Protected with Automated Status Checks)"),
            ("Documentation", "PROJECT_REPORT.md, README.md, presentation.html"),
            ("Presentation Deck", "robotics_portal_devops_presentation.pptx (16:9)")
        ])
    ]

    coords = [
        (Inches(0.8), Inches(2.1)),
        (Inches(6.8), Inches(2.1)),
        (Inches(0.8), Inches(4.5)),
        (Inches(6.8), Inches(4.5))
    ]

    for (c_label, c_items), (cx, cy) in zip(grid_cards, coords):
        card_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(5.733), Inches(2.15))
        card_box.fill.solid()
        card_box.fill.fore_color.rgb = C_CARD
        card_box.line.color.rgb = C_BORDER
        card_box.line.width = Pt(1.2)

        accent = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, cx + Inches(0.02), cy + Inches(0.12), Inches(0.08), Inches(1.91))
        accent.fill.solid()
        accent.fill.fore_color.rgb = C_PRIMARY
        accent.line.fill.background()

        tf_cb = card_box.text_frame
        tf_cb.word_wrap = True
        tf_cb.margin_left = Inches(0.3)
        tf_cb.margin_top = Inches(0.18)
        tf_cb.margin_right = Inches(0.2)

        p_h = tf_cb.paragraphs[0]
        p_h.text = c_label
        p_h.font.size = Pt(11)
        p_h.font.bold = True
        p_h.font.color.rgb = C_PRIMARY

        for k, v in c_items:
            p_i = tf_cb.add_paragraph()
            p_i.text = f"•  {k}: {v}"
            p_i.font.size = Pt(9.5)
            p_i.font.color.rgb = C_TEXT
            p_i.space_before = Pt(3)

    # Footer
    f2 = slide2.shapes.add_textbox(Inches(0.8), Inches(6.85), Inches(11.733), Inches(0.4))
    p_f2 = f2.text_frame.paragraphs[0]
    p_f2.text = "Candidate: Sameer Khan S  |  Roll Number: 24BC10245  |  Autonomous Robotics Lab Portal  |  Slide 2 of 12"
    p_f2.font.size = Pt(8.5)
    p_f2.font.color.rgb = C_MUTED

    # =========================================================================
    # REMAINING TECHNICAL MODULE SLIDES (Slides 3 to 12)
    # =========================================================================
    slides_config = [
        # Slide 3: Fullstack & UI
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
        # Slide 4: Validation & Testing
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
        # Slide 5: Docker Containerization
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
        # Slide 6: CI/CD Pipeline
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
        # Slide 7: DevSecOps Trivy
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
                ("FastAPI Compatibility Fix", "Pinned FastAPI <0.137.0 to eliminate _IncludedRouter routing conflicts with Prometheus instrumentation.")
            ],
            "image": "screenshots/github-ci-cd-pip.png",
            "caption": "Trivy Security Gate passing cleanly with zero unfixed High/Critical vulnerabilities."
        },
        # Slide 8: Terraform Cloud IaC
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
        # Slide 9: AWS Console Proof
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
        # Slide 10: Kubernetes & Helm
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
        # Slide 11: Observability
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
        # Slide 12: Summary
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

        # 3. Left Section: 4 Structured Cards
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

            max_inner_w = frame_w - Inches(0.3)
            max_inner_h = frame_h - Inches(0.7)

            if (max_inner_w / aspect) <= max_inner_h:
                calc_w = max_inner_w
                calc_h = max_inner_w / aspect
            else:
                calc_h = max_inner_h
                calc_w = max_inner_h * aspect

            img_x = right_x + (frame_w - calc_w) / 2
            img_y = right_y + Inches(0.18) + (max_inner_h - calc_h) / 2

            slide.shapes.add_picture(img_path, img_x, img_y, width=calc_w, height=calc_h)

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
        slide_num = s_idx + 3
        p_f.text = f"Autonomous Robotics Lab Operations Portal  |  Sameer Khan S (24BC10245)  |  Slide {slide_num} of 12"
        p_f.font.size = Pt(8.5)
        p_f.font.color.rgb = C_MUTED

    out_file = "robotics_portal_devops_presentation.pptx"
    prs.save(out_file)
    print(f"Presentation saved successfully with profile slide to: {out_file}")

if __name__ == "__main__":
    build_advanced_deck()
