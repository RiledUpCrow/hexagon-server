declare namespace Express {
  interface Request {
    user?: import('../database/User').default;
  }
}
