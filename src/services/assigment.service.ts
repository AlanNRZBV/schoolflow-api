import BadRequestError from '@/errors/bad-request-error';
import mongoose, { ClientSession, HydratedDocument, Types } from 'mongoose';
import {
	CreateAssignmentDto,
	PersonnelAssignmentType,
} from '@/models/personnel-assignment/personnel-assigments.types';
import {
	isNonTeacherDto,
	isTeacherDto,
	isTeacherManagerDto,
} from '@/lib/guards/personnel.guard';
import { PersonnelAssignment } from '@/models/personnel-assignment';
import {
	sendWelcomeEmailToExistingUser,
	sendWelcomeEmailToNewUser,
} from '@/services/send.service';
import { linkAssignmentToSchool } from '@/services/school.service';
import { UserMethods, UserType } from '@/models/user/base/user.base.types';

export const createAssignment = async (
	userId: Types.ObjectId,
	schoolId: string,
	assignmentData: CreateAssignmentDto,
	session: ClientSession,
): Promise<HydratedDocument<PersonnelAssignmentType>> => {
	const { subjects, positionRole, position, positionTags } = assignmentData;

	let newAssignment;

	if (isTeacherDto(assignmentData)) {
		newAssignment = new PersonnelAssignment({
			userId,
			schoolId,
			position,
			positionTags,
			subjects,
		}).save({ session });
	}

	if (isNonTeacherDto(assignmentData)) {
		newAssignment = new PersonnelAssignment({
			userId,
			schoolId,
			position,
			positionTags,
			positionRole,
		}).save({ session });
	}

	if (isTeacherManagerDto(assignmentData)) {
		newAssignment = new PersonnelAssignment({
			userId,
			schoolId,
			position,
			positionTags,
			positionRole,
			subjects,
		}).save({ session });
	}

	if (!newAssignment) {
		throw new BadRequestError('Невозможно определить тип назначения');
	}
	return newAssignment;
};

export const assignExistingUserToSchool = async (
	user: HydratedDocument<UserType, UserMethods>,
	schoolId: string,
	assignmentData: CreateAssignmentDto,
) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	const { _id } = user;

	try {
		const newAssignment = await createAssignment(
			_id,
			schoolId,
			assignmentData,
			session,
		);

		if (!newAssignment) {
			throw new Error('Назначение не было создано');
		}

		const updatedSchool = await linkAssignmentToSchool(
			newAssignment._id,
			schoolId,
			session,
		);

		if (!updatedSchool) {
			throw new Error('Назначение не было связано со школой');
		}
		await session.commitTransaction();
		await sendWelcomeEmailToExistingUser(user, updatedSchool.name);
	} catch (e) {
		await session.abortTransaction();
	} finally {
		await session.commitTransaction();
	}
};
