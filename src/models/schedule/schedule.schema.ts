import { Schema } from 'mongoose';
import { ScheduleModel, ScheduleType } from '@/models/schedule/schedule.types';
import { PersonnelAssignment } from '@/models/personnel-assignment';
import { School } from '@/models/school';
import { Subject } from '@/models/subject';

export const scheduleSchema = new Schema<ScheduleType, ScheduleModel>({
	schoolId: {
		type: Schema.Types.ObjectId,
		ref: 'School',
		validate: {
			validator: async (value: Schema.Types.ObjectId) => {
				const school = await School.findById(value);
				return Boolean(school);
			},
		},
	},
	teacherId: {
		type: Schema.Types.ObjectId,
		ref: 'PersonnelAssignment',
		validate: {
			validator: async (value: Schema.Types.ObjectId | undefined) => {
				if (!value) return true;
				const teacher = await PersonnelAssignment.findById(value);
				return Boolean(teacher);
			},
		},
	},
	lessonType: {
		type: String,
		default: 'lecture',
	},
	lessonNumber: { type: Number, default: 1 },
	subjectId: {
		type: Schema.Types.ObjectId,
		ref: 'Subject',
		validate: {
			validator: async (value: Schema.Types.ObjectId) => {
				const subject = await Subject.findById(value);
				return Boolean(subject);
			},
		},
	},
	date: {
		type: Date,
		required: true,
	},
});

scheduleSchema.pre('save', async function () {
	if (this.teacherId && this.schoolId) {
		const school = await School.findById(this.schoolId);

		if (!school) {
			return new Error('Школа не найдена');
		}

		const isTeacherAssignedToSchool = school.personnel?.some(
			(personnelId) => personnelId.toString() === this.teacherId.toString(),
		);

		if (!isTeacherAssignedToSchool) {
			return new Error('Неверные данные учителя');
		}
	}
});
