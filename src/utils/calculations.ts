export interface TripData {
  destination: string;
  travellers: number;
  days: number;
  tripLabel?: string;

  transportMode: 'train' | 'bus' | 'flight' | 'car';

  farePerPerson?: number;
  foodOnTransportPerPerson?: number;
  taxiToStation?: number;

  totalDistance?: number;
  carAverage?: number;
  fuelPricePerLitre?: number;
  tollParking?: number;
  refreshments?: number;
  isRoundTrip?: boolean;

  hotelRatePerNight: number;
  numberOfRooms: number;
  sharingPerRoom?: number;

  mealsPerDay: number;
  mealsIsPerPerson: boolean;
  localTransportPerDay: number;
  sightseeingPerDay: number;
  miscPerDay: number;

  visaFees?: number;
  simInternet?: number;
  shopping?: number;
  travelInsurance?: number;
  otherOperational?: number;
}

export interface CalculationResult {
  transportCost: number;
  accommodationCost: number;
  foodCost: number;
  localTransportCost: number;
  sightseeingCost: number;
  miscCost: number;
  operationalCost: number;
  totalCost: number;
  costPerPerson: number;
  transportDetails?: {
    fuelLitres?: number;
    fuelCost?: number;
  };
}

export function calculateTransportCost(trip: TripData): { cost: number; details?: any } {
  const { transportMode } = trip;

  if (transportMode === 'car') {
    const distance = (trip.totalDistance || 0) * (trip.isRoundTrip ? 2 : 1);
    const fuelLitres = trip.carAverage ? distance / trip.carAverage : 0;
    const fuelCost = fuelLitres * (trip.fuelPricePerLitre || 0);
    const totalCost = fuelCost + (trip.tollParking || 0) + (trip.refreshments || 0);

    return {
      cost: totalCost,
      details: {
        fuelLitres: Math.round(fuelLitres * 100) / 100,
        fuelCost: Math.round(fuelCost * 100) / 100,
      },
    };
  }

  const fareCost = (trip.farePerPerson || 0) * trip.travellers;
  const foodCost = (trip.foodOnTransportPerPerson || 0) * trip.travellers;
  const taxiCost = trip.taxiToStation || 0;

  return {
    cost: fareCost + foodCost + taxiCost,
  };
}

export function calculateAccommodationCost(trip: TripData): number {
  const nights = Math.max(0, trip.days - 1);
  return trip.hotelRatePerNight * nights * trip.numberOfRooms;
}

export function calculateFoodCost(trip: TripData): number {
  if (trip.mealsIsPerPerson) {
    return trip.mealsPerDay * trip.travellers * trip.days;
  }
  return trip.mealsPerDay * trip.days;
}

export function calculateLocalTransportCost(trip: TripData): number {
  return trip.localTransportPerDay * trip.days;
}

export function calculateSightseeingCost(trip: TripData): number {
  return trip.sightseeingPerDay * trip.days;
}

export function calculateMiscCost(trip: TripData): number {
  return trip.miscPerDay * trip.days;
}

export function calculateOperationalCost(trip: TripData): number {
  return (
    (trip.visaFees || 0) +
    (trip.simInternet || 0) +
    (trip.shopping || 0) +
    (trip.travelInsurance || 0) +
    (trip.otherOperational || 0)
  );
}

export function calculateTrip(trip: TripData): CalculationResult {
  const transport = calculateTransportCost(trip);
  const accommodation = calculateAccommodationCost(trip);
  const food = calculateFoodCost(trip);
  const localTransport = calculateLocalTransportCost(trip);
  const sightseeing = calculateSightseeingCost(trip);
  const misc = calculateMiscCost(trip);
  const operational = calculateOperationalCost(trip);

  const total =
    transport.cost +
    accommodation +
    food +
    localTransport +
    sightseeing +
    misc +
    operational;

  return {
    transportCost: Math.round(transport.cost * 100) / 100,
    accommodationCost: Math.round(accommodation * 100) / 100,
    foodCost: Math.round(food * 100) / 100,
    localTransportCost: Math.round(localTransport * 100) / 100,
    sightseeingCost: Math.round(sightseeing * 100) / 100,
    miscCost: Math.round(misc * 100) / 100,
    operationalCost: Math.round(operational * 100) / 100,
    totalCost: Math.round(total * 100) / 100,
    costPerPerson: Math.round((total / trip.travellers) * 100) / 100,
    transportDetails: transport.details,
  };
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function compareTwoTrips(trip1: TripData, trip2: TripData): {
  trip1Result: CalculationResult;
  trip2Result: CalculationResult;
  cheaper: 'trip1' | 'trip2' | 'equal';
  difference: number;
  percentageDifference: number;
} {
  const trip1Result = calculateTrip(trip1);
  const trip2Result = calculateTrip(trip2);

  const difference = Math.abs(trip1Result.totalCost - trip2Result.totalCost);
  const higherCost = Math.max(trip1Result.totalCost, trip2Result.totalCost);
  const percentageDifference = higherCost > 0 ? (difference / higherCost) * 100 : 0;

  let cheaper: 'trip1' | 'trip2' | 'equal' = 'equal';
  if (trip1Result.totalCost < trip2Result.totalCost) {
    cheaper = 'trip1';
  } else if (trip2Result.totalCost < trip1Result.totalCost) {
    cheaper = 'trip2';
  }

  return {
    trip1Result,
    trip2Result,
    cheaper,
    difference: Math.round(difference * 100) / 100,
    percentageDifference: Math.round(percentageDifference * 100) / 100,
  };
}
