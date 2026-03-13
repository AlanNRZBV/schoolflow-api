import { CustomError } from '@/errors/custom-error';

export default class NotAuthorizedError extends CustomError {
	statusCode = 401;
	constructor(message = 'Not authorized') {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}
	serializeErrors() {
		return { message: this.message };
	}
}
