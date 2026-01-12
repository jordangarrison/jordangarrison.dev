export type WE = {
	meta: WEMeta;
	body: WEBody[];
};

export type WEPromotion = {
	title: string;
	date: string;
};

export type WEMeta = {
	id: string;
	title: string;
	company: string;
	image: string;
	url: string;
	date: WEDate;
	promotions?: WEPromotion[];
};

export type WEBody = {
	title: string;
	description: string;
};

export type WEDate = {
	start: string;
	end: string;
};
