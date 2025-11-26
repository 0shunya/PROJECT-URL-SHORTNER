import { randomBytes, createHmac } from 'crypto';

export function hashedPasswordWithSalt(password, existingSalt) {
  const salt = existingSalt ?? randomBytes(32).toString('hex');
  const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  return { salt, hashedPassword };
}
