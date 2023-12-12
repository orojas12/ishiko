import { OAuth2Key } from "..";

export type OAuth2KeyDao = {
    getKey: (
        providerId: string,
        providerUserId: string,
    ) => OAuth2Key | null | Promise<OAuth2Key | null>;
    createKey: (
        providerId: string,
        providerUserId: string,
        userId: string,
    ) => OAuth2Key | Promise<OAuth2Key>;
};
