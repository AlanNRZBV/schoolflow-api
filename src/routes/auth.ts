import { Router } from 'express';
import { validateAdminBody } from '@/validations/users';
import {
	activateUser,
	logInUser,
	logOutUser,
	registerAdmin,
} from '@/controllers/auth.controller';

const router = Router();

router.post('/sign-up', validateAdminBody, registerAdmin);
router.post('/sign-in', logInUser);
router.post('/sign-out', logOutUser);
router.post('/activate', activateUser);

export default router;
