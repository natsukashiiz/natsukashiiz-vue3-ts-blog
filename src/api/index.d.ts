export interface ApiResponse<T> {
  code: number,
  text: string,
  result?: T
  pagination: PaginationResponse
}

export type ServerResponse<T> = Promise<AxiosResponse<ApiResponse<T>>>;

export interface PaginationResponse {
  current: number,
  limit: number,
  records: number,
  pages: number,
  first: boolean,
  last: boolean
}

export interface PaginationRequest {
  page: number,
  limit: number,
  sortBy: string,
  sortType: string
}

export interface SignupRequest {
  email: string | null,
  username: string | null,
  password: string | null
}

export interface SignupResponse {
  email: string,
  username: string,
  password: string
}

export interface SigninRequest {
  username: string | null,
  password: string | null
}

export interface TokenResponse {
  accessToken: string,
  refreshToken: string,
  accessExpire: number,
  refreshExpire: number
}

export interface TokenPayload {
  sub: string,
  uid: number,
  iss: string,
  name: string,
  exp: number,
  iat: number
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserResponse {
  id: number,
  email: string,
  username: string,
  cdt: number
}

export interface UpdateUserRequest {
  email: string;
}

export interface SignHistoryResponse {
  id: number,
  ipv4: string,
  device: string,
  cdt: number
}