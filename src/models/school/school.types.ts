import { Model, Schema } from 'mongoose';
import { GroupType } from '@/models/group/group.types';

export type SchoolType = {
	name: string;
	city: string;
	admin: Schema.Types.ObjectId;
	status: 'inactive' | 'active' | 'draft';
	students: {
		student: Schema.Types.ObjectId;
	}[];
	subjects: {
		default: Schema.Types.ObjectId[];
		custom: { title: string };
	};
	personnel: Schema.Types.ObjectId[];
	groups: GroupType[];
};

export type SchoolModel = Model<SchoolType>;
