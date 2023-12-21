import type { JWTClaims } from "../";

export function decodeJwt(jwt: string): JWTClaims {
    console.log("decoding: " + jwt);
    return JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
}
