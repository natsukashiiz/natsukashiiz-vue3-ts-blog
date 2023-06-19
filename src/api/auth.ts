import type {
    RefreshTokenRequest,
    ServerResponse,
    SigninRequest,
    SignupRequest,
    TokenResponse,
    UserResponse
} from '@/api/index';
import { create } from '@/api/request';
const client = create();

const signUp = (body: SignupRequest): ServerResponse<UserResponse> =>
    client.post('/v1/auth/signUp', body);

const signIn = (body: SigninRequest): ServerResponse<TokenResponse> =>
    client.post('/v1/auth/signIn', body);

const refreshToken = (body: RefreshTokenRequest): ServerResponse<TokenResponse> =>
    client.post('/v1/auth/refresh', body);

export { signUp, signIn, refreshToken };
