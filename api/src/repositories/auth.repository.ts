import { PrismaClient, User, RefreshToken } from '@prisma/client';

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { teacher: true, student: true } });
  }

  findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id }, include: { teacher: true, student: true } });
  }

  createUser(data: Pick<User, 'email' | 'password' | 'role'>) {
    return this.prisma.user.create({ data });
  }

  createRefreshToken(data: Omit<RefreshToken, 'id' | 'createdAt'>) {
    return this.prisma.refreshToken.create({ data });
  }

  getRefreshTokenByJti(jti: string) {
    return this.prisma.refreshToken.findUnique({ where: { jti } });
  }

  markRefreshTokenUsed(jti: string) {
    return this.prisma.refreshToken.update({ where: { jti }, data: { usedAt: new Date() } });
  }

  revokeRefreshToken(jti: string) {
    return this.prisma.refreshToken.update({ where: { jti }, data: { revoked: true } });
  }

  revokeAllUserTokens(userId: number) {
    return this.prisma.refreshToken.updateMany({ where: { userId, revoked: false }, data: { revoked: true } });
  }
}


