// prisma/seed.js
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting simple Prisma seed / test...');

  // 1) Optional: clean existing data in safe FK order
  try {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database cleaned.');
  } catch (err) {
    console.warn('⚠️ Skipping clean step (likely tables empty / not created yet):', err.message);
  }

  // 2) Create a test user
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

  // 3) Create a test category
  const category = await prisma.category.create({
    data: {
      name: 'Test Category',
      image: null,
    },
  });
  console.log('✅ Category created:', category);

  // 4) Create a test product in that category
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

  // 5) Create a simple order with one item for the user
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

  // 6) Read back data to verify
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