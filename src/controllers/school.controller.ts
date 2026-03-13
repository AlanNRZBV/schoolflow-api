import { NextFunction, Request, Response } from 'express';
import { getAllSchoolsByUserId } from '@/services/school.service';
import BadRequestError from '@/errors/bad-request-error';
import mongoose, { HydratedDocument, MongooseError } from 'mongoose';
import { CreatePersonnelDto } from '@/lib/guards/personnel.guard';
import { createUserAndAssign } from '@/services/user.service';
import { User } from '@/models/user';
import { School } from '@/models/school';
import { assignExistingUserToSchool } from '@/services/assigment.service';
import { UserMethods, UserType } from '@/models/user/base/user.base.types';
import { CreateScheduleDto } from '@/models/schedule/schedule.types';
import { createSchedule } from '@/services/schedule.service';

export const getUserSchools = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.params.userId as string;
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw new BadRequestError('Неверный id пользователя');
		}
		const schools = await getAllSchoolsByUserId(userId);
		if (schools.length > 0) {
			return res.status(200).json(schools);
		}
		res.status(404).json({ message: 'У пользователя нет школ' });
	} catch (e) {
		next(e);
	}
};

export const createAndAddPersonnel = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const dto: CreatePersonnelDto = req.body;
		const { assignmentData } = dto;
		const schoolId = req.params.schoolId as string;
		const isSchoolExist = await School.exists({ _id: schoolId });

		if (!isSchoolExist) {
			throw new BadRequestError('Неверные данные школы');
		}

		let user: HydratedDocument<UserType, UserMethods> | null;

		if (dto.userData?.email) {
			user = await User.findOne({ email: dto.userData.email });
		} else {
			if (!dto.assignmentData.userId) {
				throw new BadRequestError('Неверные данные запроса');
			}
			user = await User.findOne({ _id: dto.assignmentData.userId });
		}

		if (user) {
			await assignExistingUserToSchool(user, schoolId, assignmentData);
			return res.status(200).json({ message: 'Пользователь добавлен в штат' });
		} else {
			if (!dto.userData) {
				throw new BadRequestError('Данные пользователя отсутствуют');
			}
			await createUserAndAssign(dto, schoolId);
			return res
				.status(201)
				.json({ message: 'Пользователь создан и добавлен в штат' });
		}
	} catch (e) {
		next(e);
	}
};

export const createAndAddSchedule = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const schedule: CreateScheduleDto = req.body;
		const schoolId = req.params.schoolId as string;
		const isSchoolExist = await School.exists({ _id: schoolId });
		if (!isSchoolExist) {
			throw new BadRequestError('Неверные данные школы');
		}
		const newSchedule = await createSchedule(schedule, schoolId);
		return res
			.status(201)
			.json({ message: 'Урок был добавлен в расписание', newSchedule });
	} catch (e) {
		console.error(e);
		if (e instanceof MongooseError) {
			throw new BadRequestError(e.message);
		}
		next(e);
	}
};
