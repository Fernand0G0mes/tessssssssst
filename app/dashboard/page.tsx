"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config"; // Certifique-se de que este caminho está correto
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  MdHome, MdTimeline, MdFitnessCenter, MdEmojiEvents, MdPerson,
  MdCalendarToday, MdAdd, MdWaterDrop, MdTrackChanges, MdEdit,
  MdInfo, MdCheckCircle, MdAccessTime, MdFavorite, MdChevronRight,
  MdTrendingUp, MdLogout, MdLocalDining, MdBreakfastDining, MdLunchDining, MdDinnerDining, MdFastfood
} from "react-icons/md"; // Importação do pacote Material Design Icons

// Tipos
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'main';
type TrendType = 'up' | 'down' | 'stable';

interface Meal {
  type: MealType;
  name: string;
  calories: number;
  registered: boolean;
}

interface Achievement {
  id: number;
  title: string;
  earned: boolean;
}

interface ProgressData {
  consumed: number;
  goal: number;
  unit?: string;
}

interface TrendData {
  avg: number;
  trend: TrendType;
}

interface NextMeal {
  name: string;
  time: string;
  type: string;
}

interface UserData {
  name: string;
  photo: string;
  dailyProgress: {
    calories: ProgressData;
    macros: { protein: number; carbs: number; fats: number };
    water: ProgressData;
    nextMeal: NextMeal;
    burnedCalories: number;
    steps: number;
  };
  weeklyProgress: {
    calories: TrendData;
    water: TrendData;
    activity: TrendData;
  };
  meals: Meal[];
  achievements: Achievement[];
  tips: string[];
}

interface ProgressCardProps {
  title: string;
  current: number | string;
  goal: number | string;
  icon: React.ReactNode;
  color: string;
  percentage: number;
  unit?: string;
}

interface NextMealCardProps {
  meal: NextMeal;
  onAddClick: () => void;
}

interface MealItemProps {
  meal: Meal;
  renderMealIcon: (type: MealType) => React.ReactNode;
}

interface MealsListProps {
  meals: Meal[];
  renderMealIcon: (type: MealType) => React.ReactNode;
  onViewAllClick: () => void;
}

interface WeeklySummaryProps {
  weeklyProgress: {
    calories: TrendData;
    water: TrendData;
    activity: TrendData;
  };
  renderTrendIcon: (trend: TrendType) => React.ReactNode;
}

interface AchievementsListProps {
  achievements: Achievement[];
  onViewAllClick: () => void;
}

interface DailyTipProps {
  tip: string;
}

// Componentes
const MobileNavigation = dynamic(() => import("../components/MobileNavigation"), {
  loading: () => <div className="h-16 bg-white shadow-sm rounded-t-xl"></div>,
  ssr: false
});

// Hooks personalizados
const useUserData = (currentUser: User | null): UserData => {
  return {
    name: currentUser?.displayName || "Usuário",
    photo: currentUser?.photoURL || "/user-default.png",
    dailyProgress: {
      calories: { consumed: 1200, goal: 1800 },
      macros: { protein: 80, carbs: 150, fats: 40 },
      water: { consumed: 1.8, goal: 2.5 },
      nextMeal: { name: "Almoço", time: "12:30", type: "main" },
      burnedCalories: 420,
      steps: 7850,
    },
    weeklyProgress: {
      calories: { avg: 1450, trend: 'up' },
      water: { avg: 2.1, trend: 'stable' },
      activity: { avg: 320, trend: 'up' }
    },
    meals: [
      { type: "breakfast", name: "Vitamina de Banana", calories: 320, registered: true },
      { type: "lunch", name: "Salada com Frango", calories: 450, registered: false },
      { type: "snack", name: "Iogurte Natural", calories: 150, registered: true },
      { type: "dinner", name: "Sopa de Legumes", calories: 280, registered: false }
    ],
    achievements: [
      { id: 1, title: "Meta de Água", earned: true },
      { id: 2, title: "5 Dias Ativos", earned: false },
      { id: 3, title: "Plano Completo", earned: true }
    ],
    tips: [
      "Tente incluir vegetais em todas as refeições",
      "Beba um copo de água ao acordar",
      "Prefira alimentos integrais aos refinados"
    ]
  };
};

const ProgressCard = memo(({
  title,
  current,
  goal,
  icon,
  color,
  percentage,
  unit
}: ProgressCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-900">
          {current}
          <span className="text-sm font-normal text-gray-400 ml-1">/{goal}{unit}</span>
        </h3>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-xl`}>
        {icon}
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`bg-${color}-500 h-2.5 rounded-full`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  </motion.div>
));
ProgressCard.displayName = "ProgressCard";

const NextMealCard = memo(({ meal, onAddClick }: NextMealCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    className="w-full bg-gradient-to-br from-blue-600 to-indigo-500 p-7 rounded-2xl shadow-xl mb-10 text-white relative overflow-hidden"
  >
    <div className="absolute inset-0 opacity-10 bg-black pointer-events-none"></div>
    <div className="flex justify-between items-center z-10 relative">
      <div>
        <p className="text-sm opacity-90 mb-1 font-light">Próxima refeição</p>
        <h3 className="text-2xl font-bold mb-1">{meal.name}</h3>
        <p className="text-md opacity-90 font-medium">{meal.time}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAddClick}
        className="bg-white text-blue-600 p-4 rounded-xl hover:bg-blue-100 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Adicionar refeição"
      >
        <MdAdd className="text-xl" />
      </motion.button>
    </div>
  </motion.div>
));
NextMealCard.displayName = "NextMealCard";

const MealItem = memo(({ meal, renderMealIcon }: MealItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
  >
    <div className="flex items-center">
      <span className="text-3xl mr-4" role="img" aria-label={meal.type}>{renderMealIcon(meal.type)}</span>
      <div>
        <p className="text-lg font-medium text-gray-800">
          {meal.type === 'breakfast' ? 'Café da Manhã' :
            meal.type === 'lunch' ? 'Almoço' :
            meal.type === 'dinner' ? 'Jantar' : 'Lanche'}
        </p>
        <p className="text-sm text-gray-500 font-light">
          {meal.registered ? meal.name : 'Refeição não registrada'}
        </p>
      </div>
    </div>
    <span className={`text-lg ${meal.registered ? 'font-bold text-gray-800' : 'text-gray-400 italic'}`}>
      {meal.registered ? `${meal.calories}kcal` : '--'}
    </span>
    {meal.registered && (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="ml-4 text-green-500"
      >
        <MdCheckCircle />
      </motion.div>
    )}
  </motion.div>
));
MealItem.displayName = "MealItem";

const MealsList = memo(({ meals, renderMealIcon, onViewAllClick }: MealsListProps) => (
  <div className="w-full mb-10">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-bold text-gray-800">Suas Refeições Hoje</h2>
      <motion.button
        whileHover={{ x: 5 }}
        onClick={onViewAllClick}
        className="text-md text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center"
        aria-label="Ver todas as refeições"
      >
        Ver todas <MdChevronRight className="ml-1" />
      </motion.button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {meals.map((meal, index) => (
        <MealItem key={index} meal={meal} renderMealIcon={renderMealIcon} />
      ))}
    </div>
  </div>
));
MealsList.displayName = "MealsList";

const WeeklySummary = memo(({ weeklyProgress, renderTrendIcon }: WeeklySummaryProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white p-7 rounded-2xl shadow-xl border border-gray-100 mb-10"
  >
    <h2 className="text-xl font-bold text-gray-800 mb-5">Resumo Semanal</h2>

    <div className="space-y-6">
      {Object.entries(weeklyProgress).map(([key, data]) => (
        <div key={key}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-md text-gray-600 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} média</span>
            <span className="text-md font-bold text-gray-800 flex items-center">
              {data.avg}{key === 'water' ? 'L' : 'kcal'}
              <span className="ml-2">{renderTrendIcon(data.trend)}</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${
                key === 'calories' ? 'bg-blue-500' :
                key === 'water' ? 'bg-cyan-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(data.avg / (key === 'water' ? 3 : 1500) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
));
WeeklySummary.displayName = "WeeklySummary";

const AchievementsList = memo(({ achievements, onViewAllClick }: AchievementsListProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    className="bg-white p-7 rounded-2xl shadow-xl border border-gray-100 mb-10"
  >
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-bold text-gray-800">Suas Conquistas</h2>
      <motion.button
        whileHover={{ x: 5 }}
        onClick={onViewAllClick}
        className="text-md text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center"
        aria-label="Ver todas as conquistas"
      >
        Ver todas <MdChevronRight className="ml-1" />
      </motion.button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          whileHover={{ scale: 1.03, boxShadow: achievement.earned ? "0 10px 15px -3px rgba(252, 211, 77, 0.3)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          className={`p-5 rounded-xl text-center border ${
            achievement.earned
              ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md'
              : 'border-gray-200 bg-gray-50 shadow-sm opacity-80'
          } transition-all duration-200 cursor-pointer`}
          aria-label={`Conquista: ${achievement.title} ${achievement.earned ? 'conquistada' : 'não conquistada'}`}
        >
          <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 ${
            achievement.earned
              ? 'bg-yellow-200 text-yellow-600 shadow-inner'
              : 'bg-gray-200 text-gray-400'
          }`}>
            <MdEmojiEvents className="text-2xl" />
          </div>
          <p className="text-sm font-semibold text-gray-800">{achievement.title}</p>
          {achievement.earned && <p className="text-xs text-yellow-600 mt-1">Conquistado!</p>}
        </motion.div>
      ))}
    </div>
  </motion.div>
));
AchievementsList.displayName = "AchievementsList";

const DailyTip = memo(({ tip }: DailyTipProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    className="w-full bg-white p-7 rounded-2xl shadow-xl border border-gray-100 mb-10 transform hover:scale-[1.01] transition-transform duration-200"
  >
    <div className="flex items-start">
      <div className="bg-purple-100 p-4 rounded-xl mr-4 flex-shrink-0">
        <MdInfo className="text-purple-600 text-2xl" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Dica Nutricional do Dia</h3>
        <p className="text-md text-gray-700 leading-relaxed">{tip}</p>
      </div>
    </div>
  </motion.div>
));
DailyTip.displayName = "DailyTip";

// Componente principal
export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Separação de efeitos para responsividade
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efeito para autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      if (!user) router.push("/");
    }, (error) => {
      setError("Erro ao carregar usuário. Por favor, tente novamente.");
      setIsLoading(false);
      console.error("Auth error:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  // Handlers de ações
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      router.push("/");
    } catch (error) {
      setError("Erro ao fazer logout. Tente novamente.");
      console.error("Error signing out: ", error);
      setIsLoading(false);
    }
  }, [router]);

  const navigateTo = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  // Funções auxiliares para renderização de ícones
  const renderMealIcon = useCallback((mealType: MealType) => {
    const icons: Record<MealType, React.ReactNode> = {
      breakfast: <MdBreakfastDining />,
      lunch: <MdLunchDining />,
      dinner: <MdDinnerDining />,
      snack: <MdFastfood />,
      main: <MdLocalDining />
    };
    return icons[mealType] || <MdLocalDining />;
  }, []);

  const renderTrendIcon = useCallback((trend: TrendType) => {
    if (trend === 'up') return <MdTrendingUp className="text-green-500" />;
    if (trend === 'down') return <MdTrendingUp className="text-red-500 rotate-180" />;
    return <span className="text-gray-400">—</span>;
  }, []);

  // Dados mockados do usuário (substitua por dados reais da sua aplicação)
  const userData = useUserData(currentUser);

  // Cálculos de porcentagem para barras de progresso
  const caloriesPercentage = Math.min(
    Math.round((userData.dailyProgress.calories.consumed / userData.dailyProgress.calories.goal) * 100),
    100
  );
  const waterPercentage = Math.min(
    Math.round((userData.dailyProgress.water.consumed / userData.dailyProgress.water.goal) * 100),
    100
  );
  const stepsPercentage = Math.min(
    Math.round((userData.dailyProgress.steps / 10000) * 100), // Meta de 10.000 passos
    100
  );

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600 text-lg font-medium">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-red-700">Oops! Algo deu errado.</h2>
          <p className="text-gray-700 text-center mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setError(null)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Tentar novamente
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-white flex flex-col items-center px-4 md:px-8 lg:px-16 xl:px-24 pb-20 font-sans text-gray-800">

      {/* Seção Superior Combinada: Avatar/Nome, Seletor de Abas e Ícones de Ação */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between py-6 gap-y-4">
        {/* Lado Esquerdo: Avatar e Informações do Usuário */}
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-lg mr-4 transform hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={() => navigateTo('/profile')}>
              <Image
                src={userData.photo}
                alt={userData.name}
                width={64}
                height={64}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 ring-2 ring-offset-2 ring-blue-400 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light">Bem-vindo(a)</p>
              <h1 className="font-semibold text-xl text-gray-800">{userData.name}</h1>
            </div>
          </div>
          {/* Botões de Perfil/Logout para mobile, visíveis apenas se a tela for pequena e não houver espaço na direita */}
          <div className="flex items-center gap-3 sm:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('/profile')}
              className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              title="Perfil"
              aria-label="Ver perfil"
            >
              <MdPerson className="text-gray-600 text-lg" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-3 rounded-full bg-white shadow-md hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
              title="Sair"
              aria-label="Fazer logout"
            >
              <MdLogout className="text-red-500 text-lg" />
            </motion.button>
          </div>
        </div>

        {/* Centro: Seletor de Abas (Hoje / Semana) - Centralizado e com largura controlada */}
        <div className="w-full sm:w-auto flex-grow flex justify-center px-4 md:px-0">
          {/* Removido style={{ maxWidth: '300px', width: '100%' }} */}
          {/* Aumentado o padding horizontal nos botões individuais para deixá-los mais largos */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg p-1 flex border border-gray-100">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('today')}
              // Adicionado px-8 para aumentar o padding horizontal e, consequentemente, a largura do botão
              className={`flex-1 py-2.5 px-8 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'today' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-pressed={activeTab === 'today'}
              aria-label="Ver progresso de hoje"
            >
              Hoje
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('week')}
              // Adicionado px-8 para aumentar o padding horizontal e, consequentemente, a largura do botão
              className={`flex-1 py-2.5 px-8 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'week' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-pressed={activeTab === 'week'}
              aria-label="Ver progresso da semana"
            >
              Semana
            </motion.button>
          </div>
        </div>

        {/* Lado Direito: Ícones de Logout/Perfil - Visíveis apenas em telas maiores */}
        <div className="hidden sm:flex items-center gap-3 w-full sm:w-auto justify-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('/profile')}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            title="Perfil"
            aria-label="Ver perfil"
          >
            <MdPerson className="text-gray-600 text-lg" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-3 rounded-full bg-white shadow-md hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Sair"
            aria-label="Fazer logout"
          >
            <MdLogout className="text-red-500 text-lg" />
          </motion.button>
        </div>
      </div>

      {/* Conteúdo principal do dashboard */}
      <div className="w-full max-w-6xl mx-auto mt-8"> {/* Adicionamos um mt-8 para espaçar do cabeçalho refeito */}

        {activeTab === 'today' ? (
          <motion.div
            key="today-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Cards de Progresso Diário */}
            <div className={`grid ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-4'} gap-5 mb-10`}>
              <ProgressCard
                title="Calorias"
                current={userData.dailyProgress.calories.consumed}
                goal={userData.dailyProgress.calories.goal}
                icon={<MdTrackChanges className="text-blue-500 text-xl" />}
                color="blue"
                percentage={caloriesPercentage}
                unit="kcal"
              />
              <ProgressCard
                title="Água"
                current={userData.dailyProgress.water.consumed}
                goal={userData.dailyProgress.water.goal}
                icon={<MdWaterDrop className="text-cyan-500 text-xl" />}
                color="cyan"
                percentage={waterPercentage}
                unit="L"
              />
              <ProgressCard
                title="Passos"
                current={userData.dailyProgress.steps.toLocaleString()}
                goal="10k"
                icon={<MdFitnessCenter className="text-green-500 text-xl" />}
                color="green"
                percentage={stepsPercentage}
                unit=""
              />
              {/* Card de Atividade Queimada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Atividade Queimada</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {userData.dailyProgress.burnedCalories}
                      <span className="text-sm font-normal text-gray-400">kcal</span>
                    </h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <MdTimeline className="text-orange-500 text-xl" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 flex items-center">
                  <MdAccessTime className="mr-1 text-gray-400" />
                  +15% que ontem
                </div>
              </motion.div>
            </div>

            {/* Card da Próxima Refeição */}
            <NextMealCard
              meal={userData.dailyProgress.nextMeal}
              onAddClick={() => navigateTo('/meal-plan')}
            />

            {/* Lista de Refeições Registradas */}
            <MealsList
              meals={userData.meals}
              renderMealIcon={renderMealIcon}
              onViewAllClick={() => navigateTo('/meal-plan')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="week-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Resumo Semanal */}
            <WeeklySummary
              weeklyProgress={userData.weeklyProgress}
              renderTrendIcon={renderTrendIcon}
            />

            {/* Lista de Conquistas */}
            <AchievementsList
              achievements={userData.achievements}
              onViewAllClick={() => navigateTo('/achievements')}
            />
          </motion.div>
        )}

        {/* Dica Nutricional do Dia */}
        <DailyTip tip={userData.tips[Math.floor(Math.random() * userData.tips.length)]} />
      </div>

      {/* Navegação Mobile (fixa na parte inferior) */}
      <MobileNavigation />
    </div>
  );
}