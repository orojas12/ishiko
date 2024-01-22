import type { JWTClaims } from "../types";

const DEFAULT_CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function decodeJwt(jwt: string): JWTClaims {
    return JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
}

export function generateRandomString(
    length: number,
    characters: string = DEFAULT_CHARACTERS
) {
    const charactersLength = characters.length;
    let result = "";
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter++;
    }
    return result;
}
