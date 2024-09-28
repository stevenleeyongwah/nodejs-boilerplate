import request from 'supertest';
import express from 'express';
import userRoute from '../src/routes/user';
import { PrismaClient } from '@prisma/client';

// Create a new express application
const app = express();
app.use(express.json());
app.use(userRoute);

// Mock the PrismaClient
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
        $disconnect: jest.fn(),
    };
    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('GET /users', () => {
    const mockUsers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
    ];

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test to avoid state carryover
    });

    it('should return a list of users with id and name', async () => {
        const prisma = new PrismaClient();
        
        // Mock the findMany method to return mock users
        prisma.user.findMany.mockResolvedValue(mockUsers);

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
    });

    it('should return a 500 status code when there is an error', async () => {
        const prisma = new PrismaClient();
        
        // Mock the findMany method to throw an error
        prisma.user.findMany.mockRejectedValue(new Error('Database errorsss'));

        const response = await request(app).get('/users');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An error occurred while fetching users.' });
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
    });
});

describe('POST /user', () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
    };

    it('should create a user and return success message', async () => {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // Mock the create method to return the mock user
        prisma.user.create.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/user')
            .send(mockUser);

        expect(response.status).toBe(200);
        expect(response.text).toBe('all done');
        expect(prisma.user.create).toHaveBeenCalledWith({ data: mockUser });
    });

    // it('should return a 400 status code with validation errors', async () => {
    //     const invalidUserData = {
    //         name: '',
    //         email: 'invalid-email',
    //         age: 'not-a-number', // Invalid age
    //     };

    //     const response = await request(app)
    //         .post('/user')
    //         .send(invalidUserData);

    //     expect(response.status).toBe(400);
    //     expect(response.body.errors).toBeDefined(); // Assuming Zod validation errors will be defined
    //     expect(prisma.user.create).not.toHaveBeenCalled(); // Ensure create was not called
    // });

    // it('should return a 400 status code on unexpected error', async () => {
    //     const { PrismaClient } = require('@prisma/client');
    //     const prisma = new PrismaClient();

    //     // Mock the create method to throw an unexpected error
    //     prisma.user.create.mockRejectedValue(new Error('Database error'));

    //     const response = await request(app)
    //         .post('/user')
    //         .send(mockUser);

    //     expect(response.status).toBe(400);
    //     expect(response.body.error).toBeDefined(); // Check if error message is defined
    //     expect(prisma.user.create).toHaveBeenCalledTimes(1);
    // });
});