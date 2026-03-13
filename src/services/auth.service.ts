import { User } from '@/models/user';
import mongoose, { Error as MongooseError } from 'mongoose';
import BadRequestError from '@/errors/bad-request-error';
import { transformMongooseError } from '@/lib/utils/transform-mongoose-error';
import ConflictError from '@/errors/conflict-error';
import { AdminDto } from '@/models/user/base/user.base.types';
import { School } from '@/models/school';

export const createAdmin = async (arg: AdminDto) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	const { schoolId, ...rest } = arg;

	try {
		const admin = await new User({
			...rest,
			role: 'admin',
			status: 'active',
			activationExp: null,
		}).save({
			session,
		});

		await School.findOneAndUpdate(
			{ _id: schoolId },
			{ admin: admin._id },
			{ returnDocument: 'after', session },
		);
		const token = admin.generateAuthToken();
		await session.commitTransaction();
		return token;
	} catch (e) {
		await session.abortTransaction();
		if (e instanceof MongooseError.ValidationError) {
			const errors = transformMongooseError(e);
			throw new BadRequestError(errors[0].message);
		}
		if ((e as Error).message.startsWith('E11000')) {
			throw new ConflictError('Пользователь с такой почтой уже существует');
		}
		throw e;
	} finally {
		await session.endSession();
	}
};
