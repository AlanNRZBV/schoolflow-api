import { Model } from 'mongoose';

export type SubjectType = {
	title: string;
	isDefault: boolean;
};

export type SubjectModel = Model<SubjectType>;
