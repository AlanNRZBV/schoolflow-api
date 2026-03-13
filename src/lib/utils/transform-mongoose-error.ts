import { Error } from 'mongoose';
export const transformMongooseError = (error: Error.ValidationError) => {
	return Object.values(error.errors).map((err) => ({ message: err.message }));
};
