import { Error, Schema } from 'mongoose';
import {
	UserType,
	UserMethods,
	UserModel,
} from '@/models/user/base/user.base.types';
import bcrypt from 'bcryptjs';
import * as process from 'node:process';
import jwt from 'jsonwebtoken';
import { NotFoundError } from '@/errors/not-found-error';
import { SALT_ROUNDS } from '@/lib/constants/salt-rounds';

export const userSchema = new Schema<UserType, UserModel, UserMethods>(
	{
		firstName: {
			type: String,
			required: [true, 'Введите имя'],
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, 'Введите фамилию'],
			trim: true,
		},
		middleName: {
			type: String,
			required: [true, 'Введите отчество'],
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Введите пароль'],
			select: false,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: {
				validator: function (email: string) {
					const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
					return re.test(email);
				},
				message: 'Please fill a valid email',
			},
		},
		profilePicture: {
			type: String,
			default: null,
		},
		role: {
			type: String,
		},
		status: {
			type: String,
			default: 'pending',
		},
		activationExp: {
			type: Date,
			default: () => Date.now() + 24 * 60 * 60 * 1000,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'role',
		collection: 'users',
		toJSON: {
			transform: (_doc, ret: Partial<UserType>) => {
				delete ret.password;
				return ret;
			},
		},
	},
);

userSchema.pre('save', async function () {
	try {
		if (this.isModified('password')) {
			const salt = await bcrypt.genSalt(SALT_ROUNDS);
			this.password = await bcrypt.hash(this.password, salt);
		}
	} catch (e) {
		throw e as Error;
	}
});

userSchema.pre('findOneAndUpdate', async function () {
	try {
		const update = this.getUpdate();
		if (update && 'password' in update && update.password) {
			const salt = await bcrypt.genSalt(SALT_ROUNDS);
			update.password = await bcrypt.hash(update.password, salt);
		}
	} catch (e) {
		throw e as Error;
	}
});

userSchema.statics.findByCredentials = async function (
	email: string,
	password: string,
) {
	const user = await this.findOne({ email })
		.select('+password')
		.orFail(() => new NotFoundError('Пользователь не найден'));
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new NotFoundError('Пользователь не найден');
	}
	return user;
};
userSchema.methods.generateAuthToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
		expiresIn: '1d',
	});
};
userSchema.methods.generateTempToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
		expiresIn: '5minutes',
	});
};
