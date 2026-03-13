import { PositionKey, PositionRole, UserProfileStatus } from '@/types/types';
import { Model, Schema, Types } from 'mongoose';

export type PersonnelAssignmentType = {
	userId: Schema.Types.ObjectId;
	schoolId: Schema.Types.ObjectId;
	position: PositionKey;
	positionTags: PositionKey[];
	positionRole: PositionRole;
	subjects: Schema.Types.ObjectId[];
	substitutedSubjects: Schema.Types.ObjectId[] | null;
	substitutedSupervisedGroups: Schema.Types.ObjectId[] | null;
	supervisedGroups: Schema.Types.ObjectId[] | null;
	status: UserProfileStatus;
	startDate: Date;
	endDate: Date | null;
};

export type PersonnelAssignmentModel = Model<PersonnelAssignmentType>;

export type CreateAssignmentDto = {
	userId?: Types.ObjectId;
	position: PositionKey;
	positionTags: PositionKey[];
	positionRole?: PositionRole;
	subjects: Schema.Types.ObjectId[];
};
