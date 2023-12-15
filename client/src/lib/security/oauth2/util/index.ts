import type { JWTClaims } from "../token";

export function decodeJwt(jwt: string): JWTClaims {
    return JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
}
