import type { BlogResponse, PaginationParams, ServerResponse } from '@/api';
import client from '@/api/request';
import type { BlogRequest } from '@/api';

const findAll = (params: PaginationParams): ServerResponse<BlogResponse[]> =>
    client.get('/v1/blog', { params });
const findByUser = (uname: string, params: PaginationParams): ServerResponse<BlogResponse[]> =>
    client.get('/v1/blog/u/' + uname, { params });

const findById = (id: number): ServerResponse<BlogResponse> => client.get('/v1/blog/' + id);
const create = (body: BlogRequest): ServerResponse<BlogResponse> => client.post('/v1/blog', body);
const update = (id: number, body: BlogRequest): ServerResponse<BlogResponse> =>
    client.patch('/v1/blog/' + id, body);
const publish = (id: number): ServerResponse<BlogResponse> =>
    client.patch('/v1/blog/' + id + '/publish');

export { findAll, findByUser, findById, create, update, publish };
