import { Router } from 'express';
import { getUserSchools } from '@/controllers/school.controller';
import { setUserPassword } from '@/controllers/auth.controller';
import { validateUserPasswords } from '@/middleware/users';

const router = Router();

router.get('/:userId/schools', getUserSchools);
router.patch('/:userId/set-password', validateUserPasswords, setUserPassword);

export default router;
