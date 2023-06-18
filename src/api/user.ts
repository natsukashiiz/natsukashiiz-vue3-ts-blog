import type { ServerResponse, SignHistoryResponse, UserResponse } from '@/api';
import client from '@/api/request';
import type { PaginationParams } from '@/api';

const account = (): ServerResponse<UserResponse> => client.get('/v1/users');

const signHistory = (params: PaginationParams): ServerResponse<SignHistoryResponse[]> =>
  client.get('/v1/users/signedHistory', { params });

export { account, signHistory };
