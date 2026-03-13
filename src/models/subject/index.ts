import { model } from 'mongoose';
import { subjectSchema } from '@/models/subject/subject.schema';
import { SubjectModel, SubjectType } from '@/models/subject/subject.types';

export const Subject = model<SubjectType, SubjectModel>(
	'Subject',
	subjectSchema,
);
