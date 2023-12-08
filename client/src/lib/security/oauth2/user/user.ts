export type User = {
    id: string;
    name: string;
};

export type UserDao = {
    getUserByOAuth2Key: (
        providerId: string,
        providerUserId: string,
    ) => User | undefined | Promise<User | undefined>;
    createUserWithOAuth2Key: (
        username: string,
        providerId: string,
        providerUserId: string,
    ) => User | Promise<User>;
};
