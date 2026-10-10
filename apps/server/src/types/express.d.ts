declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: {
        sub: string;
        role: string;
      };
    }
  }
}

export {};
