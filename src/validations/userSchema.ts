import { z } from 'zod';

// Define the Zod schema
export const userSchema = z.object({
  name: z.string().min(8, 'Name must be at least 8 characters long'),
  email: z.string().email('Invalid email format'),
  age: z.number().gt(18, 'Age must be greater than 18'),
});
