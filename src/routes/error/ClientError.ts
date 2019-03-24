export default class ClientError extends Error {
  public constructor(message: string, public readonly status: number = 400) {
    super(message);
  }
}
