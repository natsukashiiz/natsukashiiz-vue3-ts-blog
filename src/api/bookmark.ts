import type { BlogResponse, ServerResponse } from '@/api';
import client from '@/api/request';
import type { BookmarkRequest } from '@/api';

const findAll = (): ServerResponse<BlogResponse[]> => client.get('/v1/bookmarks');
const add = (body: BookmarkRequest): ServerResponse<void> => client.post('/v1/bookmarks', body);
const remove = (id: number): ServerResponse<void> => client.delete('/v1/bookmarks/' + id);

export { findAll, add, remove };
