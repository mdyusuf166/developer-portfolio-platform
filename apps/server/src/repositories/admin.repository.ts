import { prisma } from '../lib/prisma.js';

export const adminRepository = {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email }
    });
  },

  async findById(id: string) {
    return prisma.admin.findUnique({
      where: { id }
    });
  },

  async createAdmin(input: { name: string; email: string; passwordHash: string; role: string }) {
    return prisma.admin.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role
      }
    });
  }
};
