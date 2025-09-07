# Edu-Flow - Система управления школьным расписанием

Современная система управления расписанием для образовательных учреждений, построенная с использованием лучших практик разработки.

## 🏗️ Архитектура

Проект использует монorepo структуру с разделением на:

- **API** - Backend сервер на Node.js + Express + Prisma
- **DB** - База данных PostgreSQL с Prisma ORM
- **UI** - Frontend на React 19 + TypeScript + Tailwind CSS
- **Shared** - Общие типы между frontend и backend

## 🚀 Технологический стек

### Backend
- **Node.js** + **Express.js** - веб-сервер
- **TypeScript** - типизация
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - основная база данных
- **JWT** - аутентификация
- **Zod** - валидация данных
- **bcryptjs** - хеширование паролей

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **React Query** - управление состоянием сервера
- **Zustand** - управление локальным состоянием
- **React Router** - маршрутизация
- **Lucide React** - иконки

### DevOps
- **pnpm** - менеджер пакетов
- **ESLint** - линтинг
- **Prettier** - форматирование кода

## 📋 Функциональность

### ✅ Реализовано
- 🔐 Система аутентификации (JWT)
- 👥 Управление пользователями (Admin, Teacher, Student)
- 👨‍🏫 Управление учителями
- 🏫 Управление классами
- 📚 Управление предметами
- 🏢 Управление аудиториями
- 📅 Создание и редактирование расписания
- 📊 Просмотр расписания по дням и неделям
- 🔍 Фильтрация расписания
- 📱 Адаптивный дизайн

### 🚧 В планах
- 📈 Аналитика и отчеты
- 📧 Уведомления
- 📱 Мобильное приложение
- 🔄 Синхронизация с внешними системами

## 🛠️ Установка и запуск

### Предварительные требования
- Node.js 18+
- PostgreSQL 14+
- pnpm

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd edu-flow
```

### 2. Установка зависимостей
```bash
# Установка зависимостей для всех пакетов
pnpm install

# Или для каждого пакета отдельно
cd api && pnpm install
cd ../db && pnpm install
cd ../ui && pnpm install
```

### 3. Настройка базы данных
```bash
cd db

# Создание файла .env
cp .env.example .env

# Настройка DATABASE_URL в .env файле
# DATABASE_URL="postgresql://username:password@localhost:5432/edu_flow"

# Генерация Prisma клиента
pnpm db:generate

# Применение миграций
pnpm db:migrate

# Заполнение тестовыми данными (опционально)
pnpm db:seed
```

### 4. Настройка API
```bash
cd api

# Создание файла .env
cp .env.example .env

# Настройка переменных окружения
# JWT_SECRET=your-secret-key
# DATABASE_URL=postgresql://username:password@localhost:5432/edu_flow
# FRONTEND_URL=http://localhost:5173
# PORT=3001
```

### 5. Настройка UI
```bash
cd ui

# Создание файла .env.local
cp .env.local.example .env.local

# Настройка переменных окружения
# VITE_API_URL=http://localhost:3001/api
```

### 6. Запуск приложения

#### Режим разработки
```bash
# Запуск всех сервисов одновременно
pnpm dev

# Или запуск каждого сервиса отдельно
cd api && pnpm dev    # API на порту 3001
cd db && pnpm dev     # База данных
cd ui && pnpm dev     # Frontend на порту 5173
```

#### Продакшн режим
```bash
# Сборка всех пакетов
pnpm build

# Запуск API
cd api && pnpm start

# Запуск UI (требует веб-сервер)
cd ui && pnpm preview
```

## 📁 Структура проекта

```
edu-flow/
├── api/                    # Backend API
│   ├── src/
│   │   ├── controllers/    # Контроллеры
│   │   ├── middleware/     # Middleware
│   │   ├── routes/         # Маршруты
│   │   ├── types/          # Типы
│   │   └── utils/          # Утилиты
│   └── package.json
├── db/                     # База данных
│   ├── prisma/
│   │   └── schema.prisma   # Схема базы данных
│   ├── src/
│   │   ├── services/       # Сервисы
│   │   └── types/          # Типы
│   └── package.json
├── ui/                     # Frontend
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Библиотеки
│   │   ├── pages/          # Страницы
│   │   ├── store/          # Zustand store
│   │   └── types/          # Типы
│   └── package.json
├── shared/                 # Общие типы
│   └── types/
└── README.md
```

## 🔧 Разработка

### Линтинг и форматирование
```bash
# Проверка кода
pnpm lint

# Автоисправление
pnpm lint:fix

# Форматирование
pnpm format
```

### Тестирование
```bash
# Запуск тестов
pnpm test

# Тесты с покрытием
pnpm test:coverage
```

### Работа с базой данных
```bash
cd db

# Создание новой миграции
pnpm db:migrate:dev

# Сброс базы данных
pnpm db:reset

# Просмотр базы данных
pnpm db:studio
```

## 🚀 Деплой

### Docker
```bash
# Сборка образов
docker-compose build

# Запуск в продакшн
docker-compose up -d
```

### Vercel (Frontend)
```bash
cd ui
vercel --prod
```

### Railway/Heroku (Backend)
```bash
cd api
# Настройка переменных окружения в панели управления
# Деплой через Git
```

## 📝 API Документация

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация
- `GET /api/auth/me` - Получение текущего пользователя

### Расписание
- `GET /api/schedule/teachers` - Список учителей
- `GET /api/schedule/classes` - Список классов
- `GET /api/schedule/subjects` - Список предметов
- `GET /api/schedule/classrooms` - Список аудиторий
- `GET /api/schedule/lessons` - Список уроков
- `POST /api/schedule/lessons` - Создание урока
- `PUT /api/schedule/lessons/:id` - Обновление урока
- `DELETE /api/schedule/lessons/:id` - Удаление урока

## 🤝 Участие в разработке

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Команда

- **Разработка** - [Ваше имя]
- **Дизайн** - [Имя дизайнера]
- **Тестирование** - [Имя тестировщика]

## 📞 Поддержка

Если у вас есть вопросы или предложения, создайте [Issue](https://github.com/your-repo/issues) или свяжитесь с нами по email: support@edu-flow.com
