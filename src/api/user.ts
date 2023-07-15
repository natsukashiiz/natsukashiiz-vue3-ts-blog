import type { ServerResponse, SignHistoryResponse, UpdateUserRequest, UserResponse } from '@/api';
import client from '@/api/request';
import type { PaginationParams } from '@/api';

const account = (): ServerResponse<UserResponse> => client.get('/v1/users');
const update = (body: UpdateUserRequest): ServerResponse<UserResponse> =>
    client.patch('/v1/users', body);

const signHistory = (params: PaginationParams): ServerResponse<SignHistoryResponse[]> =>
    client.get('/v1/users/signHistory', { params });

const avatar = (body: FormData): ServerResponse<UserResponse> =>
    client.post('/v1/users/avatar', body);

const removeAvatar = (): ServerResponse<UserResponse> => client.delete('/v1/users/avatar');

export { account, update, signHistory, avatar, removeAvatar };
