import path from 'path';
import { fileURLToPath } from 'url';

// Получаем директорию текущего файла для корректного построения путей в ES-modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Порт, на котором будет запущен сервер (по умолчанию 3001)
export const PORT = process.env.PORT || 3001;

// Путь к файлу базы данных SQLite (будет создан автоматически в папке server)
export const DB_PATH = path.resolve(__dirname, '../../salary_tracker.db');

// Настройки CORS для разрешения запросов с фронтенда
export const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Секретный ключ для подписи JWT-токенов
// В production используйте переменную окружения JWT_SECRET
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// Время жизни JWT-токена (7 дней)
export const JWT_EXPIRES_IN = '7d';