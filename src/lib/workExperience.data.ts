import type { WE } from './WorkExperience.model';

export const workExperiences: WE[] = [
	{
		meta: {
			title: 'Tech Lead Manager',
			company: 'FloSports',
			image: 'https://www.flosports.tv/wp-content/uploads/2020/04/Hawk-ignite.png',
			url: 'https://www.flosports.tv',
			date: {
				start: 'November 2019',
				end: 'Present'
			}
		},
		body: [
			{
				title: 'Kubernetes Infrastructure Migration',
				description:
					'Led the migration of FloSports infrastructure to Kubernetes using Infrastructure as Code (IaC) with Terraform. Built comprehensive business case, scoped requirements, and implemented full CI/CD pipeline for cross-cloud deployment. Enabled ephemeral preview environments for rapid infrastructure testing and validation.'
			},
			{
				title: 'Load Testing Platform',
				description:
					'Architected and built a comprehensive load testing ecosystem using K6, GoReplay, and Kubernetes. Created containerized distributed load tests with ExpressJS backend, Node.js Kubernetes jobs, and RemixJS frontend. Enabled gameday validation and performance testing at scale.'
			},
			{
				title: 'Traffic Replay System',
				description:
					'Developed sophisticated traffic replay system using Istio, PubSub, BigQuery, GCS, and GoReplay. Captured and replayed production traffic against test environments with timestamp-based replay capabilities. Built Node.js job runner with advanced business logic for request replay and test data handling.'
			},
			{
				title: 'Flo Deploy CLI',
				description:
					'Created streamlined deployment CLI using Node.js and Yargs, shipped as Google Cloud Build Builder. Leveraged Kustomize and custom templating system to enable one-command application deployments with standardized configuration management.'
			},
			{
				title: 'Observability Platform Migration',
				description:
					'Spearheaded migration to Datadog unified observability platform from fragmented stack (NewRelic APM, SignalFX Metrics, ELK Logs). Significantly improved developer productivity through consolidated monitoring, alerting, and debugging capabilities.'
			}
		]
	},
	{
		meta: {
			title: 'Big Data Platform Engineer',
			company: 'General Motors',
			image:
				'https://media.gm.com/dld/content/dam/Shared/Images/Logos/gm/GM_Gradient_Brandmark_RGB-2021.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg',
			url: 'https://www.gm.com',
			date: {
				start: 'May 2017',
				end: 'November 2019'
			}
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
