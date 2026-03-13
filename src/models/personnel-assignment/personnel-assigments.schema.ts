import { HydratedDocument, Schema } from 'mongoose';
import {
	PersonnelAssignmentType,
	PersonnelAssignmentModel,
} from '@/models/personnel-assignment/personnel-assigments.types';
import { User } from '@/models/user';
import { School } from '@/models/school';
import { Subject } from '@/models/subject';

export const personnelAssignmentSchema = new Schema<
	PersonnelAssignmentType,
	PersonnelAssignmentModel
>({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
		validate: {
			validator: async function (
				this: HydratedDocument<PersonnelAssignmentType>,
				value: Schema.Types.ObjectId,
			) {
				const session = this.$session();
				const query = User.findById(value);
				if (session) {
					query.session(session);
				}
				const user = await query.exec();
				return Boolean(user);
			},
			message: 'Пользователь не найден',
		},
	},
	schoolId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'School',
		validate: {
			validator: async (value: Schema.Types.ObjectId) => {
				const school = await School.findById(value);
				return Boolean(school);
			},
		},
	},
	position: {
		type: String,
		required: true,
	},
	positionTags: {
		type: [String],
		required: true,
	},
	positionRole: {
		type: String,
		default: null,
	},
	subjects: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Subject',
			validate: {
				validator: async (value: Schema.Types.ObjectId) => {
					const subject = await Subject.findById(value);
					return Boolean(subject);
				},
			},
		},
	],
	substitutedSubjects: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Subject',
			validate: {
				validator: async (value: Schema.Types.ObjectId) => {
					const subject = await Subject.findById(value);
					return Boolean(subject);
				},
			},
		},
	],
	supervisedGroups: [
		{
			type: String,
		},
	],
	status: {
		type: String,
		default: 'pending',
	},
	startDate: {
		type: Date,
		default: () => new Date(),
		immutable: true,
	},
	endDate: {
		type: Date,
	},
});
