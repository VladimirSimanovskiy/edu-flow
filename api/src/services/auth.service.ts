import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';
import { AuthRepository } from '../repositories/auth.repository';
import { securityConfig } from '../config';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
    teacher?: any;
    student?: any;
  };
}

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.repo.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new Error('Invalid credentials');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        teacher: (user as any).teacher,
        student: (user as any).student,
      },
    };
  }

  async register(email: string, rawPassword: string, role: UserRole) {
    const password = await bcrypt.hash(rawPassword, securityConfig.bcryptRounds);
    return this.repo.createUser({ email, password, role });
  }

  async refresh(oldRefreshToken: string) {
    const decoded: any = jwt.verify(oldRefreshToken, securityConfig.refresh.secret, {
      algorithms: [securityConfig.refresh.algorithm],
      issuer: securityConfig.refresh.issuer,
      audience: securityConfig.refresh.audience,
    });

    if (decoded.type !== 'refresh' || !decoded.jti) {
      throw new Error('Invalid refresh token');
    }

    const stored = await this.repo.getRefreshTokenByJti(decoded.jti);
    if (!stored || stored.revoked || (stored.usedAt && stored.usedAt.getTime() > 0)) {
      // Reuse detected or revoked
      await this.repo.revokeAllUserTokens(decoded.id);
      throw new Error('Refresh token reuse detected');
    }

    await this.repo.markRefreshTokenUsed(decoded.jti);

    const user = await this.repo.findUserById(decoded.id);
    if (!user) throw new Error('User not found');

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        teacher: (user as any).teacher,
        student: (user as any).student,
      },
    };
  }

  async logout(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, securityConfig.refresh.secret, {
        algorithms: [securityConfig.refresh.algorithm],
        issuer: securityConfig.refresh.issuer,
        audience: securityConfig.refresh.audience,
      });
      if (decoded.jti) {
        await this.repo.revokeRefreshToken(decoded.jti);
      }
    } catch (_) {
      // ignore invalid token on logout
    }
  }

  private async issueTokens(id: number, email: string, role: UserRole) {
    const jti = randomUUID();

    const accessToken = jwt.sign({ id, email, role }, securityConfig.access.secret, {
      expiresIn: securityConfig.access.expiresIn,
      issuer: securityConfig.access.issuer,
      audience: securityConfig.access.audience,
      algorithm: securityConfig.access.algorithm,
    } as jwt.SignOptions);

    const expires = new Date(Date.now() + this.parseDurationMs(securityConfig.refresh.expiresIn));

    const refreshToken = jwt.sign({ id, type: 'refresh', jti }, securityConfig.refresh.secret, {
      expiresIn: securityConfig.refresh.expiresIn,
      issuer: securityConfig.refresh.issuer,
      audience: securityConfig.refresh.audience,
      algorithm: securityConfig.refresh.algorithm,
    } as jwt.SignOptions);

    await this.repo.createRefreshToken({ jti, userId: id, revoked: false, usedAt: null, expiresAt: expires, device: null, ip: null });

    return { accessToken, refreshToken };
  }

  private parseDurationMs(duration: string): number {
    // supports m/h/d suffixes
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return parseInt(duration, 10) * 1000 || 0;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return value;
    }
  }
}


