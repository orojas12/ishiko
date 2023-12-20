export class GenericError extends Error {
    constructor() {
        super("Oops! Something went wrong :(");
    }
}

export class HttpError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class OAuth2Error extends Error {
    constructor(message: string) {
        super(message);
    }
}
