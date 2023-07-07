import type {BookmarkRequest, BookmarkResponse, ServerResponse, PaginationParams, BlogResponse} from '@/api';
import client from '@/api/request';

const findAll = (params: PaginationParams): ServerResponse<BookmarkResponse[]> =>
    client.get('/v1/bookmarks', { params });
const add = (body: BookmarkRequest): ServerResponse<BlogResponse> => client.post('/v1/bookmarks', body);
const remove = (id: number): ServerResponse<void> => client.delete('/v1/bookmarks/' + id);

export { findAll, add, remove };
