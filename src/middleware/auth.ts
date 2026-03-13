import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import NotAuthorizedError from '@/errors/not-authorized-error';

export default (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.accessToken;

	if (!token) {
		next(new NotAuthorizedError('Ошибка авторизации'));
		return;
	}

	const jwtSecret = process.env.JWT_SECRET as string;

	try {
		const payload = jwt.verify(token, jwtSecret) as { id: string };
		res.locals.userId = payload.id;
		next();
	} catch (e) {
		next();
	}
};
