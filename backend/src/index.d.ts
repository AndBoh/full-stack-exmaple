import { User } from '@Models';

declare global {
  namespace Express {
    interface Request {
      me: User
    }
  }
}
