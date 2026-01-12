import type { WE } from './WorkExperience.model';

export const workExperiences: WE[] = [
	{
		meta: {
			id: 'flosports',
			title: 'Tech Lead, SRE',
			company: 'FloSports',
			image: 'https://www.flosports.tv/wp-content/uploads/2020/04/Hawk-ignite.png',
			url: 'https://www.flosports.tv',
			date: {
				start: 'November 2019',
				end: 'Present'
			},
			promotions: [
				{ title: 'Infrastructure Engineer', date: '2019' },
				{ title: 'Senior Infrastructure Engineer', date: '2021' },
				{ title: 'Tech Lead, SRE', date: '2023' }
			]
		},
		body: [
			{
				title: 'Kubernetes Infrastructure Migration',
				description:
					'Led the migration of FloSports infrastructure to Kubernetes using Infrastructure as Code (IaC) with Terraform. Built comprehensive business case, scoped requirements, and implemented full CI/CD pipeline for cross-cloud deployment. Enabled ephemeral preview environments for rapid infrastructure testing and validation.'
			},
			{
				title: 'Cloud Consolidation & Service Migration',
				description:
					'Led multi-phase GCP to AWS migration for the entire platform in partnership with AWS MAP program. Migrated core monolith and 30+ services to EKS using DMS with zero downtime.'
			},
			{
				title: 'Load Testing & Traffic Engineering',
				description:
					'Architected distributed load testing platform on Kubernetes using K6 and GoReplay. Built traffic replay system using Istio, PubSub, and BigQuery for production traffic capture and replay. Validated readiness for major streaming events including ADCC and Wrestling Big Weekend. Currently building v2 leveraging the K6 Operator with a dedicated UI.'
			},
			{
				title: 'Observability & Reliability',
				description:
					'Established uptime baseline and SLOs across all FloSports platforms. Migrated to Datadog unified observability from fragmented stack (NewRelic, SignalFX, ELK). Built Datadog Scorecards for customer-impacting services.'
			},
			{
				title: 'SRE Team Transformation',
				description:
					'Led transformation of Infrastructure Engineering team to Site Reliability Engineering, adopting principles from the Google SRE book. Established a code-first, developer productivity focused team with emphasis on stability and performance.'
			}
		]
	},
	{
		meta: {
			id: 'gm',
			title: 'Big Data Platform Engineer',
			company: 'General Motors',
			image:
				'https://media.gm.com/dld/content/dam/Shared/Images/Logos/gm/GM_Gradient_Brandmark_RGB-2021.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg',
			url: 'https://www.gm.com',
			date: {
				start: 'May 2017',
				end: 'November 2019'
			},
			promotions: [
				{ title: 'L5 Big Data Platform Engineer', date: '2017' },
				{ title: 'L6 Big Data Platform Engineer', date: '2019' }
			]
		},
		body: [
			{
				title: 'Yarn Queue Manager',
				description:
					'Developed Go-based utility for automated Yarn Resource Manager queue scheduling. Implemented cron-based scheduling system to optimize cluster resource allocation and improve job execution efficiency across Hadoop clusters.'
			},
			{
				title: 'Security & Governance Implementation',
				description:
					'Led enterprise-wide initiative to implement Apache Ranger and Atlas services across Hadoop clusters. Established Role-Based Access Control (RBAC) framework and provided teams with self-service user management tools, significantly improving security posture and compliance.'
			},
			{
				title: 'Hadoop Monitoring Stack',
				description:
					'Collaborated to build comprehensive monitoring ecosystem for previously invisible cluster metrics. Developed PHP/JavaScript frontend with Oracle backend and Python metrics collection system using Prometheus and Grafana. Became the standard platform for cluster observability and performance analysis.'
			}
		]
	},
	{
		meta: {
			id: 'lynntech',
			title: 'Lab Technician',
			company: 'Lynntech',
			image: 'https://www.lynntech.com/wp-content/uploads/2016/04/HeaderLogo_Tiny.png',
			url: 'https://www.lynntech.com',
			date: {
				start: 'April 2016',
				end: 'May 2017'
			}
		},
		body: [
			{
				title: 'Iodine Detection Kit',
				description:
					'Developed NIH-funded prototype for affordable water iodine detection in regions with high hypothyroidism rates. Built IoT solution using Raspberry Pi, Arduino, and colorimeter with Python-based Qt interface for field deployment and real-time analysis.'
			},
			{
				title: 'Desalination Monitor',
				description:
					'Created Arduino-based monitoring system for seawater desalination validation. Implemented pH and salinity sensors with visual feedback interface to ensure water safety standards, enabling rapid quality assessment of desalinated water output.'
			}
		]
	}
];
