import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';
import { adminRepository } from '../repositories/admin.repository.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from '../lib/token.js';
import { env } from '../config/env.js';
import { authSchema, loginSchema } from '../validators/auth.validator.js';

export const authService = {
  async register(input: unknown) {
    const parsed = authSchema.parse(input);

    if (parsed.bootstrapSecret !== env.adminBootstrapSecret) {
      throw new AppError('Invalid bootstrap secret', 401, 'UNAUTHORIZED');
    }

    const existing = await adminRepository.findByEmail(parsed.email);
    if (existing) {
      throw new AppError('Admin already exists', 409, 'CONFLICT');
    }

    const passwordHash = await hashPassword(parsed.password);
    const admin = await adminRepository.createAdmin({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: 'ADMIN'
    });

    const accessToken = generateAccessToken({ sub: admin.id, role: admin.role });
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        adminId: admin.id,
        expiresAt: new Date(Date.now() + env.jwtRefreshExpiresInSeconds * 1000)
      }
    });

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      accessToken,
      refreshToken,
      tokenType: 'Bearer'
    };
  },

  async login(input: unknown) {
    const parsed = loginSchema.parse(input);
    const admin = await adminRepository.findByEmail(parsed.email.toLowerCase().trim());

    if (!admin || !(await verifyPassword(parsed.password, admin.passwordHash))) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken({ sub: admin.id, role: admin.role });
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        adminId: admin.id,
        expiresAt: new Date(Date.now() + env.jwtRefreshExpiresInSeconds * 1000)
      }
    });

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      accessToken,
      refreshToken,
      tokenType: 'Bearer'
    };
  },

  async refresh(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    const refreshRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { admin: true }
    });

    if (!refreshRecord || refreshRecord.revokedAt || refreshRecord.expiresAt < new Date()) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const accessToken = generateAccessToken({ sub: refreshRecord.admin.id, role: refreshRecord.admin.role });
    const nextRefreshToken = generateRefreshToken();

    await prisma.$transaction(async (transaction) => {
      const rotation = await transaction.refreshToken.updateMany({
        where: { id: refreshRecord.id, revokedAt: null, expiresAt: { gt: new Date() } },
        data: { revokedAt: new Date() }
      });
      if (rotation.count !== 1) throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
      await transaction.refreshToken.create({
        data: {
          tokenHash: hashRefreshToken(nextRefreshToken),
          adminId: refreshRecord.adminId,
          expiresAt: new Date(Date.now() + env.jwtRefreshExpiresInSeconds * 1000)
        }
      });
    });

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      admin: { id: refreshRecord.admin.id, name: refreshRecord.admin.name, email: refreshRecord.admin.email, role: refreshRecord.admin.role },
      tokenType: 'Bearer'
    };
  },

  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    });

    return { success: true };
  },

  async getCurrentAdmin(id: string) {
    if (!id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const admin = await adminRepository.findById(id);

    if (!admin) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
  }
};
