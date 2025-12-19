// prisma/seed-restaurants.js
// Seed restaurants with real Cairo/Giza coordinates for testing
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting restaurant seed...');

  // Real coordinates for Cairo/Giza area:
  // - Dokki: 30.0444, 31.2147
  // - Maadi: 29.9604, 31.2599
  // - Nasr City: 30.0626, 31.3177
  // - Zamalek: 30.0629, 31.2177
  // - Downtown Cairo: 30.0444, 31.2357
  // - Giza: 30.0131, 31.2089

  const restaurants = [
    {
      name: 'The Skye',
      type: 'Restaurant',
      location: 'Main Market Riyadh, KSA',
      latitude: 30.0444, // Dokki
      longitude: 31.2147,
      rating: 4.5,
      imageUrl: null,
    },
    {
      name: 'Al Nakheel',
      type: 'Cafe',
      location: 'Main Market Riyadh, KSA',
      latitude: 29.9604, // Maadi
      longitude: 31.2599,
      rating: 4.3,
      imageUrl: null,
    },
    {
      name: 'Le Cie',
      type: 'Cafe',
      location: 'Main Market Riyadh, KSA',
      latitude: 30.0626, // Nasr City
      longitude: 31.3177,
      rating: 4.2,
      imageUrl: null,
    },
    {
      name: 'Holiday Inn',
      type: 'Restaurant',
      location: 'Main Market Riyadh, KSA',
      latitude: 30.0629, // Zamalek
      longitude: 31.2177,
      rating: 4.0,
      imageUrl: null,
    },
    {
      name: 'Downtown Delights',
      type: 'Restaurant',
      location: 'Main Market Riyadh, KSA',
      latitude: 30.0444, // Downtown Cairo
      longitude: 31.2357,
      rating: 4.7,
      imageUrl: null,
    },
    {
      name: 'Giza Garden',
      type: 'Cafe',
      location: 'Main Market Riyadh, KSA',
      latitude: 30.0131, // Giza
      longitude: 31.2089,
      rating: 4.1,
      imageUrl: null,
    },
  ];

  // Delete existing restaurants
  await prisma.restaurant.deleteMany();
  console.log('🧹 Existing restaurants deleted.');

  // Create restaurants
  for (const restaurant of restaurants) {
    const created = await prisma.restaurant.create({
      data: restaurant,
    });
    console.log(`✅ Created restaurant: ${created.name} at (${created.latitude}, ${created.longitude})`);
  }

  console.log(`🎉 Successfully seeded ${restaurants.length} restaurants.`);
}

main()
  .catch((err) => {
    console.error('❌ Restaurant seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

