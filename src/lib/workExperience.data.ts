import type { WE } from './WorkExperience.model'
export const workExperiences: WE[] = [
	{
		meta: {
			title: 'Infrastructure Engineer',
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
				title: 'Load Testing Platform',
				description:
					'Built a load testing ecosystem using K6, GoReplay, and Kubernetes to run containerized distributed load tests against our systems to allow for gameday validation. This was built with ExpressJS, a Node Kubernetes Job, and a RemixJS frontend.'
			},
			{
				title: 'Traffic Replay',
				description:
					'This is a subcomponent of the load testing platform which uses Istio, PubSub, Big Query, GCS and GoReplay to re run captured traffic against our kubernetes clusters. We can capture all of our uncached (impactful) traffic and replay it agains the environment at a later date based on the timestamp. A nice added feature to this was the ability to perform writes (POST api calls) test data. I specifically built the replay mechanism for this with a NodeJS Job which leveraged GoReplay and has the business logic for re-running requests.'
			},
			{
				title: 'Flo Deploy',
				description:
					'A NodeJS Yargs CLI application which is shpped as a Google Cloud Build Builer and runs as a build step. This leverages Kustomize and a templating system to give easy out of the box deployments of applications with one command.'
			},
			{
				title: 'Datadog',
				description:
					'Implemented datadog stack for our cloud stack and migrated the team from NewRelic APM, SignalFX Metrics, and ELK Logs to a single unified platform to inrease our deveoper productivity.'
			}
		]
	},
	{
		meta: {
			title: 'Big Data (Haddop) Platform Engineer',
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
					'A simple, cron based, utility written in Go which would manage Queue schedules for the Yarn Resource Managers in our Clusters'
			},
			{
				title: 'Ranger/Atlas',
				description:
					'Lead initiative to implement the Ranger and Atlas services into our Haoop Clusters. These allowee for us to implement RBAC into the Hadoop ecosystem at GM and gave tools to other teams to be able to manage users from common tools.'
			},
			{
				title: 'Hadoop Monitoring Stack',
				description:
					'With a collegue we built out a monitoring ecosystems for our clusters which had no visible metrics into a single unified platform. The frontend was a PHP/JS application built on top of Oracle and the backend was a python metrics collection system which leveraged Prometheus and Grafana for visualizations. This became the defacto way we looked at what was happening in our clusters.'
			}
		]
	},
	{
		meta: {
			title: 'Lab Technician',
			company: 'Lynntech',
			image:
				'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ap98zhetk0hi50n2ilgd',
			url: 'https://www.lynntech.com',
			date: {
				start: 'May 2016',
				end: 'May 2017'
			}
		},
		body: [
			{
				title: 'Iodine Detection Kit',
				description:
					'Continued a NIH funeded prototype of an iodine detection kit which would allow for cheap validation of water in regions with high rates of Hypothyroidism. The kit was built with a RaspberryPi, Ardruino and Colorimeter and had a QT interface built in Python.'
			},
			{
				title: 'Desalination Monitor',
				description:
					'Quick setup to validate a project to desalinated sea water to safe drinking standards. Was built with an Arduino, chips and sensors for pH and Salination to give visual feedback on the saftey of the water which came out of the desalination kit.'
			}
		]
	}
]
