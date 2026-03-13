import { HydratedDocument, Model } from 'mongoose';
import { RoleKey, UserProfileStatus } from '@/types/types';

export type UserType = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	middleName: string;
	profilePicture: string | null;
	role: RoleKey;
	status: UserProfileStatus;
	activationExp: Date | null;
};

export type CreateUserDto = {
	email: string;
	firstName: string;
	lastName: string;
	middleName: string;
	role: RoleKey;
};

export type AdminDto = CreateUserDto & {
	password: string;
	schoolId: string;
};

export type UserExtension = {
	achievements: string | null;
	penalties: string | null;
};

export type HydratedUser = HydratedDocument<UserType, UserMethods>;

export type UserStatics = {
	findByCredentials: (
		email: string,
		password: string,
	) => Promise<HydratedUser> | never;
};

export type UserModel = Model<UserType, {}, UserMethods> & UserStatics;
export type UserMethods = {
	generateAuthToken: () => string;
	generateTempToken: () => string;
};
