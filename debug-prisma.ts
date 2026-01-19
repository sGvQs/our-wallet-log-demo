import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma Client...');
  try {
    // We expect this to fail with Foreign Key constraint if IDs are random,
    // BUT checking if it fails with "Unknown argument" first.
    await prisma.expense.create({
      data: {
        amount: 100,
        description: "Debug Test",
        date: new Date(),
        category: "FOOD", // This is the field in question
        userId: 1, // assuming user 1 exists, or fix logic
        groupId: "00000000-0000-0000-0000-000000000000",
      }
    });
    console.log('Success (Unexpectedly created record with fake IDs?!)');
  } catch (e: any) {
    if (e.message.includes('Unknown argument')) {
      console.error('FAILURE: Prisma Client is missing fields.');
      console.error(e.message);
    } else if (e.code === 'P2003') {
        console.log('SUCCESS: Prisma Client validates schema correctly (Foreign Key error expected).');
    } else {
      console.log('Observation:', e.message);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
