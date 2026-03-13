import { NextFunction, Request, Response } from 'express';
import { createAdmin } from '@/services/auth.service';
import { AdminDto } from '@/models/user/base/user.base.types';
import { TIME_INTERVALS } from '@/lib/constants/time-intervals';
import {
	checkUserAndGenerateTempToken,
	checkUserAndGenerateToken,
	setPasswordAndActivate,
} from '@/services/user.service';

const isProd = process.env.NODE_ENV === 'prod';

export const registerAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const dto: AdminDto = req.body;
		const token = await createAdmin(dto);
		res
			.status(201)
			.cookie('accessToken', token, {
				httpOnly: true,
				secure: isProd,
				maxAge: TIME_INTERVALS.DAY,
			})
			.json({ message: 'Пользователь создан' });
	} catch (e) {
		next(e);
	}
};

export const logInUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = req.body;
		const token = await checkUserAndGenerateToken(email, password);
		res
			.status(200)
			.cookie('accessToken', token, {
				httpOnly: true,
				secure: isProd,
				maxAge: TIME_INTERVALS.DAY,
			})
			.json({ message: 'Добро пожаловать' });
	} catch (e) {
		next(e);
	}
};

export const logOutUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		res
			.clearCookie('accessToken', {
				httpOnly: true,
			})
			.json({ message: 'До встречи!' });
	} catch (e) {
		next(e);
	}
};

export const activateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password }: { email: string; password: string } = req.body;
		const { tempToken, userId } = await checkUserAndGenerateTempToken(
			email,
			password,
		);
		res
			.status(200)
			.cookie('accessToken', tempToken, {
				httpOnly: true,
				secure: isProd,
				maxAge: TIME_INTERVALS.FIVE_MINUTES,
			})
			.json({
				message: 'Для завершения активации введите новый пароль',
				userId: userId,
			});
	} catch (e) {
		next(e);
	}
};

export const setUserPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { password } = req.body;
		const userId = req.params.userId as string;
		const user = await setPasswordAndActivate(userId, password);
		res.status(200).json({
			message: 'Используйте новые данные для входа',
			user,
		});
	} catch (e) {
		next(e);
	}
};
