import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin
  const hashedPassword = await bcrypt.hash('password', 10);
  
  await prisma.admin.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      password: hashedPassword,
    },
  });

  // Create initial game state
  const existingState = await prisma.gameState.findFirst();
  if (!existingState) {
    await prisma.gameState.create({
      data: {
        status: 'waiting',
      },
    });
  }

  console.log('✅ Seed completed: admin user created (login: admin, password: password)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

