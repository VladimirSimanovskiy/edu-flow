import { PrismaClient } from '@prisma/client';
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

  const teacherUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ivanova@school.com' },
      update: {},
      create: {
        email: 'ivanova@school.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'TEACHER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'petrova@school.com' },
      update: {},
      create: {
        email: 'petrova@school.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'TEACHER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sidorov@school.com' },
      update: {},
      create: {
        email: 'sidorov@school.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'TEACHER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'kozlov@school.com' },
      update: {},
      create: {
        email: 'kozlov@school.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'TEACHER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'morozova@school.com' },
      update: {},
      create: {
        email: 'morozova@school.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'TEACHER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'volkov@school.com' },
      update: {},
      create: {
        email: 'volkov@school.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'TEACHER',
      },
    }),
  ]);


  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: 'Математика' },
      update: {},
      create: { 
        name: 'Математика',
        code: 'MATH',
        description: 'Алгебра и геометрия'
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Русский язык' },
      update: {},
      create: { 
        name: 'Русский язык',
        code: 'RUS',
        description: 'Русский язык и литература'
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Физика' },
      update: {},
      create: { 
        name: 'Физика',
        code: 'PHYS',
        description: 'Физика и астрономия'
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Химия' },
      update: {},
      create: { 
        name: 'Химия',
        code: 'CHEM',
        description: 'Химия и биология'
      },
    }),
    prisma.subject.upsert({
      where: { name: 'История' },
      update: {},
      create: { 
        name: 'История',
        code: 'HIST',
        description: 'История России и мира'
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Английский язык' },
      update: {},
      create: { 
        name: 'Английский язык',
        code: 'ENG',
        description: 'Иностранный язык'
      },
    }),
  ]);


  // Create classrooms
  const classrooms = await Promise.all([
    prisma.classroom.upsert({
      where: { number: 101 },
      update: {},
      create: { number: 101, floor: 1 },
    }),
    prisma.classroom.upsert({
      where: { number: 102 },
      update: {},
      create: { number: 102, floor: 1 },
    }),
    prisma.classroom.upsert({
      where: { number: 201 },
      update: {},
      create: { number: 201, floor: 2 },
    }),
    prisma.classroom.upsert({
      where: { number: 202 },
      update: {},
      create: { number: 202, floor: 2 },
    }),
    prisma.classroom.upsert({
      where: { number: 103 },
      update: {},
      create: { number: 103, floor: 1 },
    }),
    prisma.classroom.upsert({
      where: { number: 203 },
      update: {},
      create: { number: 203, floor: 2 },
    }),
  ]);


  // Create teachers
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        firstName: 'Анна',
        lastName: 'Иванова',
        middleName: 'Ивановна',
        email: 'ivanova@school.com',
        phone: '+7-900-123-45-67',
        isActive: true,
        idAssignedClassroom: classrooms[0].id,
      },
    }),
    prisma.teacher.create({
      data: {
        firstName: 'Мария',
        lastName: 'Петрова',
        middleName: 'Владимировна',
        email: 'petrova@school.com',
        phone: '+7-900-123-45-68',
        isActive: true,
        idAssignedClassroom: classrooms[1].id,
      },
    }),
    prisma.teacher.create({
      data: {
        firstName: 'Петр',
        lastName: 'Сидоров',
        middleName: 'Константинович',
        email: 'sidorov@school.com',
        phone: '+7-900-123-45-69',
        isActive: true,
        idAssignedClassroom: classrooms[2].id,
      },
    }),
    prisma.teacher.create({
      data: {
        firstName: 'Алексей',
        lastName: 'Козлов',
        middleName: 'Сергеевич',
        email: 'kozlov@school.com',
        phone: '+7-900-123-45-70',
        isActive: true,
        idAssignedClassroom: classrooms[3].id,
      },
    }),
    prisma.teacher.create({
      data: {
        firstName: 'Елена',
        lastName: 'Морозова',
        middleName: 'Александровна',
        email: 'morozova@school.com',
        phone: '+7-900-123-45-71',
        isActive: true,
        idAssignedClassroom: classrooms[4].id,
      },
    }),
    prisma.teacher.create({
      data: {
        firstName: 'Дмитрий',
        lastName: 'Волков',
        middleName: 'Николаевич',
        email: 'volkov@school.com',
        phone: '+7-900-123-45-72',
        isActive: true,
        idAssignedClassroom: classrooms[5].id,
      },
    }),
  ]);


  // Create teacher-subject relationships
  await Promise.all([
    prisma.teacherSubject.upsert({
      where: { idTeacher_idSubject: { idTeacher: teachers[0].id, idSubject: subjects[0].id } },
      update: {},
      create: { idTeacher: teachers[0].id, idSubject: subjects[0].id },
    }),
    prisma.teacherSubject.upsert({
      where: { idTeacher_idSubject: { idTeacher: teachers[1].id, idSubject: subjects[1].id } },
      update: {},
      create: { idTeacher: teachers[1].id, idSubject: subjects[1].id },
    }),
    prisma.teacherSubject.upsert({
      where: { idTeacher_idSubject: { idTeacher: teachers[2].id, idSubject: subjects[2].id } },
      update: {},
      create: { idTeacher: teachers[2].id, idSubject: subjects[2].id },
    }),
    prisma.teacherSubject.upsert({
      where: { idTeacher_idSubject: { idTeacher: teachers[3].id, idSubject: subjects[3].id } },
      update: {},
      create: { idTeacher: teachers[3].id, idSubject: subjects[3].id },
    }),
    prisma.teacherSubject.upsert({
      where: { idTeacher_idSubject: { idTeacher: teachers[4].id, idSubject: subjects[4].id } },
      update: {},
      create: { idTeacher: teachers[4].id, idSubject: subjects[4].id },
    }),
    prisma.teacherSubject.upsert({
      where: { idTeacher_idSubject: { idTeacher: teachers[5].id, idSubject: subjects[5].id } },
      update: {},
      create: { idTeacher: teachers[5].id, idSubject: subjects[5].id },
    }),
  ]);


  // Create classes
  const classes = await Promise.all([
    prisma.class.create({
      data: { 
        grade: 10, 
        letter: 'А',
        idClassLeaderTeacher: teachers[0].id,
      },
    }),
    prisma.class.create({
      data: { 
        grade: 10, 
        letter: 'Б',
        idClassLeaderTeacher: teachers[1].id,
      },
    }),
    prisma.class.create({
      data: { 
        grade: 11, 
        letter: 'А',
        idClassLeaderTeacher: teachers[2].id,
      },
    }),
    prisma.class.create({
      data: { 
        grade: 11, 
        letter: 'Б',
        idClassLeaderTeacher: teachers[3].id,
      },
    }),
  ]);


  // Create lesson schedule (6 lessons per day)
  const lessonSchedules = await Promise.all([
    prisma.lessonSchedule.create({
      data: {
        lessonNumber: 1,
        timeBegin: new Date('1970-01-01T08:00:00Z'),
        timeEnd: new Date('1970-01-01T08:45:00Z'),
      },
    }),
    prisma.lessonSchedule.create({
      data: {
        lessonNumber: 2,
        timeBegin: new Date('1970-01-01T08:55:00Z'),
        timeEnd: new Date('1970-01-01T09:40:00Z'),
      },
    }),
    prisma.lessonSchedule.create({
      data: {
        lessonNumber: 3,
        timeBegin: new Date('1970-01-01T10:00:00Z'),
        timeEnd: new Date('1970-01-01T10:45:00Z'),
      },
    }),
    prisma.lessonSchedule.create({
      data: {
        lessonNumber: 4,
        timeBegin: new Date('1970-01-01T10:55:00Z'),
        timeEnd: new Date('1970-01-01T11:40:00Z'),
      },
    }),
    prisma.lessonSchedule.create({
      data: {
        lessonNumber: 5,
        timeBegin: new Date('1970-01-01T12:00:00Z'),
        timeEnd: new Date('1970-01-01T12:45:00Z'),
      },
    }),
    prisma.lessonSchedule.create({
      data: {
        lessonNumber: 6,
        timeBegin: new Date('1970-01-01T12:55:00Z'),
        timeEnd: new Date('1970-01-01T13:40:00Z'),
      },
    }),
  ]);


  // Create schedule version
  const scheduleVersion = await prisma.scheduleVersion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      dateBegin: new Date('2024-09-01'),
      dateEnd: new Date('2026-12-31'),
      description: 'Расписание 2024-2026',
    },
  });


  // Create lessons for each class (6 lessons per day, 5 days per week)
  const lessons = [];
  
  for (const classItem of classes) {
    for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
      for (let lessonNumber = 1; lessonNumber <= 6; lessonNumber++) {
        const subjectIndex = (lessonNumber - 1) % subjects.length;
        // Используем комбинацию класса, дня и номера урока для распределения учителей
        // Это предотвращает назначение одного учителя на несколько уроков одновременно
        const teacherIndex = (classItem.id + dayOfWeek + lessonNumber) % teachers.length;
        const classroomIndex = ((lessonNumber - 1) + classItem.id + dayOfWeek) % classrooms.length;
        
        const lesson = await prisma.lesson.create({
          data: {
            dayOfWeek,
            idTeacher: teachers[teacherIndex].id,
            idClass: classItem.id,
            idSubject: subjects[subjectIndex].id,
            idClassroom: classrooms[classroomIndex].id,
            idLessonSchedule: lessonSchedules[lessonNumber - 1].id,
            idScheduleVersion: scheduleVersion.id,
          },
        });
        
        lessons.push(lesson);
      }
    }
  }


  // Create some students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        firstName: 'Иван',
        lastName: 'Петров',
        middleName: 'Сергеевич',
        email: 'ivan.petrov@student.com',
        phone: '+7-900-200-01-01',
        enrollmentDate: new Date('2024-09-01'),
        dateBirth: new Date('2007-05-15'),
        isActive: true,
      },
    }),
    prisma.student.create({
      data: {
        firstName: 'Мария',
        lastName: 'Сидорова',
        middleName: 'Александровна',
        email: 'maria.sidorova@student.com',
        phone: '+7-900-200-01-02',
        enrollmentDate: new Date('2024-09-01'),
        dateBirth: new Date('2007-08-22'),
        isActive: true,
      },
    }),
    prisma.student.create({
      data: {
        firstName: 'Алексей',
        lastName: 'Козлов',
        middleName: 'Дмитриевич',
        email: 'alexey.kozlov@student.com',
        phone: '+7-900-200-01-03',
        enrollmentDate: new Date('2024-09-01'),
        dateBirth: new Date('2006-12-10'),
        isActive: true,
      },
    }),
    prisma.student.create({
      data: {
        firstName: 'Елена',
        lastName: 'Морозова',
        middleName: 'Владимировна',
        email: 'elena.morozova@student.com',
        phone: '+7-900-200-01-04',
        enrollmentDate: new Date('2024-09-01'),
        dateBirth: new Date('2006-03-18'),
        isActive: true,
      },
    }),
  ]);


  // Create student class history
  await Promise.all([
    prisma.studentClassHistory.create({
      data: {
        idStudent: students[0].id,
        idClass: classes[0].id,
        dateBegin: new Date('2024-09-01'),
      },
    }),
    prisma.studentClassHistory.create({
      data: {
        idStudent: students[1].id,
        idClass: classes[0].id,
        dateBegin: new Date('2024-09-01'),
      },
    }),
    prisma.studentClassHistory.create({
      data: {
        idStudent: students[2].id,
        idClass: classes[2].id,
        dateBegin: new Date('2024-09-01'),
      },
    }),
    prisma.studentClassHistory.create({
      data: {
        idStudent: students[3].id,
        idClass: classes[2].id,
        dateBegin: new Date('2024-09-01'),
      },
    }),
  ]);


  // Create sample substitutions on specific dates
  const substitutionDate1 = new Date('2025-09-19'); // Friday
  const substitutionDate2 = new Date('2025-09-22'); // Monday

  // Helper to pick a different teacher/classroom
  const pickDifferentTeacher = (currentTeacherId: number) => {
    const alt = teachers.find((t) => t.id !== currentTeacherId);
    return alt ? alt.id : teachers[0].id;
  };

  const pickDifferentClassroom = (currentClassroomId: number) => {
    const alt = classrooms.find((c) => c.id !== currentClassroomId);
    return alt ? alt.id : classrooms[0].id;
  };

  // Two substitutions for Friday (Sep 19) for first class
  const fridayLessons = await prisma.lesson.findMany({
    where: {
      dayOfWeek: 5,
      idClass: classes[0].id,
      idScheduleVersion: scheduleVersion.id,
    },
    orderBy: { lessonSchedule: { lessonNumber: 'asc' } },
    take: 2,
  });

  for (const lesson of fridayLessons) {
    await prisma.substitution.upsert({
      where: {
        idLesson_date: { idLesson: lesson.id, date: substitutionDate1 },
      },
      update: {},
      create: {
        date: substitutionDate1,
        idLesson: lesson.id,
        idTeacher: pickDifferentTeacher(lesson.idTeacher),
        idClassroom: pickDifferentClassroom(lesson.idClassroom),
      },
    });
  }

  // Two substitutions for Monday (Sep 22) for second class
  const mondayLessons = await prisma.lesson.findMany({
    where: {
      dayOfWeek: 1,
      idClass: classes[1].id,
      idScheduleVersion: scheduleVersion.id,
    },
    orderBy: { lessonSchedule: { lessonNumber: 'asc' } },
    take: 2,
  });

  for (const lesson of mondayLessons) {
    await prisma.substitution.upsert({
      where: {
        idLesson_date: { idLesson: lesson.id, date: substitutionDate2 },
      },
      update: {},
      create: {
        date: substitutionDate2,
        idLesson: lesson.id,
        idTeacher: pickDifferentTeacher(lesson.idTeacher),
        idClassroom: pickDifferentClassroom(lesson.idClassroom),
      },
    });
  }


  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${1 + teacherUsers.length}`);
  console.log(`   - Teachers: ${teachers.length}`);
  console.log(`   - Classes: ${classes.length}`);
  console.log(`   - Subjects: ${subjects.length}`);
  console.log(`   - Classrooms: ${classrooms.length}`);
  console.log(`   - Lesson schedules: ${lessonSchedules.length}`);
  console.log(`   - Lessons: ${lessons.length} (${classes.length} classes × 5 days × 6 lessons)`);
  console.log(`   - Students: ${students.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });