import type { User } from "../user";

export type Session = {
    id: string;
    user: User;
    expires: Date;
};
