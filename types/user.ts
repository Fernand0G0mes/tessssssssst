// types/user.ts

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Macros = {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
};

export type Meal = {
  type: MealType;
  name: string;
  calories: number;
  registered: boolean;
  timestamp: Date;
  macros?: Macros; // Adicionada esta linha
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  dateEarned?: Date;
};

export type ProgressMetric = {
  consumed: number;
  goal: number;
  unit: string;
  percentage?: number;
};

export type NextMeal = {
  name: string;
  time: string;
  type: MealType;
  caloriesEstimate: number;
};

export type DailyProgress = {
  calories: ProgressMetric;
  water: ProgressMetric;
  nextMeal: NextMeal;
  burnedCalories: number;
  steps: number;
  macros: Macros;
};

export type Trend = 'up' | 'down' | 'stable';

export type TrendData = {
  avg: number;
  trend: Trend;
  changeAmount?: number;
};

export type WeeklyProgress = {
  calories: TrendData;
  water: TrendData;
  activity: TrendData;
};

export type UserSettings = {
  darkMode: boolean;
  notifications: boolean;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  dailyProgress: DailyProgress;
  weeklyProgress: WeeklyProgress;
  meals: Meal[];
  achievements: Achievement[];
  tips: string[];
  settings: UserSettings;
};

// Se você tiver outros tipos aqui, mantenha-os.