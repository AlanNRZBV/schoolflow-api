import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@/errors/custom-error';

export const errorHandler = async (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json(err.serializeErrors());
	}
	res.status(500).json({ message: 'Internal server error :(' });
};
