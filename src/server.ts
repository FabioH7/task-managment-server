import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction, Router } from 'express';
import mongoose from 'mongoose';
import { router as authRoutes } from '@routes/auth.routes';
import { router as organizationRoutes } from '@routes/organization.routes';
import seedDatabase from '@config/seedDb';

dotenv.config();
const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);

mongoose.connect(process.env.DATABASE_URL as string)
.then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
})
.catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Task Management API');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
