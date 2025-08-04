import { JwtStrategy, JwtPayload } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should validate payload and return user object', () => {
    const payload: JwtPayload = {
      sub: 'user123',
      email: 'test@example.com',
    };
    const result = strategy.validate(payload);
    expect(result).toEqual({ userId: 'user123', email: 'test@example.com' });
  });

  it('should ignore iat and exp fields in payload', () => {
    const payload: JwtPayload = {
      sub: 'user456',
      email: 'another@example.com',
      iat: 123456,
      exp: 654321,
    };
    const result = strategy.validate(payload);
    expect(result).toEqual({ userId: 'user456', email: 'another@example.com' });
  });
});
