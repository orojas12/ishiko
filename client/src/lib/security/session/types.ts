import type { User } from "../user";

export type Session = {
    id: string;
    user: User;
    expires: Date;
};

export type SessionSchema = {
    id: string;
    user_id: string;
    expires: string;
};
