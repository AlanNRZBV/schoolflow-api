import { ROLE_KEYS } from '@/lib/constants/roles';
import { POSITIONS_KEYS } from '@/lib/constants/positions';
import { POSITION_ROLES } from '@/lib/constants/position-roles';

export type RoleKey = (typeof ROLE_KEYS)[number];

export type UserProfileStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export type PositionKey = (typeof POSITIONS_KEYS)[number];

export type PositionRoleKey = keyof typeof POSITION_ROLES;

export type PositionRoleShort =
	(typeof POSITION_ROLES)[PositionRoleKey]['short'];

export type PositionRoleFull = (typeof POSITION_ROLES)[PositionRoleKey]['full'];

export type PositionRole = (typeof POSITION_ROLES)[PositionRoleKey];
