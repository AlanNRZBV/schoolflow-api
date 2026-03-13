import { Model, Schema } from 'mongoose';

export type ScheduleType = {
	schoolId: Schema.Types.ObjectId;
	subjectId: Schema.Types.ObjectId;
	lessonNumber: number;
	teacherId: Schema.Types.ObjectId;
	lessonType: 'lecture' | 'practical' | 'lab';
	date: Date;
};
export type ScheduleModel = Model<ScheduleType>;

export type CreateScheduleDto = Omit<ScheduleType, 'schoolId'>;
