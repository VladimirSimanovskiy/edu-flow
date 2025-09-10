import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { scheduleRoutes } from './routes/schedule';
import { authRoutes } from './routes/auth';
import { createLessonRoutes } from './routes/lessons';
import { createTeacherRoutes } from './routes/teachers';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './config';
import { LessonRepository, TeacherRepository } from './repositories';
import { LessonService, TeacherService } from './services';
import { LessonController, TeacherController } from './controllers';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize repositories
const lessonRepository = new LessonRepository(prisma);
const teacherRepository = new TeacherRepository(prisma);

// Initialize services
const lessonService = new LessonService(lessonRepository);
const teacherService = new TeacherService(teacherRepository);

// Initialize controllers
const lessonController = new LessonController(lessonService);
const teacherController = new TeacherController(teacherService);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/lessons', createLessonRoutes(lessonController));
app.use('/api/teachers', createTeacherRoutes(teacherController));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
