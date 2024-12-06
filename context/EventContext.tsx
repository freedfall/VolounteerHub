// context/EventContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Event = {
  id: string;
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  description: string;
  creator: string;
  imageURL?: string;
  coordinates: string;
};

type EventContextType = {
  events: Event[];
  setEvents: (events: Event[]) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
