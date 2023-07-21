import { AxiosResponse } from 'axios';
import { DeviceState } from '@/api/enum';

export interface ApiResponse<T> {
    code: number;
    text: string;
    result?: T;
    records: number;
    pagination: PaginationResponse;
}

export type ServerResponse<T> = Promise<AxiosResponse<ApiResponse<T>>>;

export interface BaseResult {
    id?: number;
    state?: number;
    cdt?: number;
    udt?: number;
}

export interface PaginationResponse {
    current: number;
    limit: number;
    records: number;
    pages: number;
    first: boolean;
    last: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface SignupRequest {
    email: string | null;
    username: string | null;
    password: string | null;
}

export interface SignupResponse {
    email: string;
    username: string;
    password: string;
}

export interface SigninRequest {
    username: string | null;
    password: string | null;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    accessExpire: number;
    refreshExpire: number;
}

export interface TokenPayload {
    sub: string;
    uid: number;
    iss: string;
    name: string;
    avatar: string;
    exp: number;
    iat: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface UserResponse {
    id: number;
    email: string;
    username: string;
    avatar: string;
    cdt: number;
}

export interface UpdateUserRequest {
    email: string;
}

export interface SignHistoryResponse {
    id: number;
    ipv4: string;
    device: DeviceState;
    deviceName: string;
    cdt: number;
}

export interface BlogResponse {
    id: number;
    title: string;
    content: string;
    category: string;
    publish: boolean;
    cdt: number;
    uid: number;
    uname: string;
    avatar: string;
    bookmark: boolean;
}

export interface BlogRequest {
    title: string | null;
    content: string | null;
    categoryId?: number | null;
}
export interface BookmarkRequest {
    blogId?: number;
}

export interface BookmarkResponse {
    id: number;
    blog: BlogResponse;
}

export interface CategoryResponse {
    id: number;
    name: string;
}

export interface UserBlogResponse {
    user: UserResponse;
    blog: Array<BlogResponse>;
}
