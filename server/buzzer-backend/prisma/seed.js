

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting simple Prisma seed / test...');

  try {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database cleaned.');
  } catch (err) {
    console.warn('⚠️ Skipping clean step:', err.message);
  }

  const user = await prisma.user.create({
    data: {
      fullName: 'Test User',
      mobileNumber: '201000000000',
      firebaseUid: 'test-firebase-uid',
      email: 'test@example.com',
      type: 'TEST',
    },
  });
  console.log('✅ User created:', user);

  const category = await prisma.category.create({
    data: {
      name: 'Test Category',
      image: null,
    },
  });
  console.log('✅ Category created:', category);

  const product = await prisma.product.create({
    data: {
      name: 'Test Product',
      description: 'Just a test product',
      price: '9.99',
      image: null,
      categoryId: category.id,
    },
  });
  console.log('✅ Product created:', product);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalPrice: '9.99',
      status: 'PENDING',
      items: {
        create: [
          {
            productId: product.id,
            quantity: 1,
            price: '9.99',
          },
        ],
      },
    },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });
  console.log('✅ Order created with item:', order);

  const users = await prisma.user.findMany();
  console.log('📂 All users in DB:', users);

  console.log('🎉 Prisma test seed finished successfully.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });