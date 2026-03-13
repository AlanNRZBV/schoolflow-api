import { CreateScheduleDto } from '@/models/schedule/schedule.types';
import { Schedule } from '@/models/schedule';

export const createSchedule = async (
	dto: CreateScheduleDto,
	schoolId: string,
) => {
	const newSchedule = await new Schedule({ ...dto, schoolId }).save();
	if (!newSchedule) throw new Error('Не удалось добавить урок');
	return newSchedule;
};
