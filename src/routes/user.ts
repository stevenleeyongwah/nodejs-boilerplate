// src/index.ts

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as queryString from 'query-string';
import axios from 'axios'
// import jwt from 'jsonwebtoken'
// import { IGetUserAuthInfoRequest } from "../req"
import { authenticateToken } from '../middlewares/auth'

const prisma = new PrismaClient();

export const userRoute = express.Router();

type User = { id: string };
type NoUser = {};
type GetUser = (id: string) => User | NoUser;

userRoute.get('/users', async (req: Request, res: Response): Promise<void> => {
    console.log("usersusers")
    const users = await prisma.user.findMany();
    // res.status(201);
    res.status(500).json({ error: 'Internal server error' });
});
// app.use(express.json());

// // Create a new user
// app.post('/users', async (req: Request, res: Response) => {
//   const { username, email, age } = req.body;
//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         age,
//       },
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to create user' });
//   }
// });

// // Get all users
// app.get('/users', async (req: Request, res: Response) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // Get user by ID
// app.get('/users/:id', async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id, 10);
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (!user) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// });

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
