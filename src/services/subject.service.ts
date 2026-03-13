import { Subject } from '@/models/subject';

export const getDefaultSubjects = async () => {
	return Subject.find({ isDefault: true }).select('_id title');
};
