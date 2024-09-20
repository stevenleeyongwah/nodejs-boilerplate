// src/index.ts

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as queryString from 'query-string';
import axios from 'axios'
// import jwt from 'jsonwebtoken'
// import { IGetUserAuthInfoRequest } from "../req"
import { authenticateToken } from '../middlewares/auth'
import { userSchema } from '../validations/userSchema'
import { z } from 'zod';

const prisma = new PrismaClient();

export const userRoute = express.Router();

type User = { id: string };
type NoUser = {};
type GetUser = (id: string) => User | NoUser;

userRoute.get('/users', async (req: Request, res: Response): Promise<void> => {
    console.log("get users")
    let prisma = new PrismaClient();
    console.log(prisma)
    console.log("get 12121211")
    const users = await prisma.user.findMany();
    console.log("get 123")
    // res.status(201);
    res.status(500).json({ error: 'Internal server error' });
});
// app.use(express.json());

// Create a new user
userRoute.post('/user', async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const validatedData = userSchema.parse(req.body);

    await prisma.user.create({
      data: {
        name,
        email,
        age,
      },
    });

    return res.send("all done");
  } catch (error) {
    console.log("error")
    if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        return res.status(400).json({ errors: error.errors });
    }

    res.status(400).json({ error: error });
  }
});

// // Get all users
// app.get('/users', async (req: Request, res: Response) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// Get user by ID
userRoute.put('/user/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  try {
    console.log("findUnique")
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("123")
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

// // Handle unspecified routes
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
