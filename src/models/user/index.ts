import { UserType, UserModel } from '@/models/user/base/user.base.types';
import { model } from 'mongoose';
import { userSchema } from '@/models/user/base/user.base.schema';
import { studentSchema } from '@/models/user/student/student.schema';
import { StudentModel } from '@/models/user/student/students.types';

export const User = model<UserType, UserModel>('User', userSchema);

export const Student = User.discriminator<StudentModel>(
	'student',
	studentSchema,
);
