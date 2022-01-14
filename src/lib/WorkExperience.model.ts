export type WE = {
	meta: WEMeta
	body: WEBody[]
}

export type WEMeta = {
	title: string
	company: string
	image: string
	url: string
	date: WEDate
}

export type WEBody = {
	title: string
	description: string
}

export type WEDate = {
	start: string
	end: string
}
