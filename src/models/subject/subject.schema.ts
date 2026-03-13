import { Schema } from 'mongoose';
import {
	SubjectType as SubjectType,
	SubjectModel,
} from '@/models/subject/subject.types';

export const subjectSchema = new Schema<SubjectType, SubjectModel>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);
