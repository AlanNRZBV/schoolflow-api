import { model } from 'mongoose';
import { GroupModel, GroupType as GroupType } from '@/models/group/group.types';
import { groupSchema } from '@/models/group/group.schema';

export const Group = model<GroupType, GroupModel>('Group', groupSchema);
