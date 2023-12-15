export type User = {
    id: string;
    username: string;
};

export type UserSchema = {
    id: string;
    username: string;
};

export type UserDao = {
    getUserByOAuth2Key: (
        providerId: string,
        providerUserId: string,
    ) => User | null | Promise<User | null>;
    createUserWithOAuth2Key: (
        providerId: string,
        providerUserId: string,
        user: Omit<User, "id">,
    ) => User | Promise<User>;
};
