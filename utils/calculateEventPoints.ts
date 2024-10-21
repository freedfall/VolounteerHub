// utils/calculateEventPoints.ts
import { parseISO, isAfter, isWeekend, differenceInHours, format } from 'date-fns';

interface Event {
  title: string;
  time: string; // Формат ISO, например, '2024-10-20T18:00:00'
  city: string;
  address: string;
  points: number;
  description: string;
}

export const calculateEventPoints = (startTime: string): number => {
  // Базовое количество очков
  let points = 50;

  // Парсинг времени начала события
  const startDate = parseISO(startTime);
  const now = new Date();

  // Модификатор за вечернее событие (после 18:00)
  const eveningTime = new Date(startDate);
  eveningTime.setHours(18, 0, 0, 0); // Устанавливаем 18:00 для проверки
  if (isAfter(startDate, eveningTime)) {
    points += 20;
  }

  // Модификатор за выходные (суббота или воскресенье)
  if (isWeekend(startDate)) {
    points += 30;
  }

  // Модификатор за событие, которое начнется в ближайшие 48 часов
  const hoursUntilEvent = differenceInHours(startDate, now);
  if (hoursUntilEvent <= 48) {
    points += 10;
  }

  return points;
};
