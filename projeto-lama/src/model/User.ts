export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
}

export enum USER_ROLES {
    ADMIN = 'ADMIN',
    NORMAL = 'NORMAL'
}

export const stringToUserRole = (input: string): USER_ROLES => {
        switch (input) {
        case "NORMAL":
            return USER_ROLES.NORMAL;
        case "ADMIN":
            return USER_ROLES.ADMIN;
        default:
            return USER_ROLES.NORMAL;
        }
    };