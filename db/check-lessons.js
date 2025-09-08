const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Password1@localhost:5432/edu_flow?schema=public"
    }
  }
});

async function checkLessons() {
  try {
    // Подсчитаем общее количество уроков
    const totalLessons = await prisma.lesson.count();
    console.log(`Общее количество уроков: ${totalLessons}`);

    // Подсчитаем уроки по дням недели
    const lessonsByDay = await prisma.lesson.groupBy({
      by: ['dayOfWeek'],
      _count: {
        id: true
      }
    });

    console.log('\nУроки по дням недели:');
    lessonsByDay.forEach(day => {
      console.log(`День ${day.dayOfWeek}: ${day._count.id} уроков`);
    });

    // Подсчитаем уроки по классам
    const lessonsByClass = await prisma.lesson.groupBy({
      by: ['idClass'],
      _count: {
        id: true
      },
      include: {
        class: true
      }
    });

    console.log('\nУроки по классам:');
    for (const classLesson of lessonsByClass) {
      const classInfo = await prisma.class.findUnique({
        where: { id: classLesson.idClass }
      });
      console.log(`Класс ${classInfo.grade}${classInfo.letter}: ${classLesson._count.id} уроков`);
    }

    // Проверим уроки для конкретного класса в понедельник
    const mondayLessons = await prisma.lesson.findMany({
      where: {
        dayOfWeek: 1,
        idClass: 4 // 10А
      },
      include: {
        class: true,
        subject: true,
        teacher: true,
        lessonSchedule: true
      }
    });

    console.log(`\nУроки для класса 10А в понедельник: ${mondayLessons.length}`);
    mondayLessons.forEach(lesson => {
      console.log(`  ${lesson.lessonSchedule.lessonNumber} урок: ${lesson.subject.name} (${lesson.teacher.firstName} ${lesson.teacher.lastName})`);
    });

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLessons();
