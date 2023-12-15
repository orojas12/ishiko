export type OAuth2Key = {
    id: string;
    userId: string;
    providerId: string;
    providerUserId: string;
};

export type OAuth2KeySchema = {
    id: string;
    user_id: string;
    provider_id: string;
    provider_user_id: string;
};

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
