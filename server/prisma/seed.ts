import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

interface SeedFlag {
  id: string;
  name: string;
  name_fr: string;
  flag: string;
  level: number;
}

interface SeedUser {
  id: string;
  userId: string;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  bestScore: number;
  bestScoreDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function loadJson<T>(relativePath: string): T {
  const abs = resolve(__dirname, relativePath);
  return JSON.parse(readFileSync(abs, 'utf-8')) as T;
}

async function main(): Promise<void> {
  const flags = loadJson<SeedFlag[]>('./seed-data/flags.json');
  const users = loadJson<SeedUser[]>('./seed-data/users.json');

  await prisma.flag.createMany({
    data: flags.map((f) => ({
      id: f.id,
      name: f.name,
      name_fr: f.name_fr,
      flag: f.flag,
      level: f.level,
    })),
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: users.map((u) => ({
      id: u.id,
      userId: u.userId,
      username: u.username,
      email: u.email,
      password: u.password,
      googleId: u.googleId,
      bestScore: u.bestScore,
      bestScoreDate: u.bestScoreDate ? new Date(u.bestScoreDate) : null,
      isActive: u.isActive,
      createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
      updatedAt: u.updatedAt ? new Date(u.updatedAt) : undefined,
    })),
    skipDuplicates: true,
  });

  console.log(`Seeded ${flags.length} flags and ${users.length} users.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });