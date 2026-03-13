import { CreatePersonnelDto } from '@/lib/guards/personnel.guard';
import { CreateTeacherDto } from '@/models/user/teacher/teacher.types';
import { CreateManagerDto } from '@/models/user/manager/manager.types';

export const isTeacher = (arg: CreatePersonnelDto): arg is CreateTeacherDto =>
	arg.role === 'teacher';
export const isManager = (arg: CreatePersonnelDto): arg is CreateManagerDto =>
	arg.role === 'manager';
