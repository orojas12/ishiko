export class RowNotFoundError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class DuplicateRowError extends Error {
    constructor(message?: string) {
        super(message);
    }
}
