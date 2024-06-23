// src/testWithoutIndex.ts

import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks'; // Using performance API for accurate timing

const prisma = new PrismaClient();

// Function to run query and measure execution time
async function runQuery(): Promise<void> {
  const username = 'john_doe'; // Example username to search for

  try {
    const numberOfRuns = 10;
    let totalExecutionTime = 0;

    await prisma.user.findMany({
        where: {
          username: username,
        },
    });
    for (let i = 0; i < numberOfRuns; i++) {
      const startTime = performance.now();
      await prisma.user.findMany({
        where: {
          username: username,
        },
      });
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      totalExecutionTime += executionTime;
      console.log(`Query ${i + 1} execution time: ${executionTime.toFixed(2)} ms`);
    }

    const averageExecutionTime = totalExecutionTime / numberOfRuns;
    console.log(`Average execution time (without indexes): ${averageExecutionTime.toFixed(2)} ms`);

  } catch (error) {
    console.error('Error running query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function to run the query and measure execution time
runQuery();
