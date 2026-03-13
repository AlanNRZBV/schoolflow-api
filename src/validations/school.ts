import { celebrate, Joi, Segments } from 'celebrate';

export const validateGroup = celebrate({
	[Segments.BODY]: Joi.object().keys({
		number: Joi.number().required().min(1).max(12),
		letter: Joi.string()
			.required()
			.length(1)
			.regex(/^[А-Яа-я]+$/),
		students: Joi.array().items(Joi.string().length(24).hex()),
		supervisor: Joi.string().length(24).hex(),
	}),
});
