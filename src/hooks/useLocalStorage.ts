import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

export interface SavedTrip {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export function useSavedTrips() {
  const [trips, setTrips] = useLocalStorage<SavedTrip[]>('savedTrips', []);

  const saveTrip = (name: string, data: any) => {
    const newTrip: SavedTrip = {
      id: crypto.randomUUID(),
      name,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrips((prev) => [newTrip, ...prev]);
    return newTrip.id;
  };

  const updateTrip = (id: string, name: string, data: any) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id
          ? { ...trip, name, data, updatedAt: new Date().toISOString() }
          : trip
      )
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  const getTrip = (id: string) => {
    return trips.find((trip) => trip.id === id);
  };

  return {
    trips,
    saveTrip,
    updateTrip,
    deleteTrip,
    getTrip,
  };
}
