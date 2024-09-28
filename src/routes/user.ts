// src/index.ts

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '../validations/userSchema'
import { z } from 'zod';

const prisma = new PrismaClient();

export const userRoute = express.Router();

userRoute.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
      const allUsers = await prisma.user.findMany();
      
      // Map the users to return only id and name
      const users = allUsers.map(user => ({
          id: user.id,
          name: user.name
      }));

      res.status(200).json(users); // Return users with status 200
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching users.' });
  } finally {
      await prisma.$disconnect(); // Disconnect the Prisma client
  }
});

// Create a new user
userRoute.post('/user', async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    userSchema.parse(req.body);

    await prisma.user.create({
      data: {
        name,
        email,
        age,
      },
    });

    return res.send("all done");
  } catch (error) {
    if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        return res.status(400).json({ errors: error.errors });
    }

    res.status(400).json({ error: error });
  }
});

// Get user by ID
userRoute.put('/user/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// // Update user by ID
// app.put('/users/:id', async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id, 10);
//   const { username, email, age } = req.body;
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         username,
//         email,
//         age,
//       },
//     });
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to update user' });
//   }
// });

// // Delete user by ID
// app.delete('/users/:id', async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id, 10);
//   try {
//     await prisma.user.delete({
//       where: { id: userId },
//     });
//     res.status(204).send();
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to delete user' });
//   }
// });

export default userRoute;