export interface CarInput {
  brand: string;
  vehicle_age: number;
  km_driven: number;
  seller_type: 'Dealer' | 'Individual' | 'Trustmark Dealer';
  fuel_type: 'Petrol' | 'Diesel' | 'CNG' | 'LPG' | 'Electric';
  transmission_type: 'Manual' | 'Automatic';
  mileage: number;
  engine: number;
  max_power: number;
  seats: number;
}

export interface FactorContribution {
  name: string;
  category: 'base' | 'brand' | 'age' | 'mileage' | 'transmission' | 'fuel' | 'condition' | 'seats';
  impactPercentage: number;
  valueDescription: string;
  effect: 'positive' | 'negative' | 'neutral';
  amountDelta: number;
  detail: string;
}

export interface MultiModelPrediction {
  modelName: string;
  slug: string;
  predictedPrice: number;
  formattedPrice: string;
  priceInWords: string;
  r2Score: number;
  mae: number;
  formattedMae: string;
  rmse: number;
  differenceFromRf: number;
  percentageDiffFromRf: number;
  isBest?: boolean;
  statusBadge?: string;
  note: string;
}

export interface PredictionResult {
  predictedPrice: number;
  formattedPrice: string;
  priceInWords: string;
  mae: number;
  formattedMae: string;
  confidenceRange: {
    low: number;
    high: number;
    formattedLow: string;
    formattedHigh: string;
  };
  input: CarInput;
  timestamp: string;
  modelUsed: string;
  r2Score: number;
  breakdown: FactorContribution[];
  allModels: MultiModelPrediction[];
}

export interface ModelMetric {
  name: string;
  slug: string;
  r2Score: number;
  mae: number;
  rmse: number;
  isBest?: boolean;
  notes: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  percentage: string;
  description: string;
}

