import { celebrate, Joi, Segments } from 'celebrate';
import * as process from 'node:process';
import { ROLE_KEYS } from '@/lib/constants/roles';
import { POSITIONS_KEYS } from '@/lib/constants/positions';
import { POSITION_ROLES } from '@/lib/constants/position-roles';

const isDev = process.env.NODE_ENV === 'dev';

export const validateAdminBody = celebrate({
	[Segments.BODY]: {
		firstName: Joi.string().required().min(2).max(20),
		lastName: Joi.string().required().min(2).max(20),
		middleName: Joi.string().required().min(2).max(20),
		password: Joi.string()
			.required()
			.min(isDev ? 4 : 8)
			.max(20),
		email: Joi.string().required().email(),
		schoolId: Joi.string().required().length(24).hex(),
	},
});

export const validateCreateAssignmentDto = celebrate({
	[Segments.BODY]: Joi.object().keys({
		userData: Joi.object({
			email: Joi.string().required().email(),
			firstName: Joi.string().required().min(2).max(20),
			lastName: Joi.string().required().min(2).max(20),
			middleName: Joi.string().required().min(2).max(20),
			role: Joi.string()
				.required()
				.valid(...ROLE_KEYS),
		}).optional(),
		assignmentData: Joi.object({
			userId: Joi.string().required().length(24).hex().optional(),
			position: Joi.string()
				.required()
				.valid(...POSITIONS_KEYS),
			positionTags: Joi.array().items(Joi.string().required()).required(),
			positionRole: Joi.object().valid(...Object.values(POSITION_ROLES)),
			subjects: Joi.array().items(Joi.string().length(24).hex()).required(),
		}).required(),
	}),
});

export const validateUserPasswords = celebrate({
	[Segments.BODY]: Joi.object().keys({
		password: Joi.string()
			.required()
			.min(isDev ? 4 : 8)
			.max(16)
			.equal(Joi.ref('confirmPassword')),
		confirmPassword: Joi.string()
			.required()
			.min(isDev ? 4 : 8)
			.max(16),
	}),
});
