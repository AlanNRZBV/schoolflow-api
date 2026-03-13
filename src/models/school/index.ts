import { SchoolModel, SchoolType } from '@/models/school/school.types';
import { model } from 'mongoose';
import { schoolSchema } from '@/models/school/school.schema';

export const School = model<SchoolType, SchoolModel>('School', schoolSchema);
