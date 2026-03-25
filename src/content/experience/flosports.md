---
company: "FloSports"
title: "Tech Lead Manager, SRE"
image: "https://flocms.flosports.tv/wp-content/uploads/2026/02/FloSports-Secondary-igniteblack.svg"
url: "https://www.flosports.tv"
startDate: "2019-11"
endDate: null
sortOrder: 1
category: "professional"
summary: "From Infrastructure Engineer to Tech Lead Manager. Building developer platforms, driving cloud migrations, and establishing SRE practices for a live sports streaming platform."
promotions:
  - title: "Infrastructure Engineer"
    date: "2019"
  - title: "Senior Infrastructure Engineer"
    date: "2021"
  - title: "Tech Lead Manager, SRE"
    date: "2023"
highlights:
  - title: "GCP to AWS Cloud Migration"
    description: "Architected and executed full cloud consolidation from GCP to AWS. Migrated 20+ services including databases, caches, and CI/CD pipelines to EKS with zero downtime. Created self-service migration templates for teams."
  - title: "Load Testing Platform"
    description: "Built distributed K6 load testing platform from scratch across 4+ phases. Evolved to Kubernetes-native with K6 Operator, dedicated UI, CI/CD integration, and browser-level tests. Validates readiness for major live sporting events."
  - title: "Developer Experience Platform"
    description: "Built flo-deploy, opinionated Helm charts, and infrastructure-manifests to give developers a paved road to production. Authored RFC for Crossplane-based self-service platform."
  - title: "Observability & SRE Transformation"
    description: "Led org-wide Datadog migration and restructured team from DevOps/Infra to SRE to align outcomes with business goals. Established SLO-based culture with per-service reliability reporting, scorecards, and incident response frameworks."
---

## Infrastructure as Code

- **Terraform Foundation**: Built unified IaC across GCP and AWS. 185+ PRs to infra-base-services. Created reusable Terraform modules for RDS Aurora, ElastiCache, EKS clusters.
- **Helm Charts Evolution**: Evolved from Kustomize overlays to Terraform modules to opinionated Helm charts for standardized EKS deployments. Authored 11 RFCs including "Why not use Terraform for Everything."
- **EKS Platform**: Multiple EKS upgrades (1.25 through 1.30), Karpenter adoption, Istio service mesh management. Exploring EKS Auto-Mode for reduced operational overhead.

## CI/CD & Developer Experience

- **flo-deploy**: Created deployment proxy GitHub Action from scratch (64+ PRs). Pull-based pipelines, simplified rollbacks, self-service deployments for all engineering teams.
- **CI/CD Migration**: Migrated from GCP Cloud Build to GitHub Actions. Built shared workflows, runner health monitoring, and preview environments.
- **Service Playbooks & Standards**: Authored comprehensive onboarding docs, conducted weekly SRE roadshows auditing each platform's observability. Built gold standard examples for SST and Kubernetes deployments.

## Cost Optimization & Security

- **FinOps & Cost Management**: $200K+/yr S3 VOD savings. Datadog cost optimization targeting 40-60% savings. Established resource tagging standards and FinOps framework.
- **Security Incident Response**: Led GitHub token exposure remediation (367 repos affected), botnet attack response, SQLi attack investigation, WAF hardening.

## Reliability & Event Stability

- **Major Event Preparation**: ADCC 2024, Wrestling Big Weekend, FloCollege Launch, Next Gen Wrestling (99.95% uptime target with 500k redirected users doubling traffic volume).
- **Resilience Engineering**: Implemented chaos testing framework with deploy gates, SLOs for key user journeys, graceful degradation patterns. Authored 40+ incident investigations with systematic root-cause analysis.
