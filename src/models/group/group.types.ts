import { Model, Schema } from 'mongoose';

export type GroupType = {
	number: string;
	letter: string;
	students: Schema.Types.ObjectId[];
	supervisor: Schema.Types.ObjectId;
};

export type GroupModel = Model<GroupType>;
