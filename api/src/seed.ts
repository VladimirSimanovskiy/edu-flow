import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seeding...");

	// Create users
	const adminUser = await prisma.user.upsert({
		where: { email: "admin@school.com" },
		update: {},
		create: {
			email: "admin@school.com",
			password: await bcrypt.hash("admin123", 10),
			role: "ADMIN",
		},
	});

	const teacherUsers = await Promise.all([
		prisma.user.upsert({
			where: { email: "ivanova@school.com" },
			update: {},
			create: {
				email: "ivanova@school.com",
				password: await bcrypt.hash("teacher123", 10),
				role: "TEACHER",
			},
		}),
		prisma.user.upsert({
			where: { email: "petrova@school.com" },
			update: {},
			create: {
				email: "petrova@school.com",
				password: await bcrypt.hash("teacher123", 10),
				role: "TEACHER",
			},
		}),
		prisma.user.upsert({
			where: { email: "sidorov@school.com" },
			update: {},
			create: {
				email: "sidorov@school.com",
				password: await bcrypt.hash("teacher123", 10),
				role: "TEACHER",
			},
		}),
		prisma.user.upsert({
			where: { email: "kozlov@school.com" },
			update: {},
			create: {
				email: "kozlov@school.com",
				password: await bcrypt.hash("teacher123", 10),
				role: "TEACHER",
			},
		}),
		prisma.user.upsert({
			where: { email: "morozova@school.com" },
			update: {},
			create: {
				email: "morozova@school.com",
				password: await bcrypt.hash("teacher123", 10),
				role: "TEACHER",
			},
		}),
		prisma.user.upsert({
			where: { email: "volkov@school.com" },
			update: {},
			create: {
				email: "volkov@school.com",
				password: await bcrypt.hash("teacher123", 10),
				role: "TEACHER",
			},
		}),
	]);

	// Create subjects
	const subjects = await Promise.all([
		prisma.subject.upsert({
			where: { name: "Математика" },
			update: {},
			create: {
				name: "Математика",
				code: "MATH",
				description: "Алгебра и геометрия",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Русский язык" },
			update: {},
			create: {
				name: "Русский язык",
				code: "RUS",
				description: "Русский язык и литература",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Литература" },
			update: {},
			create: {
				name: "Литература",
				code: "LIT",
				description: "Литература",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Физика" },
			update: {},
			create: {
				name: "Физика",
				code: "PHYS",
				description: "Физика и астрономия",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Химия" },
			update: {},
			create: {
				name: "Химия",
				code: "CHEM",
				description: "Химия и биология",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Биология" },
			update: {},
			create: {
				name: "Биология",
				code: "BIOL",
				description: "Биология",
			},
		}),
		prisma.subject.upsert({
			where: { name: "История" },
			update: {},
			create: {
				name: "История",
				code: "HIST",
				description: "История России и мира",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Обществознание" },
			update: {},
			create: {
				name: "Обществознание",
				code: "SOC",
				description: "Обществознание",
			},
		}),
		prisma.subject.upsert({
			where: { name: "География" },
			update: {},
			create: {
				name: "География",
				code: "GEOG",
				description: "География",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Английский язык" },
			update: {},
			create: {
				name: "Английский язык",
				code: "ENG",
				description: "Иностранный язык",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Информатика" },
			update: {},
			create: {
				name: "Информатика",
				code: "INF",
				description: "Информатика и ИКТ",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Алгебра" },
			update: {},
			create: {
				name: "Алгебра",
				code: "ALG",
				description: "Алгебра",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Геометрия" },
			update: {},
			create: {
				name: "Геометрия",
				code: "GEO",
				description: "Геометрия",
			},
		}),
		prisma.subject.upsert({
			where: { name: "ИЗО" },
			update: {},
			create: {
				name: "ИЗО",
				code: "IZO",
				description: "Искусство",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Музыка" },
			update: {},
			create: {
				name: "Музыка",
				code: "MUS",
				description: "Музыка",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Физкультура" },
			update: {},
			create: {
				name: "Физкультура",
				code: "PE",
				description: "Физическая культура",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Технология" },
			update: {},
			create: {
				name: "Технология",
				code: "TECH",
				description: "Технология",
			},
		}),
		prisma.subject.upsert({
			where: { name: "ОДНКНР" },
			update: {},
			create: {
				name: "ОДНКНР",
				code: "ODN",
				description: "Основы духовно-нравственной культуры",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Индивидуальный проект" },
			update: {},
			create: {
				name: "Индивидуальный проект",
				code: "IPRJ",
				description: "Индивидуальный проект",
			},
		}),
		prisma.subject.upsert({
			where: { name: "Электив" },
			update: {},
			create: {
				name: "Электив",
				code: "ELC",
				description: "Элективный курс",
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
		// Additional classrooms for better distribution
		prisma.classroom.upsert({
			where: { number: 104 },
			update: {},
			create: { number: 104, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 105 },
			update: {},
			create: { number: 105, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 106 },
			update: {},
			create: { number: 106, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 107 },
			update: {},
			create: { number: 107, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 108 },
			update: {},
			create: { number: 108, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 109 },
			update: {},
			create: { number: 109, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 115 },
			update: {},
			create: { number: 115, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 116 },
			update: {},
			create: { number: 116, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 117 },
			update: {},
			create: { number: 117, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 118 },
			update: {},
			create: { number: 118, floor: 1 },
		}),
		prisma.classroom.upsert({
			where: { number: 220 },
			update: {},
			create: { number: 220, floor: 2 },
		}),
		prisma.classroom.upsert({
			where: { number: 301 },
			update: {},
			create: { number: 301, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 302 },
			update: {},
			create: { number: 302, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 303 },
			update: {},
			create: { number: 303, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 305 },
			update: {},
			create: { number: 305, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 316 },
			update: {},
			create: { number: 316, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 318 },
			update: {},
			create: { number: 318, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 319 },
			update: {},
			create: { number: 319, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 320 },
			update: {},
			create: { number: 320, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 321 },
			update: {},
			create: { number: 321, floor: 3 },
		}),
		prisma.classroom.upsert({
			where: { number: 324 },
			update: {},
			create: { number: 324, floor: 3 },
		}),
	]);

	// Create teachers (expanded list)
	const teachers = await Promise.all([
		prisma.teacher.create({
			data: {
				firstName: "Анна",
				lastName: "Иванова",
				middleName: "Ивановна",
				email: "ivanova@school.com",
				phone: "+7-900-123-45-67",
				isActive: true,
				idAssignedClassroom: classrooms[0].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Мария",
				lastName: "Петрова",
				middleName: "Владимировна",
				email: "petrova@school.com",
				phone: "+7-900-123-45-68",
				isActive: true,
				idAssignedClassroom: classrooms[1].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Петр",
				lastName: "Сидоров",
				middleName: "Константинович",
				email: "sidorov@school.com",
				phone: "+7-900-123-45-69",
				isActive: true,
				idAssignedClassroom: classrooms[2].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Алексей",
				lastName: "Козлов",
				middleName: "Сергеевич",
				email: "kozlov@school.com",
				phone: "+7-900-123-45-70",
				isActive: true,
				idAssignedClassroom: classrooms[3].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Елена",
				lastName: "Морозова",
				middleName: "Александровна",
				email: "morozova@school.com",
				phone: "+7-900-123-45-71",
				isActive: true,
				idAssignedClassroom: classrooms[4].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Дмитрий",
				lastName: "Волков",
				middleName: "Николаевич",
				email: "volkov@school.com",
				phone: "+7-900-123-45-72",
				isActive: true,
				idAssignedClassroom: classrooms[5].id,
			},
		}),
		// Дополнительные учителя
		prisma.teacher.create({
			data: {
				firstName: "Светлана",
				lastName: "Кузнецова",
				email: "kuznetsova@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[0].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Игорь",
				lastName: "Новиков",
				email: "novikov@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[1].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Татьяна",
				lastName: "Соколова",
				email: "sokolova@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[2].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Владимир",
				lastName: "Михайлов",
				email: "mikhailov@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[3].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Ольга",
				lastName: "Федорова",
				email: "fedorova@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[4].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Николай",
				lastName: "Смирнов",
				email: "smirnov@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[5].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Галина",
				lastName: "Васильева",
				email: "vasilieva@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[0].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Сергей",
				lastName: "Павлов",
				email: "pavlov@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[1].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Наталья",
				lastName: "Макарова",
				email: "makarova@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[2].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Андрей",
				lastName: "Попов",
				email: "popov@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[3].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Полина",
				lastName: "Семенова",
				email: "semenova@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[4].id,
			},
		}),
		prisma.teacher.create({
			data: {
				firstName: "Роман",
				lastName: "Зайцев",
				email: "zaytsev@school.com",
				isActive: true,
				idAssignedClassroom: classrooms[5].id,
			},
		}),
	]);

	// Create teacher-subject relationships (expand to cover more teachers)
	await Promise.all([
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[0].id,
					idSubject: subjects[0].id,
				},
			},
			update: {},
			create: { idTeacher: teachers[0].id, idSubject: subjects[0].id },
		}),
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[1].id,
					idSubject: subjects[1].id,
				},
			},
			update: {},
			create: { idTeacher: teachers[1].id, idSubject: subjects[1].id },
		}),
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[2].id,
					idSubject: subjects[2].id,
				},
			},
			update: {},
			create: { idTeacher: teachers[2].id, idSubject: subjects[2].id },
		}),
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[3].id,
					idSubject: subjects[3].id,
				},
			},
			update: {},
			create: { idTeacher: teachers[3].id, idSubject: subjects[3].id },
		}),
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[4].id,
					idSubject: subjects[4].id,
				},
			},
			update: {},
			create: { idTeacher: teachers[4].id, idSubject: subjects[4].id },
		}),
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[5].id,
					idSubject: subjects[5].id,
				},
			},
			update: {},
			create: { idTeacher: teachers[5].id, idSubject: subjects[5].id },
		}),
		// Дополнительные связи для групповых занятий
		// Второй преподаватель английского
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[4].id,
					idSubject: subjects.find((s) => s.code === "ENG")!.id,
				},
			},
			update: {},
			create: {
				idTeacher: teachers[4].id,
				idSubject: subjects.find((s) => s.code === "ENG")!.id,
			},
		}),
		// Преподаватели информатики
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[2].id,
					idSubject: subjects.find((s) => s.code === "INF")!.id,
				},
			},
			update: {},
			create: {
				idTeacher: teachers[2].id,
				idSubject: subjects.find((s) => s.code === "INF")!.id,
			},
		}),
		prisma.teacherSubject.upsert({
			where: {
				idTeacher_idSubject: {
					idTeacher: teachers[3].id,
					idSubject: subjects.find((s) => s.code === "INF")!.id,
				},
			},
			update: {},
			create: {
				idTeacher: teachers[3].id,
				idSubject: subjects.find((s) => s.code === "INF")!.id,
			},
		}),
		// Расширение покрытия предметов для новых учителей
		// Алгебра/Геометрия
		...[
			{ teacher: 6, subjCode: "ALG" },
			{ teacher: 6, subjCode: "GEO" },
			{ teacher: 7, subjCode: "MATH" },
			{ teacher: 7, subjCode: "ALG" },
			{ teacher: 8, subjCode: "GEO" },
			{ teacher: 9, subjCode: "RUS" },
			{ teacher: 10, subjCode: "LIT" },
			{ teacher: 11, subjCode: "PHYS" },
			{ teacher: 12, subjCode: "CHEM" },
			{ teacher: 6, subjCode: "SOC" },
			{ teacher: 7, subjCode: "GEOG" },
			{ teacher: 8, subjCode: "BIOL" },
			{ teacher: 9, subjCode: "IZO" },
			{ teacher: 10, subjCode: "MUS" },
			{ teacher: 11, subjCode: "PE" },
			{ teacher: 12, subjCode: "ODN" },
		].map(({ teacher, subjCode }) =>
			prisma.teacherSubject.upsert({
				where: {
					idTeacher_idSubject: {
						idTeacher: teachers[teacher].id,
						idSubject: subjects.find((s) => s.code === subjCode)!
							.id,
					},
				},
				update: {},
				create: {
					idTeacher: teachers[teacher].id,
					idSubject: subjects.find((s) => s.code === subjCode)!.id,
				},
			})
		),
	]);

	// Create classes
	const classes = await Promise.all([
		prisma.class.create({
			data: {
				grade: 10,
				letter: "А",
				idClassLeaderTeacher: teachers[0].id,
			},
		}),
		prisma.class.create({
			data: {
				grade: 10,
				letter: "Б",
				idClassLeaderTeacher: teachers[1].id,
			},
		}),
		prisma.class.create({
			data: {
				grade: 11,
				letter: "А",
				idClassLeaderTeacher: teachers[2].id,
			},
		}),
		prisma.class.create({
			data: {
				grade: 11,
				letter: "Б",
				idClassLeaderTeacher: teachers[3].id,
			},
		}),
	]);

	// Create lesson schedule (6 lessons per day)
	const lessonSchedules = await Promise.all([
		prisma.lessonSchedule.create({
			data: {
				lessonNumber: 1,
				timeBegin: new Date("1970-01-01T08:00:00Z"),
				timeEnd: new Date("1970-01-01T08:45:00Z"),
			},
		}),
		prisma.lessonSchedule.create({
			data: {
				lessonNumber: 2,
				timeBegin: new Date("1970-01-01T08:55:00Z"),
				timeEnd: new Date("1970-01-01T09:40:00Z"),
			},
		}),
		prisma.lessonSchedule.create({
			data: {
				lessonNumber: 3,
				timeBegin: new Date("1970-01-01T10:00:00Z"),
				timeEnd: new Date("1970-01-01T10:45:00Z"),
			},
		}),
		prisma.lessonSchedule.create({
			data: {
				lessonNumber: 4,
				timeBegin: new Date("1970-01-01T10:55:00Z"),
				timeEnd: new Date("1970-01-01T11:40:00Z"),
			},
		}),
		prisma.lessonSchedule.create({
			data: {
				lessonNumber: 5,
				timeBegin: new Date("1970-01-01T12:00:00Z"),
				timeEnd: new Date("1970-01-01T12:45:00Z"),
			},
		}),
		prisma.lessonSchedule.create({
			data: {
				lessonNumber: 6,
				timeBegin: new Date("1970-01-01T12:55:00Z"),
				timeEnd: new Date("1970-01-01T13:40:00Z"),
			},
		}),
	]);

	// Create schedule version
	const scheduleVersion = await prisma.scheduleVersion.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			dateBegin: new Date("2024-09-01"),
			dateEnd: new Date("2026-12-31"),
			description: "Расписание 2024-2026",
		},
	});

	// Полная очистка зависимых данных (идемпотентность сидера)
	const delSubs = await prisma.substitution.deleteMany({});
	const delLessons = await prisma.lesson.deleteMany({});
	const delMemberships = await prisma.classGroupMembership.deleteMany({});
	const delGroups = await prisma.classGroup.deleteMany({});
	console.log(
		`🧹 Cleared: substitutions=${delSubs.count}, lessons=${delLessons.count}, groupMemberships=${delMemberships.count}, groups=${delGroups.count}`
	);

	// Подготовка: занятость учителей и кабинетов, зарезервированные слоты под группы
	const teacherBusy = new Set<string>(); // `${teacherId}:${day}:${lessonNumber}`
	const classroomBusy = new Set<string>(); // `${classroomId}:${day}:${lessonNumber}`
	const slotKey = (day: number, num: number) => `${day}:${num}`;

	// Распределим групповые слоты по классам, чтобы избежать конфликтов учителей
	const reservedSlotsByClass = new Map<
		number,
		{ ENG: [number, number]; INF: [number, number]; ELC: [number, number] }
	>();
	classes.forEach((c, idx) => {
		// Варьируем дни для разных классов
		const engDay = ((idx + 0) % 5) + 1; // 1..5
		const infDay = ((idx + 2) % 5) + 1;
		const elcDay = ((idx + 4) % 5) + 1;
		reservedSlotsByClass.set(c.id, {
			ENG: [engDay, 2], // 2-й урок
			INF: [infDay, 4], // 4-й урок
			ELC: [elcDay, 6], // 6-й урок
		});
	});

	// Create lessons with conflict checks (6 per day), excluding group subjects from base
	const lessons = [];
	const groupSubjectCodes = ["ENG", "INF", "ELC"] as const;
	const nonGroupSubjects = subjects.filter(
		(s) => !groupSubjectCodes.includes(s.code as any) && s.code !== "TECH"
	); // исключаем Технологию

	// Пытаемся подобрать учителя/кабинет без конфликтов для каждого слота
	const pickFreeTeacher = (
		day: number,
		num: number,
		subjectId: number
	): number => {
		for (const t of teachers) {
			const key = `${t.id}:${day}:${num}`;
			if (!teacherBusy.has(key)) {
				// Дополнительно: учитель должен иметь предмет, если прописано в teacherSubject
				// Упростим: разрешаем любого активного
				return t.id;
			}
		}
		return teachers[0].id;
	};
	const pickFreeClassroom = (day: number, num: number): number => {
		for (const c of classrooms) {
			const key = `${c.id}:${day}:${num}`;
			if (!classroomBusy.has(key)) return c.id;
		}
		return classrooms[0].id;
	};

	for (const classItem of classes) {
		const reserved = reservedSlotsByClass.get(classItem.id)!;
		for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
			for (let lessonNumber = 1; lessonNumber <= 6; lessonNumber++) {
				// Пропускаем зарезервированные слоты под группы
				const isReserved =
					(reserved.ENG[0] === dayOfWeek &&
						reserved.ENG[1] === lessonNumber) ||
					(reserved.INF[0] === dayOfWeek &&
						reserved.INF[1] === lessonNumber) ||
					(reserved.ELC[0] === dayOfWeek &&
						reserved.ELC[1] === lessonNumber);
				if (isReserved) continue;

				const subject =
					nonGroupSubjects[
						(classItem.id + dayOfWeek + lessonNumber) %
							nonGroupSubjects.length
					];
				const teacherId = pickFreeTeacher(
					dayOfWeek,
					lessonNumber,
					subject.id
				);
				const classroomId = pickFreeClassroom(dayOfWeek, lessonNumber);
				const busyTKey = `${teacherId}:${dayOfWeek}:${lessonNumber}`;
				const busyCKey = `${classroomId}:${dayOfWeek}:${lessonNumber}`;
				if (teacherBusy.has(busyTKey) || classroomBusy.has(busyCKey))
					continue;

				const lesson = await prisma.lesson.create({
					data: {
						dayOfWeek,
						idTeacher: teacherId,
						idClass: classItem.id,
						idSubject: subject.id,
						idClassroom: classroomId,
						idLessonSchedule: lessonSchedules[lessonNumber - 1].id,
						idScheduleVersion: scheduleVersion.id,
					},
				});
				teacherBusy.add(busyTKey);
				classroomBusy.add(busyCKey);
				lessons.push(lesson);
			}
		}
	}

	// Создаем группы по английскому, информатике и элективу и групповые занятия
	const engSubject = subjects.find((s) => s.code === "ENG")!;
	const infSubject = subjects.find((s) => s.code === "INF")!;
	const elcSubject = subjects.find((s) => s.code === "ELC")!;

	for (const classItem of classes) {
		// Создаем по две группы на предмет
		const engGroup1 = await prisma.classGroup.create({
			data: {
				idClass: classItem.id,
				idSubject: engSubject.id,
				idScheduleVersion: scheduleVersion.id,
				name: "Английский (1)",
			},
		});
		const engGroup2 = await prisma.classGroup.create({
			data: {
				idClass: classItem.id,
				idSubject: engSubject.id,
				idScheduleVersion: scheduleVersion.id,
				name: "Английский (2)",
			},
		});

		const infGroup1 = await prisma.classGroup.create({
			data: {
				idClass: classItem.id,
				idSubject: infSubject.id,
				idScheduleVersion: scheduleVersion.id,
				name: "Информатика (1)",
			},
		});
		const infGroup2 = await prisma.classGroup.create({
			data: {
				idClass: classItem.id,
				idSubject: infSubject.id,
				idScheduleVersion: scheduleVersion.id,
				name: "Информатика (2)",
			},
		});

		// Определяем студентов этого класса (по последнему назначению)
		const classStudents = await prisma.student.findMany({
			where: {
				classHistory: {
					some: {
						idClass: classItem.id,
						dateEnd: null,
					},
				},
			},
		});

		for (let i = 0; i < classStudents.length; i++) {
			const student = classStudents[i];
			const targetEngGroup = i % 2 === 0 ? engGroup1 : engGroup2;
			const targetInfGroup = i % 2 === 0 ? infGroup1 : infGroup2;

			await prisma.classGroupMembership.create({
				data: {
					idClassGroup: targetEngGroup.id,
					idStudent: student.id,
					dateBegin: scheduleVersion.dateBegin,
				},
			});
			await prisma.classGroupMembership.create({
				data: {
					idClassGroup: targetInfGroup.id,
					idStudent: student.id,
					dateBegin: scheduleVersion.dateBegin,
				},
			});
		}

		// Групповые уроки по слотам из reservedSlotsByClass
		const rsv = reservedSlotsByClass.get(classItem.id)!;
		const [engDay, engNum] = rsv.ENG;
		const [infDay, infNum] = rsv.INF;
		const [elcDay, elcNum] = rsv.ELC;
		const engTeacherA = teachers[5];
		const engTeacherB = teachers[4];
		const infTeacherA = teachers[2];
		const infTeacherB = teachers[3];
		const elcTeacherA = teachers[0];
		const elcTeacherB = teachers[1];

		// Английский — две параллельные группы в разных кабинетах
		// ENG две группы параллельно
		await prisma.lesson.create({
			data: {
				dayOfWeek: engDay,
				idTeacher: engTeacherA.id,
				idClass: classItem.id,
				idSubject: engSubject.id,
				idClassroom: classrooms[0].id,
				idLessonSchedule: lessonSchedules[engNum - 1].id,
				idScheduleVersion: scheduleVersion.id,
				idClassGroup: engGroup1.id,
			},
		});
		await prisma.lesson.create({
			data: {
				dayOfWeek: engDay,
				idTeacher: engTeacherB.id,
				idClass: classItem.id,
				idSubject: engSubject.id,
				idClassroom: classrooms[1].id,
				idLessonSchedule: lessonSchedules[engNum - 1].id,
				idScheduleVersion: scheduleVersion.id,
				idClassGroup: engGroup2.id,
			},
		});

		// INF две группы параллельно
		await prisma.lesson.create({
			data: {
				dayOfWeek: infDay,
				idTeacher: infTeacherA.id,
				idClass: classItem.id,
				idSubject: infSubject.id,
				idClassroom: classrooms[2].id,
				idLessonSchedule: lessonSchedules[infNum - 1].id,
				idScheduleVersion: scheduleVersion.id,
				idClassGroup: infGroup1.id,
			},
		});
		await prisma.lesson.create({
			data: {
				dayOfWeek: infDay,
				idTeacher: infTeacherB.id,
				idClass: classItem.id,
				idSubject: infSubject.id,
				idClassroom: classrooms[3].id,
				idLessonSchedule: lessonSchedules[infNum - 1].id,
				idScheduleVersion: scheduleVersion.id,
				idClassGroup: infGroup2.id,
			},
		});

		// Электив — две параллельные группы
		await prisma.lesson.create({
			data: {
				dayOfWeek: elcDay,
				idTeacher: elcTeacherA.id,
				idClass: classItem.id,
				idSubject: elcSubject.id,
				idClassroom: classrooms[4].id,
				idLessonSchedule: lessonSchedules[elcNum - 1].id,
				idScheduleVersion: scheduleVersion.id,
				idClassGroup: engGroup1.id,
			},
		});
		await prisma.lesson.create({
			data: {
				dayOfWeek: elcDay,
				idTeacher: elcTeacherB.id,
				idClass: classItem.id,
				idSubject: elcSubject.id,
				idClassroom: classrooms[5].id,
				idLessonSchedule: lessonSchedules[elcNum - 1].id,
				idScheduleVersion: scheduleVersion.id,
				idClassGroup: engGroup2.id,
			},
		});
	}

	// Create some students
	const students = await Promise.all([
		prisma.student.create({
			data: {
				firstName: "Иван",
				lastName: "Петров",
				middleName: "Сергеевич",
				email: "ivan.petrov@student.com",
				phone: "+7-900-200-01-01",
				enrollmentDate: new Date("2024-09-01"),
				dateBirth: new Date("2007-05-15"),
				isActive: true,
			},
		}),
		prisma.student.create({
			data: {
				firstName: "Мария",
				lastName: "Сидорова",
				middleName: "Александровна",
				email: "maria.sidorova@student.com",
				phone: "+7-900-200-01-02",
				enrollmentDate: new Date("2024-09-01"),
				dateBirth: new Date("2007-08-22"),
				isActive: true,
			},
		}),
		prisma.student.create({
			data: {
				firstName: "Алексей",
				lastName: "Козлов",
				middleName: "Дмитриевич",
				email: "alexey.kozlov@student.com",
				phone: "+7-900-200-01-03",
				enrollmentDate: new Date("2024-09-01"),
				dateBirth: new Date("2006-12-10"),
				isActive: true,
			},
		}),
		prisma.student.create({
			data: {
				firstName: "Елена",
				lastName: "Морозова",
				middleName: "Владимировна",
				email: "elena.morozova@student.com",
				phone: "+7-900-200-01-04",
				enrollmentDate: new Date("2024-09-01"),
				dateBirth: new Date("2006-03-18"),
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
				dateBegin: new Date("2024-09-01"),
			},
		}),
		prisma.studentClassHistory.create({
			data: {
				idStudent: students[1].id,
				idClass: classes[0].id,
				dateBegin: new Date("2024-09-01"),
			},
		}),
		prisma.studentClassHistory.create({
			data: {
				idStudent: students[2].id,
				idClass: classes[2].id,
				dateBegin: new Date("2024-09-01"),
			},
		}),
		prisma.studentClassHistory.create({
			data: {
				idStudent: students[3].id,
				idClass: classes[2].id,
				dateBegin: new Date("2024-09-01"),
			},
		}),
	]);

	// Create sample substitutions on specific dates
	const substitutionDate1 = new Date("2025-09-19"); // Friday
	const substitutionDate2 = new Date("2025-09-22"); // Monday

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
		orderBy: { lessonSchedule: { lessonNumber: "asc" } },
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
		orderBy: { lessonSchedule: { lessonNumber: "asc" } },
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

	console.log("🎉 Database seeding completed successfully!");
	console.log(`📊 Summary:`);
	console.log(`   - Users: ${1 + teacherUsers.length}`);
	console.log(`   - Teachers: ${teachers.length}`);
	console.log(`   - Classes: ${classes.length}`);
	console.log(`   - Subjects: ${subjects.length}`);
	console.log(`   - Classrooms: ${classrooms.length}`);
	console.log(`   - Lesson schedules: ${lessonSchedules.length}`);
	console.log(
		`   - Lessons: ${lessons.length} (${classes.length} classes × 5 days × 6 lessons)`
	);
	console.log(`   - Students: ${students.length}`);
}

main()
	.catch((e) => {
		console.error("❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
