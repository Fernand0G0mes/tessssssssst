"use client";

import { useEffect, useState, useCallback, memo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdHome, MdTimeline, MdFitnessCenter, MdEmojiEvents, MdPerson,
  MdCalendarToday, MdAdd, MdWaterDrop, MdTrackChanges, MdEdit,
  MdInfo, MdCheckCircle, MdAccessTime, MdFavorite, MdChevronRight,
  MdTrendingUp, MdLogout, MdLocalDining, MdBreakfastDining, MdLunchDining, MdDinnerDining, MdFastfood,
  MdOutlineInsights, MdOutlinePalette // Novos ícones para exemplo
} from "react-icons/md";

// Tipos (mantidos como no original)
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'main';
type TrendType = 'up' | 'down' | 'stable';

interface Meal { type: MealType; name: string; calories: number; registered: boolean; }
interface Achievement { id: number; title: string; earned: boolean; }
interface ProgressData { consumed: number; goal: number; unit?: string; }
interface TrendData { avg: number; trend: TrendType; }
interface NextMeal { name: string; time: string; type: string; }

interface UserData {
  name: string; photo: string;
  dailyProgress: {
    calories: ProgressData; macros: { protein: number; carbs: number; fats: number };
    water: ProgressData; nextMeal: NextMeal; burnedCalories: number; steps: number;
  };
  weeklyProgress: { calories: TrendData; water: TrendData; activity: TrendData; };
  meals: Meal[]; achievements: Achievement[]; tips: string[];
}

interface ProgressCardProps {
  title: string; current: number | string; goal: number | string; icon: ReactNode;
  colorClass: string; // Alterado para usar classes de cor Tailwind
  percentage: number; unit?: string;
}

interface NextMealCardProps { meal: NextMeal; onAddClick: () => void; renderMealIcon: (type: MealType) => ReactNode; }
interface MealItemProps { meal: Meal; renderMealIcon: (type: MealType) => ReactNode; }
interface MealsListProps { meals: Meal[]; renderMealIcon: (type: MealType) => ReactNode; onViewAllClick: () => void; }
interface WeeklySummaryProps { weeklyProgress: UserData['weeklyProgress']; renderTrendIcon: (trend: TrendType) => ReactNode; }
interface AchievementsListProps { achievements: Achievement[]; onViewAllClick: () => void; }
interface DailyTipProps { tip: string; }

// Componentes
const MobileNavigation = dynamic(() => import("../components/MobileNavigation"), { // Adapte o caminho se necessário
  loading: () => <div className="h-16 bg-white/80 backdrop-blur-md shadow-top-soft rounded-t-2xl"></div>,
  ssr: false
});

// Hooks personalizados (mantido, mas dados ainda mockados)
const useUserData = (currentUser: User | null): UserData => {
  return {
    name: currentUser?.displayName || "Nutri Explorer",
    photo: currentUser?.photoURL || "/user-default.png", // Garanta que tem /user-default.png em public/
    dailyProgress: {
      calories: { consumed: 1350, goal: 2000 },
      macros: { protein: 90, carbs: 160, fats: 50 },
      water: { consumed: 1.9, goal: 2.7, unit: 'L' },
      nextMeal: { name: "Almoço Leve", time: "13:00", type: "lunch" },
      burnedCalories: 380, steps: 8200,
    },
    weeklyProgress: {
      calories: { avg: 1600, trend: 'stable' },
      water: { avg: 2.2, trend: 'up' },
      activity: { avg: 410, trend: 'up' }
    },
    meals: [
      { type: "breakfast", name: "Smoothie Verde", calories: 350, registered: true },
      { type: "lunch", name: "Wrap de Frango", calories: 520, registered: true },
      { type: "snack", name: "Maçã e Amêndoas", calories: 180, registered: false },
      { type: "dinner", name: "Salmão com Quinoa", calories: 600, registered: false }
    ],
    achievements: [
      { id: 1, title: "Hidratação Mestre", earned: true },
      { id: 2, title: "Semana Fitness", earned: true },
      { id: 3, title: "Explorador de Sabores", earned: false }
    ],
    tips: [
      "Planeie as suas refeições com antecedência para fazer escolhas mais saudáveis.",
      "Experimente uma nova receita saudável esta semana!",
      "Mastigue devagar para melhorar a digestão e a saciedade."
    ]
  };
};

// --- COMPONENTES DE UI REFINADOS ---

const ProgressCard = memo(({ title, current, goal, icon, colorClass, percentage, unit }: ProgressCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
    transition={{ duration: 0.3, ease: "circOut" }}
    className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100/80 cursor-pointer overflow-hidden"
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-xs text-gray-500 mb-0.5 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {current}
          <span className="text-sm font-normal text-gray-400 ml-1">/ {goal}{unit}</span>
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}-100`}> {/* Ex: bg-blue-100 */}
        {icon} {/* O ícone já deve ter sua cor, ex: <Md... className="text-blue-500" /> */}
      </div>
    </div>
    <div className="w-full bg-gray-200/70 rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${colorClass}-500`} /* Ex: bg-blue-500 */
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: "circOut", delay: 0.2 }}
        role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}
      />
    </div>
  </motion.div>
));
ProgressCard.displayName = "ProgressCard";

const NextMealCard = memo(({ meal, onAddClick, renderMealIcon }: NextMealCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1, ease: "circOut" }}
    className="w-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 p-6 sm:p-7 rounded-3xl shadow-xl mb-8 sm:mb-12 text-white relative overflow-hidden group"
  >
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 ease-out"></div>
    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 ease-out"></div>
    
    <div className="flex justify-between items-center z-10 relative">
      <div className="flex items-center">
        <div className="bg-white/20 p-3 sm:p-4 rounded-xl mr-4 text-3xl sm:text-4xl">
            {renderMealIcon(meal.type as MealType)}
        </div>
        <div>
            <p className="text-xs sm:text-sm opacity-80 mb-0.5 font-light">PRÓXIMA REFEIÇÃO</p>
            <h3 className="text-xl sm:text-2xl font-semibold mb-0.5">{meal.name}</h3>
            <p className="text-sm sm:text-md opacity-90 font-medium flex items-center">
            <MdAccessTime className="mr-1.5 text-base" /> {meal.time}
            </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(255,255,255,1)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="bg-white/90 text-blue-600 p-3.5 sm:p-4 rounded-xl hover:bg-white transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
        aria-label="Adicionar refeição"
      >
        <MdAdd className="text-lg sm:text-xl" />
      </motion.button>
    </div>
  </motion.div>
));
NextMealCard.displayName = "NextMealCard";

const MealItem = memo(({ meal, renderMealIcon }: MealItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, ease: "circOut" }}
    className="bg-white p-4 rounded-xl shadow-md border border-gray-100/90 hover:shadow-lg transform hover:-translate-y-px transition-all duration-200 flex items-center justify-between"
  >
    <div className="flex items-center">
      <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 text-gray-600" role="img" aria-label={meal.type}>{renderMealIcon(meal.type)}</span>
      <div>
        <p className="text-sm sm:text-base font-medium text-gray-700">
          {meal.type === 'breakfast' ? 'Pequeno-almoço' : meal.type === 'lunch' ? 'Almoço' : meal.type === 'dinner' ? 'Jantar' : 'Lanche'}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          {meal.registered ? meal.name : 'Não registada'}
        </p>
      </div>
    </div>
    <div className="flex items-center">
        <span className={`text-sm sm:text-base ${meal.registered ? 'font-semibold text-gray-700' : 'text-gray-400 italic'}`}>
        {meal.registered ? `${meal.calories} kcal` : '--'}
        </span>
        {meal.registered && (
        <motion.div initial={{ opacity: 0, scale:0.5 }} animate={{ opacity: 1, scale:1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }} className="ml-2 sm:ml-3 text-green-500">
            <MdCheckCircle className="text-lg sm:text-xl" />
        </motion.div>
        )}
    </div>
  </motion.div>
));
MealItem.displayName = "MealItem";

const MealsList = memo(({ meals, renderMealIcon, onViewAllClick }: MealsListProps) => (
  <div className="w-full mb-8 sm:mb-12">
    <div className="flex justify-between items-center mb-4 sm:mb-5">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Refeições de Hoje</h2>
      <motion.button
        whileHover={{ x: 3 }} whileTap={{scale: 0.95}}
        onClick={onViewAllClick}
        className="text-sm sm:text-md text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center group"
        aria-label="Ver todas as refeições"
      >
        Ver Plano <MdChevronRight className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {meals.map((meal, index) => (
        <motion.div key={meal.name + index} custom={index} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.3, ease: "circOut" } }) }}>
           <MealItem meal={meal} renderMealIcon={renderMealIcon} />
        </motion.div>
      ))}
    </div>
  </div>
));
MealsList.displayName = "MealsList";

const WeeklySummary = memo(({ weeklyProgress, renderTrendIcon }: WeeklySummaryProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "circOut" }}
    className="bg-white p-6 sm:p-7 rounded-2xl shadow-xl border border-gray-100/90 mb-8 sm:mb-12"
  >
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 sm:mb-6 flex items-center">
        <MdOutlineInsights className="mr-2 text-blue-600 text-2xl" />Resumo Semanal
    </h2>
    <div className="space-y-5 sm:space-y-6">
      {Object.entries(weeklyProgress).map(([key, data], index) => (
        <motion.div key={key} custom={index} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.3, ease: "circOut" } }) }}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm sm:text-md text-gray-600 font-medium capitalize">{key === 'calories' ? 'Calorias (média)' : key === 'water' ? 'Água (média)' : 'Atividade (média)'}</span>
            <span className="text-sm sm:text-md font-bold text-gray-800 flex items-center">
              {data.avg}{key === 'water' ? 'L' : 'kcal'}
              <span className="ml-2 text-lg">{renderTrendIcon(data.trend)}</span>
            </span>
          </div>
          <div className="w-full bg-gray-200/80 rounded-full h-2">
            <motion.div
                className={`h-2 rounded-full ${key === 'calories' ? 'bg-blue-500' : key === 'water' ? 'bg-cyan-400' : 'bg-green-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(data.avg / (key === 'water' ? 3 : (key === 'calories' ? 2000 : 500)) * 100, 100)}%` }} // Metas exemplo
                transition={{ duration: 0.6, ease: "circOut", delay: 0.2 + index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
));
WeeklySummary.displayName = "WeeklySummary";

const AchievementsList = memo(({ achievements, onViewAllClick }: AchievementsListProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "circOut" }}
    className="bg-white p-6 sm:p-7 rounded-2xl shadow-xl border border-gray-100/90 mb-8 sm:mb-12"
  >
    <div className="flex justify-between items-center mb-5 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Conquistas Recentes</h2>
      <motion.button whileHover={{ x: 3 }} whileTap={{scale: 0.95}} onClick={onViewAllClick} className="text-sm sm:text-md text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center group" aria-label="Ver todas as conquistas">
        Ver Todas <MdChevronRight className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
      {achievements.slice(0,3).map((achievement, index) => ( // Mostrar apenas 3 recentes
        <motion.div
          key={achievement.id} custom={index} initial="hidden" animate="visible"
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.3, ease: "backOut" } }) }}
          whileHover={{ y: -3, boxShadow: achievement.earned ? "0 8px 15px rgba(250, 204, 21, 0.25)" : "0 8px 15px rgba(0, 0, 0, 0.08)" }}
          className={`p-4 sm:p-5 rounded-xl text-center border ${achievement.earned ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-200 bg-gray-50 shadow-sm opacity-90'} transition-all duration-200 cursor-pointer`}
          aria-label={`Conquista: ${achievement.title} ${achievement.earned ? '(conquistada)' : ''}`}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-3 ${achievement.earned ? 'bg-yellow-400 text-white shadow-inner' : 'bg-gray-200 text-gray-400'}`}>
            <MdEmojiEvents className="text-xl sm:text-2xl" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{achievement.title}</p>
          {achievement.earned && <p className="text-xxs sm:text-xs text-yellow-600 mt-0.5">Conquistado!</p>}
        </motion.div>
      ))}
    </div>
  </motion.div>
));
AchievementsList.displayName = "AchievementsList";

const DailyTip = memo(({ tip }: DailyTipProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
    className="w-full bg-gradient-to-br from-purple-500 to-fuchsia-500 p-6 sm:p-7 rounded-3xl shadow-xl mb-8 sm:mb-12 text-white transform hover:scale-[1.02] transition-transform duration-300 ease-out group"
  >
     <div className="absolute -top-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-xl opacity-80 group-hover:scale-125 transition-transform duration-500 ease-out"></div>
    <div className="flex items-start relative z-10">
      <div className="bg-white/20 p-3 sm:p-4 rounded-xl mr-3 sm:mr-4 flex-shrink-0">
        <MdOutlinePalette className="text-white text-xl sm:text-2xl" /> {/* Ícone diferente para "Dica" */}
      </div>
      <div>
        <h3 className="text-md sm:text-lg font-semibold mb-1 sm:mb-1.5">Dica Nutrana Para Si</h3>
        <p className="text-sm sm:text-md leading-relaxed opacity-95">{tip}</p>
      </div>
    </div>
  </motion.div>
));
DailyTip.displayName = "DailyTip";


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);


  useEffect(() => {
    // Mostrar navegação mobile apenas após uma pequena espera para evitar flash no SSR/primeiro render
    const timer = setTimeout(() => setShowMobileNav(true), 300);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      if (!user && !isLoading) router.push("/"); // Redireciona se não houver usuário e não estiver carregando
    }, (error) => {
      setError("Erro ao verificar autenticação. Tente recarregar.");
      setIsLoading(false);
      console.error("Auth error:", error);
    });
    return () => unsubscribe();
  }, [router, isLoading]); // Adicionado isLoading para evitar redirect prematuro

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true); // Mostra feedback de carregamento
      await signOut(auth);
      router.push("/"); // Redireciona após logout
    } catch (error) {
      setError("Falha ao fazer logout. Tente novamente.");
      console.error("Error signing out: ", error);
      setIsLoading(false);
    }
  }, [router]);

  const navigateTo = useCallback((path: string) => router.push(path), [router]);

  const renderMealIcon = useCallback((mealType: MealType) => {
    const icons: Record<MealType, ReactNode> = {
      breakfast: <MdBreakfastDining />, lunch: <MdLunchDining />, dinner: <MdDinnerDining />,
      snack: <MdFastfood />, main: <MdLocalDining />
    };
    return icons[mealType] || <MdLocalDining />;
  }, []);

  const renderTrendIcon = useCallback((trend: TrendType) => {
    if (trend === 'up') return <MdTrendingUp className="text-green-500" />;
    if (trend === 'down') return <MdTrendingUp className="text-red-500 transform rotate-180" />; // Corrigido para rotate-180
    return <span className="text-gray-400 font-bold">—</span>;
  }, []);

  const userData = useUserData(currentUser); // Dados ainda mockados

  const caloriesPercentage = Math.min(Math.round((userData.dailyProgress.calories.consumed / userData.dailyProgress.calories.goal) * 100), 100);
  const waterPercentage = Math.min(Math.round((userData.dailyProgress.water.consumed / userData.dailyProgress.water.goal) * 100), 100);
  const stepsPercentage = Math.min(Math.round((userData.dailyProgress.steps / 10000) * 100), 100); // Meta fixa de 10k passos

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
        <div className="text-center p-8">
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 border-4 border-blue-500 border-t-blue-200 rounded-full mx-auto mb-6 shadow-lg"
          />
          <p className="text-gray-700 text-lg font-medium tracking-wide">Preparando seu plano...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
            <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type: "spring", stiffness:200, delay:0.1}} className="text-red-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </motion.div>
            <h2 className="text-2xl font-bold mb-3 text-red-700">Oops! Algo correu mal.</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setError(null); setIsLoading(true); /* Forçar re-check da auth */ onAuthStateChanged(auth, u => setCurrentUser(u), () => setIsLoading(false)); }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 ring-offset-2 focus:ring-red-500">
                Tentar Novamente
            </motion.button>
            </div>
        </div>
    );
  }
  
  if (!currentUser) { // Se, após o carregamento, não houver usuário, não renderiza o dashboard. O useEffect já redireciona.
    return null; // Ou um fallback mais elegante
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "circOut" } }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center px-4 sm:px-6 lg:px-8 pb-24 sm:pb-28 font-sans text-gray-800 selection:bg-blue-200 selection:text-blue-800">
      {/* Header Modernizado */}
      <header className="w-full max-w-6xl mx-auto sticky top-0 z-40 bg-blue-50/80 backdrop-blur-md py-4 px-2 sm:px-0 rounded-b-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }} whileTap={{scale:0.95}}
              onClick={() => navigateTo('/profile')}
              className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
            >
              <Image src={userData.photo} alt={userData.name} width={56} height={56} className="object-cover" priority />
            </motion.div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-light">Bem-vindo(a),</p>
              <h1 className="font-semibold text-md sm:text-lg text-gray-800 truncate max-w-[150px] sm:max-w-xs">{userData.name}</h1>
            </div>
          </div>

          {/* Seletor de Abas (Hoje/Semana) com Animação */}
          <div className="hidden sm:flex bg-white/70 p-1 rounded-xl shadow-md border border-gray-200/80">
            {(['today', 'week'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                            ${activeTab === tab ? "text-blue-700" : "text-gray-600 hover:text-blue-600"}`}
                aria-pressed={activeTab === tab}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-lg z-0 border border-blue-500/30"
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab === 'today' ? 'Hoje' : 'Semana'}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => navigateTo('/profile')} className="hidden sm:block p-2.5 rounded-full bg-white/80 shadow hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" title="Perfil" aria-label="Ver perfil">
              <MdPerson className="text-gray-600 text-xl" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="p-2.5 rounded-full bg-white/80 shadow hover:bg-red-50/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" title="Sair" aria-label="Fazer logout">
              <MdLogout className="text-red-500 text-xl" />
            </motion.button>
          </div>
        </div>
         {/* Seletor de Abas (Hoje/Semana) para Mobile - abaixo do header */}
        <div className="sm:hidden mt-4 flex justify-center">
            <div className="bg-white/70 p-1 rounded-xl shadow-md border border-gray-200/80 inline-flex">
            {(['today', 'week'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                            ${activeTab === tab ? "text-blue-700" : "text-gray-600 hover:text-blue-600"}`}
                aria-pressed={activeTab === tab}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeMobilePill"
                    className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-lg z-0 border border-blue-500/30"
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab === 'today' ? 'Hoje' : 'Semana'}</span>
              </button>
            ))}
            </div>
        </div>
      </header>

      {/* Conteúdo principal do dashboard */}
      <main className="w-full max-w-6xl mx-auto mt-0 sm:mt-6"> {/* Reduzido mt para desktop já que header tem mb */}
        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <motion.div
              key="today-content" variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
            >
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-8 sm:mb-12`}>
                <motion.div variants={itemVariants}>
                    <ProgressCard title="Calorias" current={userData.dailyProgress.calories.consumed} goal={userData.dailyProgress.calories.goal} icon={<MdTrackChanges className="text-blue-500 text-xl" />} colorClass="bg-blue" percentage={caloriesPercentage} unit="kcal" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ProgressCard title="Água" current={userData.dailyProgress.water.consumed} goal={userData.dailyProgress.water.goal} icon={<MdWaterDrop className="text-cyan-500 text-xl" />} colorClass="bg-cyan" percentage={waterPercentage} unit={userData.dailyProgress.water.unit} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ProgressCard title="Passos" current={userData.dailyProgress.steps.toLocaleString()} goal="10k" icon={<MdFitnessCenter className="text-green-500 text-xl" />} colorClass="bg-green" percentage={stepsPercentage} unit="" />
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100/80 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div><p className="text-xs text-gray-500 mb-0.5">Calorias Queimadas</p><h3 className="text-2xl font-bold text-gray-800">{userData.dailyProgress.burnedCalories}<span className="text-sm font-normal text-gray-400"> kcal</span></h3></div>
                    <div className="bg-orange-100 p-3 rounded-xl"><MdTimeline className="text-orange-500 text-xl" /></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center"><MdAccessTime className="mr-1 text-gray-400" />+15% vs ontem (exemplo)</p>
                </motion.div>
              </div>
              <motion.div variants={itemVariants}>
                <NextMealCard meal={userData.dailyProgress.nextMeal} onAddClick={() => navigateTo('/meal-plan')} renderMealIcon={renderMealIcon} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MealsList meals={userData.meals} renderMealIcon={renderMealIcon} onViewAllClick={() => navigateTo('/meal-plan')} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="week-content" variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
            >
              <motion.div variants={itemVariants}>
                <WeeklySummary weeklyProgress={userData.weeklyProgress} renderTrendIcon={renderTrendIcon} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AchievementsList achievements={userData.achievements} onViewAllClick={() => navigateTo('/achievements')} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div variants={itemVariants} initial="hidden" animate="visible" > {/* Animação para a dica também */}
            <DailyTip tip={userData.tips[Math.floor(Math.random() * userData.tips.length)]} />
        </motion.div>
      </main>

      {/* Navegação Mobile (fixa na parte inferior) */}
      {showMobileNav && <MobileNavigation />}
    </div>
  );
}