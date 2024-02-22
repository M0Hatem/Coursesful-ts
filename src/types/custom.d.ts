declare namespace Express {
  export interface Request {
    userId?: string;
    duplicated?: boolean;
  }
}
