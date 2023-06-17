import type { ServerResponse, SignHistoryResponse, UserResponse } from "@/api/index";
import client from "@/api/request";

const account = (): ServerResponse<UserResponse> =>
  client.get("/v1/users");

const signHistory = (): ServerResponse<SignHistoryResponse> =>
  client.get("/v1/users/signedHistory");


export { account, signHistory };