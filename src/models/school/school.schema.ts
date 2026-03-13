import { SchoolModel, SchoolType } from '@/models/school/school.types';
import { Schema } from 'mongoose';
import { User } from '@/models/user';
import { NotFoundError } from '@/errors/not-found-error';
import { PersonnelAssignment } from '@/models/personnel-assignment';
import { groupSchema } from '@/models/group/group.schema';

export const schoolSchema = new Schema<SchoolType, SchoolModel>(
	{
		name: {
			type: String,
			required: true,
			unique: [true, 'Название школы должно быть уникальным'],
			trim: true,
		},
		city: { type: String, required: true },
		admin: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		status: { type: String, required: true, default: 'draft' },
		students: [
			{
				student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
				parent: { type: Schema.Types.ObjectId, ref: 'User' },
			},
		],
		subjects: {
			default: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Subject',
				},
			],
			custom: [
				{
					title: { type: String, required: true },
				},
			],
		},
		groups: [groupSchema],
		personnel: [
			{
				type: Schema.Types.ObjectId,
				ref: 'PersonnelAssignment',
				validate: {
					validator: async (value: Schema.Types.ObjectId) => {
						const personnelAssignment =
							await PersonnelAssignment.findById(value);
						return Boolean(personnelAssignment);
					},
				},
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

schoolSchema.pre('validate', async function () {
	if (this.admin) {
		const session = this.$session();
		const query = User.findById(this.admin);
		if (session) {
			query.session(session);
		}
		const user = await query.exec();
		if (!user) {
			throw new NotFoundError('Владелец организации не найден');
		}
	}
});
