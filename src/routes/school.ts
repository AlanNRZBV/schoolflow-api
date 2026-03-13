import { Router } from 'express';
import {
	createAndAddPersonnel,
	createAndAddSchedule,
} from '@/controllers/school.controller';
import { validateCreateAssignmentDto } from '@/validations/users';

const router = Router();

router.post(
	'/:schoolId/personnel/add',
	validateCreateAssignmentDto,
	createAndAddPersonnel,
);
router.post('/:schoolId/schedule/add', createAndAddSchedule);

export default router;
