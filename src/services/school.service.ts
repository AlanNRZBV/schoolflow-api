import mongoose, {
	ClientSession,
	Error as MongooseError,
	Types,
} from 'mongoose';
import { School } from '@/models/school';
import { getDefaultSubjects } from '@/services/subject.service';
import { transformMongooseError } from '@/lib/utils/transform-mongoose-error';
import BadRequestError from '@/errors/bad-request-error';

export const createDefaultSchool = async (
	arg: mongoose.Types.ObjectId,
	session: ClientSession,
) => {
	const defaultSubjects = await getDefaultSubjects();
	const defaultIds = defaultSubjects.map((item) => item._id);
	return School.findOneAndUpdate(
		{ owner: arg },
		{
			$setOnInsert: {
				name: 'Новая школа',
				status: 'draft',
				subjects: { default: defaultIds, custom: [] },
			},
		},
		{ returnDocument: 'after', upsert: true, session },
	);
};

export const getAllSchoolsByUserId = async (userId: string) => {
	try {
		return School.find({ owner: userId }).populate(
			'subjects.default',
			'title _id',
		);
	} catch (e) {
		if (e instanceof MongooseError.ValidationError) {
			const errors = transformMongooseError(e);
			throw new BadRequestError(errors[0].message);
		}
		throw e;
	}
};

export const linkAssignmentToSchool = async (
	assignmentId: Types.ObjectId,
	schoolId: string,
	session: ClientSession,
) => {
	return School.findOneAndUpdate(
		{ _id: schoolId },
		{ $addToSet: { personnel: assignmentId } },
		{ returnDocument: 'after', session },
	);
};
