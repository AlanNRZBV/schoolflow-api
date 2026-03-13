import { personnelAssignmentSchema } from '@/models/personnel-assignment/personnel-assigments.schema';
import { model } from 'mongoose';
import {
	PersonnelAssignmentType,
	PersonnelAssignmentModel,
} from '@/models/personnel-assignment/personnel-assigments.types';

export const PersonnelAssignment = model<
	PersonnelAssignmentType,
	PersonnelAssignmentModel
>('PersonnelAssignment', personnelAssignmentSchema);
