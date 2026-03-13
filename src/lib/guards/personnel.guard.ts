import { CreateAssignmentDto } from '@/models/personnel-assignment/personnel-assigments.types';
import { PositionKey, PositionRole } from '@/types/types';
import { Types } from 'mongoose';
import { CreateUserDto } from '@/models/user/base/user.base.types';

export type CreatePersonnelDto = {
	userData?: CreateUserDto;
	assignmentData: CreateAssignmentDto;
};

export const isTeacherDto = (
	dto: CreateAssignmentDto,
): dto is CreateAssignmentDto & {
	subjects: Types.ObjectId[];
	positionTags: PositionKey[];
} => dto.position === 'teacher';

export const isNonTeacherDto = (
	dto: CreateAssignmentDto,
): dto is CreateAssignmentDto & { subjects?: never } =>
	dto.position !== 'teacher';

export const isTeacherManagerDto = (
	dto: CreateAssignmentDto,
): dto is CreateAssignmentDto & {
	positionRole: PositionRole;
} =>
	dto.position === 'teacher' &&
	'positionTags' in dto &&
	dto.positionTags !== undefined &&
	dto.positionTags.length > 1;
