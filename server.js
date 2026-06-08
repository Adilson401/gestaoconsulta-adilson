import 'dotenv/config';
import pkg from '@prisma/client';
import { createApp } from './API/rotas.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = createApp(prisma);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
