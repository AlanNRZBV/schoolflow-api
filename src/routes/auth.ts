import { Router } from 'express';
import {
	activateUser,
	getMe,
	logInUser,
	logOutUser,
	registerAdmin,
} from '@/controllers/auth.controller';
import { validateAdminBody } from '@/middleware/users';
import authMiddleware from '@/middleware/auth';

const router = Router();

router.post('/sign-up', validateAdminBody, registerAdmin);
router.post('/sign-in', logInUser);
router.post('/sign-out', logOutUser);
router.post('/activate', activateUser);
router.get('/me',authMiddleware, getMe);

export default router;
