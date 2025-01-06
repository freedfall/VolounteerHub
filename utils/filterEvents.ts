// File: filterEvents.ts
// Author: Kininbayev Timur
// Description: Utility function for filtering and sorting events based on filters, search, and sorting method

interface Filters {
  city?: string[];
  rating?: number;
  duration?: {
    preset?: string;
    custom?: { min: number; max: number };
  };
}

export function filterAndSortEvents(
  events: EventType[],
  filters: Filters,
  sortingMethod: string,
  searchText: string
): EventType[] {
  return events
    .filter((event) => {
      // city filters
      if (new Date(event.startDateTime) < new Date()) return false;

      if (filters.city && filters.city.length > 0 && !filters.city.includes(event.city)) return false;

      // rating filters
      if (filters.rating && event.creator.pointsAsCreator !== null) {
        if (event.creator.pointsAsCreator < filters.rating) return false;
      }

      // duration filters
      if (filters.duration) {
        const durationInMinutes =
          (new Date(event.endDateTime).getTime() - new Date(event.startDateTime).getTime()) / 60000;

        if (filters.duration.preset) {
          switch (filters.duration.preset) {
            case 'less2h':
              if (durationInMinutes >= 120) return false;
              break;
            case 'more3h':
              if (durationInMinutes <= 180) return false;
              break;
            case 'more30min':
              if (durationInMinutes <= 30) return false;
              break;
          }
        }

        if (filters.duration.custom) {
          const { min, max } = filters.duration.custom;
          if (durationInMinutes < min || durationInMinutes > max) return false;
        }
      }

      return true;
    })
    .filter((event) => {
      // search filter
      if (!searchText.trim()) return true;
      return event.name.toLowerCase().includes(searchText.toLowerCase());
    })
    .sort((a, b) => {
      // sorting
      if (sortingMethod === 'rating') {
        const aVal = a.creator.pointsAsCreator !== null ? a.creator.pointsAsCreator : 0;
        const bVal = b.creator.pointsAsCreator !== null ? b.creator.pointsAsCreator : 0;
        return bVal - aVal;
      }
      if (sortingMethod === 'date') {
        return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
      }
      if (sortingMethod === 'points') {
        return b.price - a.price;
      }
      return 0;
    });
}
