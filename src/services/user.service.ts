import { User } from '@/models/user';
import mongoose from 'mongoose';
import { generateOTP } from '@/lib/utils/generate-otp';
import { CreatePersonnelDto } from '@/lib/guards/personnel.guard';
import { NotFoundError } from '@/errors/not-found-error';
import { SuspendedError } from '@/errors/suspended-error';
import BadRequestError from '@/errors/bad-request-error';
import { createAssignment } from '@/services/assigment.service';
import { linkAssignmentToSchool } from '@/services/school.service';
import { sendWelcomeEmailToNewUser } from '@/services/send.service';

export const checkUserAndGenerateToken = async (
	email: string,
	password: string,
) => {
	const user = await User.findByCredentials(email, password);
	return user.generateAuthToken();
};

export const checkUserAndGenerateTempToken = async (
	email: string,
	password: string,
) => {
	const user = await User.findByCredentials(email, password);
	if (!user) {
		throw new NotFoundError('Неверные данные');
	}
	if (user.activationExp && user.activationExp < new Date()) {
		user.status = 'suspended';
		await user.save();
		throw new SuspendedError('Учетная запись заблокирована');
	}
	return { tempToken: user.generateTempToken(), userId: user._id };
};

export const setPasswordAndActivate = async (
	userId: string,
	password: string,
) => {
	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{
			$set: {
				password: password,
				status: 'active',
				activationExp: null,
			},
		},
		{ returnDocument: 'after' },
	);
	if (!updatedUser) {
		throw new NotFoundError('Пользователь не найден');
	}
	if (updatedUser.status !== 'active') {
		throw new BadRequestError('Ошибка активации');
	}

	return updatedUser;
};

export const createUserAndAssign = async (
	dto: CreatePersonnelDto,
	schoolId: string,
) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	const { userData, assignmentData } = dto;

	if (!userData) {
		throw new BadRequestError('Данные пользователя отсутствуют');
	}
	const { email, firstName, lastName, middleName, role } = userData;

	const otp = generateOTP();

	try {
		const newUser = await new User({
			email,
			firstName,
			lastName,
			middleName,
			role,
			password: otp,
			status: 'pending',
		}).save({ session });

		if (!newUser) {
			throw new Error('Пользователь не был создан');
		}

		const newAssignment = await createAssignment(
			newUser._id,
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
		await sendWelcomeEmailToNewUser(
			newUser,
			newAssignment,
			otp,
			updatedSchool.name,
		);
	} catch (e) {
		await session.abortTransaction();
		throw e;
	} finally {
		await session.endSession();
	}
};
