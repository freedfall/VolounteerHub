// context/EventContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Определяем типы данных
type Event = {
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  description: string;
};

type EventContextType = {
  events: Event[];
  setEvents: (events: Event[]) => void;
};

// Создаем контекст с типизацией
const EventContext = createContext<EventContextType | undefined>(undefined);

// Хук для использования контекста
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

// Провайдер контекста событий
export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
