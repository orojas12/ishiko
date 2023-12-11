import { OAuth2Key } from "..";

export type OAuth2KeyDao = {
    getKeyByProviderAndProviderUser: (
        providerId: string,
        providerUserId: string,
    ) => OAuth2Key | undefined | Promise<OAuth2Key | undefined>;
    createKey: (
        providerId: string,
        providerUserId: string,
        userId: string,
    ) => OAuth2Key | Promise<OAuth2Key>;
};
