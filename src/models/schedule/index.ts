import { scheduleSchema } from '@/models/schedule/schedule.schema';
import { model } from 'mongoose';

export const Schedule = model('Schedule', scheduleSchema);
