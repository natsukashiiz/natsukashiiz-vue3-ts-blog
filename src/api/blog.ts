import type { BlogResponse, PaginationParams, ServerResponse } from '@/api';
import client from '@/api/request';
import type { BlogRequest } from '@/api';

const blogList = (params: PaginationParams): ServerResponse<BlogResponse[]> =>
    client.get('/v1/blog', { params });
const MyblogList = (params: PaginationParams): ServerResponse<BlogResponse[]> =>
    client.get('/v1/blog/me', { params });

const findById = (id: number): ServerResponse<BlogResponse> => client.get('/v1/blog/' + id);
const create = (body: BlogRequest): ServerResponse<BlogResponse> => client.post('/v1/blog', body);
const update = (id: number, body: BlogRequest): ServerResponse<BlogResponse> =>
    client.patch('/v1/blog/' + id, body);
const publish = (id: number): ServerResponse<BlogResponse> =>
    client.patch('/v1/blog/' + id + '/publish');

export { blogList, findById, create, update, publish };
