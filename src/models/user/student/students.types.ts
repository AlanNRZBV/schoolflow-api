import { UserType, UserExtension } from '@/models/user/base/user.base.types';
import { Model, Schema } from 'mongoose';

export type Student = UserType &
	UserExtension & {
		parents: Schema.Types.ObjectId[];
		grades: [];
		group: Schema.Types.ObjectId;
	};

export type StudentModel = Model<Student>;
