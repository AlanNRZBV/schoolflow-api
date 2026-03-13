import { Schema } from 'mongoose';
import { User } from '@/models/user';
import { GroupModel, GroupType } from '@/models/group/group.types';

export const groupSchema = new Schema<GroupType, GroupModel>({
	letter: {
		type: String,
		required: [true, 'Введите букву класса'],
	},
	number: {
		type: String,
		min: [1, 'Минимальное значение - 1'],
		max: [12, 'Максимальное значение - 12'],
		required: [true, 'Введите цифру класса'],
	},
	supervisor: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		default: null,
		validate: {
			validator: async (value: Schema.Types.ObjectId | undefined) => {
				if (!value) return true;
				const user = await User.findById(value);
				return Boolean(user);
			},
			message: 'Пользователь не найден',
		},
	},
	students: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
			validate: {
				validator: async (value: Schema.Types.ObjectId | undefined) => {
					if (!value) return true;
					const course = await User.findById(value);
					return Boolean(course);
				},
				message: 'Пользователь не найден',
			},
		},
	],
});
