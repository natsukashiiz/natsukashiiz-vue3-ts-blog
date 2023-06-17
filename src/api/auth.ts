import type {RefreshTokenRequest, ServerResponse, SigninRequest, TokenResponse} from "@/api/index";
import {create} from "@/api/request";
const client = create();

const signIn = (body: SigninRequest): ServerResponse<TokenResponse> =>
    client.post('/v1/auth/signin', body)

const refresh = (body: RefreshTokenRequest): ServerResponse<TokenResponse> =>
    client.post('/v1/auth/refresh', body)

export {signIn, refresh}