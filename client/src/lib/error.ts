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
