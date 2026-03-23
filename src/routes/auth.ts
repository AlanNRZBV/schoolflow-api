import { Router } from 'express';
import {
	activateUser,
	logInUser,
	logOutUser,
	registerAdmin,
} from '@/controllers/auth.controller';
import { validateAdminBody } from '@/middleware/users';

const router = Router();

router.post('/sign-up', validateAdminBody, registerAdmin);
router.post('/sign-in', logInUser);
router.post('/sign-out', logOutUser);
router.post('/activate', activateUser);

export default router;
