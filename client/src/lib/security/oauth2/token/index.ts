import { OAuth2Key, OAuth2TokenSet } from "..";

export type OAuth2TokenSetDao = {
    getTokenSetById: (
        tokenSetId: string,
    ) => OAuth2TokenSet | null | Promise<OAuth2TokenSet | null>;
    getAllTokenSetsByKeyId: (
        oauth2KeyId: string,
    ) => OAuth2TokenSet[] | Promise<OAuth2TokenSet[]>;
    createTokenSet: (
        oauth2KeyId: string,
        tokenSet: OAuth2TokenSet,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    updateTokenSet: (
        tokenSet: OAuth2TokenSet,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    tokenSetExists: (tokenSetId: string) => boolean | Promise<boolean>;
};
