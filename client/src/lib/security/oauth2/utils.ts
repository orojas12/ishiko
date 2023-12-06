import { JWT } from ".";

export function decodeJwt(jwt: string): JWT {
    return JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
}
