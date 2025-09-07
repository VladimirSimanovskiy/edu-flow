import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const teacherUser1 = await prisma.user.upsert({
    where: { email: 'ivanova@school.com' },
    update: {},
    create: {
      email: 'ivanova@school.com',
      password: await bcrypt.hash('teacher123', 10),
      role: 'TEACHER',
    },
  });

  const teacherUser2 = await prisma.user.upsert({
    where: { email: 'petrova@school.com' },
    update: {},
    create: {
      email: 'petrova@school.com',
      password: await bcrypt.hash('teacher123', 10),
      role: 'TEACHER',
    },
  });

  const teacherUser3 = await prisma.user.upsert({
    where: { email: 'sidorov@school.com' },
    update: {},
    create: {
      email: 'sidorov@school.com',
      password: await bcrypt.hash('teacher123', 10),
      role: 'TEACHER',
    },
  });

  console.log('✅ Users created');

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: 'Математика' },
      update: {},
      create: { name: 'Математика' },
    }),
    prisma.subject.upsert({
      where: { name: 'Русский язык' },
      update: {},
      create: { name: 'Русский язык' },
    }),
    prisma.subject.upsert({
      where: { name: 'Физика' },
      update: {},
      create: { name: 'Физика' },
    }),
    prisma.subject.upsert({
      where: { name: 'Химия' },
      update: {},
      create: { name: 'Химия' },
    }),
    prisma.subject.upsert({
      where: { name: 'История' },
      update: {},
      create: { name: 'История' },
    }),
    prisma.subject.upsert({
      where: { name: 'Литература' },
      update: {},
      create: { name: 'Литература' },
    }),
  ]);

  console.log('✅ Subjects created');

  // Create classrooms
  const classrooms = await Promise.all([
    prisma.classroom.upsert({
      where: { number: '101' },
      update: {},
      create: { number: '101', capacity: 30 },
    }),
    prisma.classroom.upsert({
      where: { number: '102' },
      update: {},
      create: { number: '102', capacity: 30 },
    }),
    prisma.classroom.upsert({
      where: { number: '201' },
      update: {},
      create: { number: '201', capacity: 25 },
    }),
    prisma.classroom.upsert({
      where: { number: '202' },
      update: {},
      create: { number: '202', capacity: 25 },
    }),
    prisma.classroom.upsert({
      where: { number: '103' },
      update: {},
      create: { number: '103', capacity: 30 },
    }),
  ]);

  console.log('✅ Classrooms created');

  // Create teachers
  const teachers = await Promise.all([
    prisma.teacher.upsert({
      where: { email: 'ivanova@school.com' },
      update: {},
      create: {
        name: 'Иванова Анна Ивановна',
        email: 'ivanova@school.com',
        subjects: ['Математика', 'Алгебра'],
        userId: teacherUser1.id,
      },
    }),
    prisma.teacher.upsert({
      where: { email: 'petrova@school.com' },
      update: {},
      create: {
        name: 'Петрова Мария Владимировна',
        email: 'petrova@school.com',
        subjects: ['Русский язык', 'Литература'],
        userId: teacherUser2.id,
      },
    }),
    prisma.teacher.upsert({
      where: { email: 'sidorov@school.com' },
      update: {},
      create: {
        name: 'Сидоров Петр Константинович',
        email: 'sidorov@school.com',
        subjects: ['Физика', 'Химия'],
        userId: teacherUser3.id,
      },
    }),
  ]);

  console.log('✅ Teachers created');

  // Create classes
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { name: '10А' },
      update: {},
      create: { name: '10А', grade: 10, students: 25 },
    }),
    prisma.class.upsert({
      where: { name: '10Б' },
      update: {},
      create: { name: '10Б', grade: 10, students: 23 },
    }),
    prisma.class.upsert({
      where: { name: '11А' },
      update: {},
      create: { name: '11А', grade: 11, students: 27 },
    }),
    prisma.class.upsert({
      where: { name: '11Б' },
      update: {},
      create: { name: '11Б', grade: 11, students: 24 },
    }),
  ]);

  console.log('✅ Classes created');

  // Create lessons
  const lessons = await Promise.all([
    // Monday lessons
    prisma.lesson.create({
      data: {
        startTime: '08:00',
        endTime: '08:45',
        dayOfWeek: 1, // Monday
        weekNumber: 1,
        teacherId: teachers[0].id,
        classId: classes[0].id,
        subjectId: subjects[0].id,
        classroomId: classrooms[0].id,
      },
    }),
    prisma.lesson.create({
      data: {
        startTime: '08:45',
        endTime: '09:30',
        dayOfWeek: 1,
        weekNumber: 1,
        teacherId: teachers[1].id,
        classId: classes[0].id,
        subjectId: subjects[1].id,
        classroomId: classrooms[1].id,
      },
    }),
    prisma.lesson.create({
      data: {
        startTime: '10:15',
        endTime: '11:00',
        dayOfWeek: 1,
        weekNumber: 1,
        teacherId: teachers[2].id,
        classId: classes[0].id,
        subjectId: subjects[2].id,
        classroomId: classrooms[2].id,
      },
    }),
    // Tuesday lessons
    prisma.lesson.create({
      data: {
        startTime: '08:00',
        endTime: '08:45',
        dayOfWeek: 2, // Tuesday
        weekNumber: 1,
        teacherId: teachers[1].id,
        classId: classes[1].id,
        subjectId: subjects[1].id,
        classroomId: classrooms[1].id,
      },
    }),
    prisma.lesson.create({
      data: {
        startTime: '08:45',
        endTime: '09:30',
        dayOfWeek: 2,
        weekNumber: 1,
        teacherId: teachers[0].id,
        classId: classes[1].id,
        subjectId: subjects[0].id,
        classroomId: classrooms[0].id,
      },
    }),
  ]);

  console.log('✅ Lessons created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
