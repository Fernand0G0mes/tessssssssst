// types/index.ts

/**
 * Tipos de refeição com valores específicos
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Tendências com valores controlados
 */
export type TrendType = 'up' | 'down' | 'stable';

export interface Meal {
  type: MealType; // Agora usando o tipo específico
  name: string;
  calories: number;
  registered: boolean;
  timestamp?: string; // ISO string para melhor serialização
}

export interface Achievement {
  id: number | string; // Flexível para diferentes bancos de dados
  title: string;
  earned: boolean;
  icon?: string; // Opcional para UI
}

export interface ProgressMetric {
  consumed: number;
  goal: number;
  percentage?: number; // Calculado automaticamente
}

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number; // Adicionado como opcional
}

export interface TrendMetric {
  avg: number;
  trend: TrendType; // Tipo específico
  lastUpdated?: string; // ISO string
}

export interface NextMeal {
  name: string;
  time: string; // Formato HH:mm
  type: MealType; // Usando o tipo definido
  calories?: number;
}

export interface UserData {
  name: string;
  photo: string;
  email?: string; // Adicionado como opcional
  dailyProgress: {
    calories: ProgressMetric;
    macros: Macros;
    water: ProgressMetric;
    nextMeal: NextMeal;
    burnedCalories: number;
    steps: number;
    sleep?: { // Adicionado como opcional
      hours: number;
      quality: 1 | 2 | 3 | 4 | 5; // Escala de 1-5
    };
  };
  weeklyProgress: {
    calories: TrendMetric;
    water: TrendMetric;
    activity: TrendMetric;
  };
  meals: Meal[];
  achievements: Achievement[];
  tips: string[];
  settings?: { // Adicionado como opcional
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

// Exportando tipos úteis para reutilização
export type { TrendType as Trend }; // <<-- Apenas 'TrendType' aqui, 'MealType' já foi exportado acima