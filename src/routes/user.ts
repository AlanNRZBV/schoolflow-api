import { Router } from 'express';
import { getUserSchools } from '@/controllers/school.controller';
import { validateUserPasswords } from '@/validations/users';
import { setUserPassword } from '@/controllers/auth.controller';

const router = Router();

router.get('/:userId/schools', getUserSchools);
router.patch('/:userId/set-password', validateUserPasswords, setUserPassword);

export default router;
