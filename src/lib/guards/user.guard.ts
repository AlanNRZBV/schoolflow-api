import { CreatePersonnelDto } from '@/lib/guards/personnel.guard';

export const isNewUserDto = (
	dto: CreatePersonnelDto,
): dto is CreatePersonnelDto => dto.userData !== undefined;
