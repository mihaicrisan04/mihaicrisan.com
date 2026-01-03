export interface WorkExperience {
	id: string;
	company: string;
	companyUrl?: string | null;
	position: string;
	startDate: string;
	endDate: string | null;
	description: string;
	current: boolean;
}
