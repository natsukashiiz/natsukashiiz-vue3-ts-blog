import type { CategoryResponse, ServerResponse } from '@/api';
import client from '@/api/request';

const findAll = (): ServerResponse<CategoryResponse[]> => client.get('/v1/categories');

export { findAll };
