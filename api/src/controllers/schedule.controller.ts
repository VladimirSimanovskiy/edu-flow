import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createError } from "../middleware/errorHandler";
import { LessonFilterService } from "../services/filters";

export class ScheduleController {
	private prisma: PrismaClient;
	private filterService: LessonFilterService;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
		this.filterService = new LessonFilterService();
	}

	/**
	 * Получить всех учителей
	 */
	async getTeachers(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const teachers = await this.prisma.teacher.findMany({
				include: {
					user: true,
					lessons: {
						include: {
							class: true,
							subject: true,
							classroom: true,
							lessonSchedule: true,
							scheduleVersion: true,
						},
					},
					subjects: {
						include: {
							subject: true,
						},
					},
				},
				orderBy: {
					lastName: "asc",
				},
			});

			res.json(teachers);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить все классы
	 */
	async getClasses(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const classes = await this.prisma.class.findMany({
				include: {
					lessons: {
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							subject: true,
							classroom: true,
							lessonSchedule: true,
							scheduleVersion: true,
						},
					},
					classLeader: {
						include: {
							user: true,
						},
					},
				},
				orderBy: [{ grade: "asc" }, { letter: "asc" }],
			});

			res.json(classes);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить все предметы
	 */
	async getSubjects(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const subjects = await this.prisma.subject.findMany({
				include: {
					lessons: {
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							class: true,
							classroom: true,
							lessonSchedule: true,
							scheduleVersion: true,
						},
					},
					teacherSubjects: {
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
						},
					},
				},
				orderBy: {
					name: "asc",
				},
			});

			res.json(subjects);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить все аудитории
	 */
	async getClassrooms(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const classrooms = await this.prisma.classroom.findMany({
				include: {
					lessons: {
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							class: true,
							subject: true,
							lessonSchedule: true,
							scheduleVersion: true,
						},
					},
					assignedTeachers: {
						include: {
							user: true,
						},
					},
				},
				orderBy: {
					number: "asc",
				},
			});

			res.json(classrooms);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить уроки с фильтрами
	 */
	async getLessons(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { where } = await this.filterService.buildCompleteFilter(
				this.prisma,
				req.query,
				req.query.date as string
			);

			const lessons = await this.prisma.lesson.findMany({
				where,
				include: {
					teacher: {
						include: {
							user: true,
						},
					},
					class: true,
					subject: true,
					classroom: true,
					lessonSchedule: true,
					scheduleVersion: true,
					classGroup: true,
				},
				orderBy: [
					{ dayOfWeek: "asc" },
					{ lessonSchedule: { lessonNumber: "asc" } },
				],
			});

			const withGroupNumber = lessons.map((l: any) => ({
				...l,
				groupNumber: (() => {
					const name: string | undefined = l.classGroup?.name;
					if (!name) return null;
					const m = name.match(/\((\d+)\)/);
					if (m) return Number(m[1]);
					const num = Number(name.trim());
					return Number.isFinite(num) ? num : null;
				})(),
			}));

			res.json(withGroupNumber);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить уроки для конкретного дня
	 */
	async getLessonsForDay(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { date } = req.params;

			// Валидируем формат даты
			if (!this.isValidDateFormat(date)) {
				return next(
					createError("Invalid date format. Expected YYYY-MM-DD", 400)
				);
			}

			// Границы дня для выборки замещений
			const dayStart = new Date(`${date}T00:00:00.000Z`);
			const dayEnd = new Date(`${date}T23:59:59.999Z`);

			const where = await this.filterService.buildDayFilter(
				this.prisma,
				date,
				req.query
			);

			const lessons = await this.prisma.lesson.findMany({
				where,
				include: {
					teacher: {
						include: {
							user: true,
						},
					},
					class: true,
					subject: true,
					classroom: true,
					lessonSchedule: true,
					scheduleVersion: true,
					classGroup: true,
					substitutions: {
						where: {
							date: {
								gte: dayStart,
								lt: dayEnd,
							},
						},
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							classroom: true,
						},
					},
				},
				orderBy: {
					lessonSchedule: { lessonNumber: "asc" },
				},
			});

			const withGroupNumber = lessons.map((l: any) => ({
				...l,
				groupNumber: (() => {
					const name: string | undefined = l.classGroup?.name;
					if (!name) return null;
					const m = name.match(/\((\d+)\)/);
					if (m) return Number(m[1]);
					const num = Number(name.trim());
					return Number.isFinite(num) ? num : null;
				})(),
			}));

			res.json(withGroupNumber);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить уроки для недели
	 */
	async getLessonsForWeek(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { date } = req.params;

			// Валидируем формат даты
			if (!this.isValidDateFormat(date)) {
				return next(
					createError("Invalid date format. Expected YYYY-MM-DD", 400)
				);
			}

			// Вычисляем границы недели (понедельник - воскресенье) для выборки замещений
			const base = new Date(`${date}T00:00:00.000Z`);
			const day = base.getUTCDay(); // 0=Sun..6=Sat
			const diffToMonday = day === 0 ? -6 : 1 - day; // adjust to Monday
			const weekStart = new Date(base);
			weekStart.setUTCDate(base.getUTCDate() + diffToMonday);
			const weekEnd = new Date(weekStart);
			weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
			weekEnd.setUTCHours(23, 59, 59, 999);

			const where = await this.filterService.buildWeekFilter(
				this.prisma,
				date,
				req.query
			);

			const lessons = await this.prisma.lesson.findMany({
				where,
				include: {
					teacher: {
						include: {
							user: true,
						},
					},
					class: true,
					subject: true,
					classroom: true,
					lessonSchedule: true,
					scheduleVersion: true,
					classGroup: true,
					substitutions: {
						where: {
							date: {
								gte: weekStart,
								lte: weekEnd,
							},
						},
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							classroom: true,
						},
					},
				},
				orderBy: [
					{ dayOfWeek: "asc" },
					{ lessonSchedule: { lessonNumber: "asc" } },
				],
			});

			const withGroupNumber = lessons.map((l: any) => ({
				...l,
				groupNumber: (() => {
					const name: string | undefined = l.classGroup?.name;
					if (!name) return null;
					const m = name.match(/\((\d+)\)/);
					if (m) return Number(m[1]);
					const num = Number(name.trim());
					return Number.isFinite(num) ? num : null;
				})(),
			}));

			res.json(withGroupNumber);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить список свободных аудиторий на конкретный номер урока и дату
	 * query: date=YYYY-MM-DD, lessonNumber=number, idLesson?=original lesson id to include its classroom
	 */
	async getAvailableClassrooms(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { date, lessonNumber, idLesson } = req.query as {
				date?: string;
				lessonNumber?: string;
				idLesson?: string;
			};

			if (!date || !this.isValidDateFormat(date)) {
				return next(
					createError(
						"Invalid or missing date. Expected YYYY-MM-DD",
						400
					)
				);
			}
			const lessonNumberNum = Number(lessonNumber);
			if (
				!lessonNumber ||
				Number.isNaN(lessonNumberNum) ||
				lessonNumberNum <= 0
			) {
				return next(
					createError("Invalid or missing lessonNumber", 400)
				);
			}

			// Находим активную версию расписания на дату
			const base = new Date(`${date}T00:00:00.000Z`);
			const currentVersion = await this.prisma.scheduleVersion.findFirst({
				where: {
					AND: [
						{ dateBegin: { lte: base } },
						{ OR: [{ dateEnd: null }, { dateEnd: { gte: base } }] },
					],
				},
			});

			if (!currentVersion) {
				res.json([]);
				return;
			}

			// Определяем день недели и id расписания урока (по номеру)
			const dayOfWeek = base.getUTCDay() === 0 ? 7 : base.getUTCDay();
			const lessonSchedule = await this.prisma.lessonSchedule.findFirst({
				where: { lessonNumber: lessonNumberNum },
				select: { id: true },
			});

			if (!lessonSchedule) {
				res.json([]);
				return;
			}

			const lessonsAtTimeslot = await this.prisma.lesson.findMany({
				where: {
					idScheduleVersion: currentVersion.id,
					dayOfWeek,
					idLessonSchedule: lessonSchedule.id,
				},
				select: { idClassroom: true, id: true },
			});

			const dayStart = new Date(`${date}T00:00:00.000Z`);
			const dayEnd = new Date(`${date}T23:59:59.999Z`);

			const substitutionsAtTimeslot =
				await this.prisma.substitution.findMany({
					where: {
						date: { gte: dayStart, lt: dayEnd },
						lesson: { idLessonSchedule: lessonSchedule.id },
					},
					select: { idClassroom: true },
				});

			const occupiedClassroomIds = new Set<number>([
				...lessonsAtTimeslot
					.map(
						(lesson: { idClassroom: number | null }) =>
							lesson.idClassroom
					)
					.filter((id): id is number => id != null),
				...substitutionsAtTimeslot.map(
					(substitution: { idClassroom: number }) =>
						substitution.idClassroom
				),
			]);

			// Добавляем кабинет оригинального урока в доступные, если передан idLesson
			if (idLesson) {
				const original = await this.prisma.lesson.findUnique({
					where: { id: Number(idLesson) },
					select: { idClassroom: true },
				});
				if (original && original.idClassroom) {
					occupiedClassroomIds.delete(original.idClassroom);
				}
			}

			const freeClassrooms = await this.prisma.classroom.findMany({
				where: occupiedClassroomIds.size
					? { id: { notIn: Array.from(occupiedClassroomIds) } }
					: {},
				orderBy: { number: "asc" },
			});

			res.json(freeClassrooms);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Создать замещение
	 */
	async createSubstitution(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { date, idLesson, idTeacher, idClassroom } = req.body as {
				date?: string;
				idLesson?: number;
				idTeacher?: number;
				idClassroom?: number;
			};

			if (!date || !this.isValidDateFormat(date)) {
				return next(
					createError(
						"Invalid or missing date. Expected YYYY-MM-DD",
						400
					)
				);
			}
			if (!idLesson || !idTeacher || !idClassroom) {
				return next(
					createError(
						"Missing required fields: idLesson, idTeacher, idClassroom",
						400
					)
				);
			}

			const dayStart = new Date(`${date}T00:00:00.000Z`);

			const substitution = await this.prisma.substitution.create({
				data: {
					date: dayStart,
					idLesson,
					idTeacher,
					idClassroom,
				},
			});

			res.status(201).json(substitution);
		} catch (error: any) {
			if (error?.code === "P2002") {
				return next(
					createError(
						"Substitution already exists for this lesson and date",
						409
					)
				);
			}
			next(error);
		}
	}

	/**
	 * Удалить замещение по id
	 */
	async deleteSubstitution(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params as { id?: string };
			const substitutionId = Number(id);
			if (!id || Number.isNaN(substitutionId) || substitutionId <= 0) {
				return next(createError("Invalid substitution id", 400));
			}

			const existing = await this.prisma.substitution.findUnique({
				where: { id: substitutionId },
			});
			if (!existing) {
				return next(createError("Substitution not found", 404));
			}

			await this.prisma.substitution.delete({
				where: { id: substitutionId },
			});
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить расписания уроков
	 */
	async getLessonSchedules(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const lessonSchedules = await this.prisma.lessonSchedule.findMany({
				include: {
					lessons: {
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							class: true,
							subject: true,
							classroom: true,
							scheduleVersion: true,
						},
					},
				},
				orderBy: {
					lessonNumber: "asc",
				},
			});

			res.json(lessonSchedules);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить версии расписания
	 */
	async getScheduleVersions(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const scheduleVersions = await this.prisma.scheduleVersion.findMany(
				{
					include: {
						lessons: {
							include: {
								teacher: {
									include: {
										user: true,
									},
								},
								class: true,
								subject: true,
								classroom: true,
								lessonSchedule: true,
							},
						},
					},
					orderBy: {
						dateBegin: "desc",
					},
				}
			);

			res.json(scheduleVersions);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Получить текущую версию расписания
	 */
	async getCurrentScheduleVersion(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const today = new Date();
			const currentVersion = await this.prisma.scheduleVersion.findFirst({
				where: {
					AND: [
						{ dateBegin: { lte: today } },
						{
							OR: [
								{ dateEnd: null },
								{ dateEnd: { gte: today } },
							],
						},
					],
				},
				include: {
					lessons: {
						include: {
							teacher: {
								include: {
									user: true,
								},
							},
							class: true,
							subject: true,
							classroom: true,
							lessonSchedule: true,
						},
					},
				},
				orderBy: { dateBegin: "desc" },
			});

			if (!currentVersion) {
				res.status(404).json({
					error: "No current schedule version found",
				});
				return;
			}

			res.json(currentVersion);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Валидирует формат даты YYYY-MM-DD
	 */
	private isValidDateFormat(date: string): boolean {
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		if (!regex.test(date)) {
			return false;
		}

		const parsedDate = new Date(date);
		return parsedDate.toISOString().split("T")[0] === date;
	}
}
