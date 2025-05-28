"use client";

import { useEffect, useState, useCallback, memo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import { FiChevronLeft, FiPlus, FiClock, FiEdit, FiCheck, FiX, FiHeart, FiFilter, FiSliders, FiChevronDown, FiList, FiPaperclip, FiMoreHorizontal } from "react-icons/fi";
import { Coffee, UtensilsCrossed, ForkKnife, Apple, Dumbbell, Calendar as LucideCalendar, BarChart2, Info } from 'lucide-react';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type ActiveTabType = 'today' | 'upcoming' | 'favorites';

interface Meal {
  id: number; type: MealType; name: string; time: string; calories: number; registered: boolean;
  ingredients: string[]; isFavorite?: boolean; date?: string; notes?: string;
}

const MobileNavigation = dynamic(() => import('@/components/MobileNavigation'), {
  loading: () => <div className="h-16 bg-white/90 backdrop-blur-md shadow-top-soft rounded-t-2xl"></div>,
  ssr: false
});

const DAILY_CALORIE_GOAL = 2200;

// Função auxiliar para obter datas futuras formatadas (fora do componente para evitar recriação)
function getFutureDateString(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

export default function MealPlanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('today');
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMobileNav(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const initialMealsData: { today: Meal[]; upcoming: Meal[]; favorites: Meal[] } = {
    today: [
      { id: 1, type: "breakfast", name: "Overnight Oats com Chia e Frutas Vermelhas", time: "07:30", calories: 350, registered: true, ingredients: ["Aveia em flocos", "Sementes de Chia", "Leite de Amêndoas", "Morangos", "Mirtilos", "Xarope de Bordo (opcional)"], isFavorite: true, notes: "Preparar na noite anterior para facilitar a manhã." },
      { id: 2, type: "lunch", name: "Frango Assado com Limão e Alecrim, Quinoa e Brócolis", time: "12:45", calories: 520, registered: false, ingredients: ["Peito de Frango", "Limão Siciliano", "Alecrim Fresco", "Quinoa", "Brócolis Cozido no Vapor", "Azeite Extra Virgem"], isFavorite: false, notes: "Usar coxas de frango para mais sabor, se preferir." },
      { id: 3, type: "snack", name: "Maçã com Pasta de Amendoim Integral", time: "16:30", calories: 190, registered: true, ingredients: ["Maçã Fuji", "Pasta de Amendoim Integral (sem açúcar)"], isFavorite: true, notes: "" },
      { id: 4, type: "dinner", name: "Sopa Cremosa de Abóbora com Sementes Tostadas", time: "20:15", calories: 300, registered: false, ingredients: ["Abóbora Cabotian", "Caldo de Legumes Caseiro", "Creme de Leite Light (ou Leite de Coco)", "Sementes de Abóbora Tostadas", "Noz Moscada"], isFavorite: true, notes: "Servir com um fio de azeite e pimenta do reino." }
    ],
    upcoming: [
      { id: 5, type: "breakfast", name: "Tigela de Iogurte Grego com Granola e Pêssego", time: "08:00", calories: 320, registered: false, ingredients: ["Iogurte Grego Natural", "Granola Crocante", "Pêssego em Cubos", "Mel"], isFavorite: false, date: getFutureDateString(1), notes: "Adicionar lascas de amêndoas para crocância extra." },
      { id: 6, type: "lunch", name: "Salada Niçoise Moderna", time: "13:00", calories: 480, registered: false, ingredients: ["Atum em Conserva (em água)", "Ovos Cozidos", "Batata Cozida (pequena)", "Vagem Francesa", "Tomate Cereja", "Azeitonas Pretas", "Molho Vinagrete Dijon"], isFavorite: true, date: getFutureDateString(1) },
      { id: 7, type: "dinner", name: "Tacos de Peixe Grelhado com Molho de Manga", time: "19:30", calories: 460, registered: false, ingredients: ["Tilápia (ou outro peixe branco)", "Tortilhas de Milho Integrais", "Repolho Roxo Ralado", "Coentro Fresco", "Manga em Cubos", "Pimenta Jalapeño (opcional)", "Limão"], isFavorite: false, date: getFutureDateString(2) },
    ],
    favorites: []
  };

  const [mealsData, setMealsData] = useState(() => {
    const favorites = [...initialMealsData.today, ...initialMealsData.upcoming].filter(meal => meal.isFavorite);
    return { ...initialMealsData, favorites };
  });

  const renderMealIcon = useCallback((mealType: MealType): ReactNode => {
    const iconSize = 24; const iconProps = { size: iconSize, strokeWidth: 2 };
    const icons: Record<MealType, ReactNode> = {
      'breakfast': <Coffee {...iconProps} />, 'lunch': <UtensilsCrossed {...iconProps} />,
      'dinner': <ForkKnife {...iconProps} />, 'snack': <Apple {...iconProps} />
    };
    return icons[mealType] || <Dumbbell {...iconProps} />;
  }, []);

  const getMealTypeName = useCallback((type: MealType): string => {
    const names: Record<MealType, string> = { 'breakfast': 'Pequeno-almoço', 'lunch': 'Almoço', 'dinner': 'Jantar', 'snack': 'Lanche' };
    return names[type] || 'Refeição';
  }, []);

  const handleRegisterMeal = useCallback((mealId: number, listTypeToUpdate: keyof typeof mealsData) => {
    setMealsData(prevData => {
      const newRegisteredStatus = !prevData[listTypeToUpdate].find(m => m.id === mealId)?.registered;
      const updatedData = { ...prevData };
      for (const key in updatedData) {
        const listKey = key as keyof typeof mealsData;
        updatedData[listKey] = updatedData[listKey].map(meal => meal.id === mealId ? { ...meal, registered: newRegisteredStatus } : meal);
      }
      return updatedData;
    });
  }, []);

  const handleToggleFavorite = useCallback((mealId: number) => {
    setMealsData(prevData => {
      let mealToUpdate: Meal | undefined; let isCurrentlyFavorite = false;
      for (const key in prevData) {
        const listKey = key as keyof typeof mealsData;
        const found = prevData[listKey].find(m => m.id === mealId);
        if (found) { mealToUpdate = found; isCurrentlyFavorite = !!found.isFavorite; break; }
      }
      if (!mealToUpdate) return prevData;
      const newFavoriteStatus = !isCurrentlyFavorite;
      const updatedData = { ...prevData };
      for (const key in updatedData) {
        const listKey = key as keyof typeof mealsData;
        updatedData[listKey] = updatedData[listKey].map(meal => meal.id === mealId ? { ...meal, isFavorite: newFavoriteStatus } : meal);
      }
      if (newFavoriteStatus) { if (!updatedData.favorites.find(fav => fav.id === mealId)) { updatedData.favorites = [...updatedData.favorites, { ...mealToUpdate, isFavorite: true }]; } }
      else { updatedData.favorites = updatedData.favorites.filter(fav => fav.id !== mealId); }
      return updatedData;
    });
  }, []);

  const DailySummaryCard = memo(({ mealsToday }: { mealsToday: Meal[] }) => {
    const registeredCalories = mealsToday.filter(m => m.registered).reduce((sum, m) => sum + m.calories, 0);
    const percentage = Math.min(Math.round((registeredCalories / DAILY_CALORIE_GOAL) * 100), 100);
    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "circOut" }} className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-slate-200/60">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-slate-700 flex items-center"><BarChart2 size={18} className="mr-2 text-emerald-500" />Resumo de Hoje</h3>
          <span className="text-xs text-slate-500">Meta: {DAILY_CALORIE_GOAL} kcal</span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">{registeredCalories}</span>
            <span className="text-sm text-slate-500">kcal consumidas</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
          <motion.div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}/>
        </div>
      </motion.div>
    );
  });
  DailySummaryCard.displayName = "DailySummaryCard";
  
  const MealCard = memo(({ meal, listType }: { meal: Meal, listType: keyof typeof mealsData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const mealIconBgColor = meal.type === 'breakfast' ? 'bg-yellow-100 text-yellow-700' : meal.type === 'lunch' ? 'bg-sky-100 text-sky-700' : meal.type === 'dinner' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700';

    return (
      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: "circOut" }} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200/60 group relative overflow-hidden">
        {meal.isFavorite && <div className="absolute top-3 right-3 text-red-400"><FiHeart className="fill-current" size={16}/></div>}
        <div className="p-5">
          <div className="flex items-center gap-4 mb-3">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${mealIconBgColor}`}>{renderMealIcon(meal.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase font-semibold text-slate-500 tracking-wide">{getMealTypeName(meal.type)}</p>
              <h3 className="font-semibold text-slate-800 text-md sm:text-lg leading-tight truncate group-hover:text-emerald-600 transition-colors">{meal.name}</h3>
              <div className="flex items-center text-xs text-slate-400 mt-0.5">
                <FiClock className="mr-1 text-xs" /><span>{meal.time}</span>
                {meal.date && <span className="ml-2">({new Date(meal.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })})</span>}
              </div>
            </div>
            <motion.span layout transition={{duration:0.3}} className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${meal.registered ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>{meal.calories} kcal</motion.span>
          </div>
          
          <AnimatePresence>
          {isExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden mt-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center"><FiList size={12} className="mr-1.5"/>Ingredientes:</h4>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">{meal.ingredients.map((ing, idx) => (<span key={idx} className="bg-slate-100 text-slate-600 text-xxs px-2 py-0.5 rounded-md font-medium border border-slate-200/80">{ing}</span>))}</div>
                  {meal.notes && (<><h4 className="text-xs font-semibold text-slate-600 mb-1 mt-2 flex items-center"><FiPaperclip size={12} className="mr-1.5"/>Notas:</h4><p className="text-xs text-slate-500 italic">{meal.notes}</p></>)}
              </motion.div>
          )}
          </AnimatePresence>
        </div>
        <div className="px-5 pb-4 pt-2 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-slate-500 hover:text-emerald-600 py-1 group/expand flex items-center font-medium">
                <FiMoreHorizontal size={16} className="mr-1 group-hover/expand:text-emerald-500"/> Detalhes
            </button>
            <div className="flex items-center gap-2">
                <motion.button whileTap={{scale:0.9}} whileHover={{scale:1.1}} onClick={() => handleToggleFavorite(meal.id)} className={`p-1.5 rounded-full transition-colors duration-200 ${meal.isFavorite ? 'text-red-500 hover:bg-red-100/50' : 'text-slate-400 hover:text-red-500 hover:bg-red-100/50'}`} aria-label={meal.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}><FiHeart className={`text-lg ${meal.isFavorite ? 'fill-current' : ''}`} /></motion.button>
                {meal.registered ? (
                <motion.button layoutId={`register-btn-${meal.id}`} whileTap={{scale:0.9}} className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-lg cursor-default"><FiCheck className="mr-1.5 text-sm" /> Registado</motion.button>
                ) : (
                <motion.button layoutId={`register-btn-${meal.id}`} whileTap={{scale:0.9}} onClick={() => handleRegisterMeal(meal.id, activeTab === 'today' ? 'today' : activeTab === 'upcoming' ? 'upcoming' : 'favorites')} className="flex items-center text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:scale-105"><FiCheck className="mr-1.5 text-sm" /> Registar</motion.button>
                )}
            </div>
        </div>
      </motion.div>
    );
  });
  MealCard.displayName = "MealCard";
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
  let currentList: Meal[] = []; let tabTitle = ""; let groupedUpcomingMeals: { [date: string]: Meal[] } = {};

  if (activeTab === 'today') { currentList = mealsData.today; tabTitle = 'Refeições de Hoje'; }
  else if (activeTab === 'upcoming') {
    tabTitle = 'Próximas Refeições';
    mealsData.upcoming.forEach(meal => { const dateStr = meal.date || 'Sem Data'; if (!groupedUpcomingMeals[dateStr]) { groupedUpcomingMeals[dateStr] = []; } groupedUpcomingMeals[dateStr].push(meal); });
  } else if (activeTab === 'favorites') { currentList = mealsData.favorites; tabTitle = 'Refeições Favoritas'; }
  
  const formatDateHeader = (dateStr: string) => {
    if (dateStr === 'Sem Data') return 'Sem Data Específica';
    const today = new Date(); const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const date = new Date(dateStr + 'T00:00:00');
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã - ' + date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pb-24 sm:pb-28 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <header className="w-full max-w-3xl flex justify-between items-center py-4 md:py-5 sticky top-0 bg-slate-100/80 backdrop-blur-lg z-30 rounded-b-xl px-4 md:px-0 mb-4 sm:mb-5 border-b border-slate-200/70">
        <motion.button whileTap={{scale:0.9}} onClick={() => router.back()} className="text-slate-600 hover:text-emerald-600 flex items-center transition-colors -ml-2 p-2 rounded-lg group" aria-label="Voltar">
          <FiChevronLeft className="mr-0.5 sm:mr-1 text-xl group-hover:-translate-x-0.5 transition-transform" /><span className="text-sm font-medium hidden sm:inline">Voltar</span>
        </motion.button>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Plano Alimentar</h1>
        <motion.button whileTap={{scale:0.9}} whileHover={{scale:1.05, rotate:10}} onClick={() => router.push('/meal-plan/add')} className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" aria-label="Adicionar nova refeição">
          <FiPlus className="text-lg sm:text-xl" />
        </motion.button>
      </header>

      <div className="w-full max-w-3xl mb-5 sm:mb-6">
        <div className="flex bg-white p-1 rounded-xl shadow-md border border-slate-200/80">
          {(['today', 'upcoming', 'favorites'] as ActiveTabType[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full py-2 sm:py-2.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${activeTab === tab ? "text-emerald-700" : "text-slate-500 hover:text-emerald-600"}`} aria-pressed={activeTab === tab}>
              {activeTab === tab && (<motion.div layoutId="activeMealPlanPillV4" className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm rounded-lg z-0 border border-emerald-500/30" transition={{ type: "spring", stiffness: 350, damping: 35 }} />)}
              <span className="relative z-10 capitalize">{tab === 'today' ? 'Hoje' : tab === 'upcoming' ? 'Próximas' : 'Favoritas'}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'today' && <DailySummaryCard mealsToday={mealsData.today} />}
            <div className="flex justify-between items-center px-1 mb-3 sm:mb-4">
                <h2 className="text-md sm:text-lg font-semibold text-slate-700">{tabTitle}</h2>
                {activeTab === 'favorites' && currentList.length > 0 && (<div className="flex gap-2"><button className="text-xs p-1.5 px-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center shadow-xs hover:shadow-sm transition-shadow"><FiFilter size={12} className="mr-1"/> Filtrar</button><button className="text-xs p-1.5 px-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center shadow-xs hover:shadow-sm transition-shadow"><FiSliders size={12} className="mr-1"/> Ordenar</button></div>)}
            </div>
            {activeTab === 'upcoming' ? (
                Object.keys(groupedUpcomingMeals).length > 0 ? (
                    <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                    {Object.entries(groupedUpcomingMeals).sort((a,b) => new Date(a[0]).getTime() - new Date(b[0]).getTime() ).map(([date, mealsInDate]) => (
                        <div key={date}>
                        <h3 className="text-sm font-semibold text-emerald-700 mb-2.5 ml-1 sticky top-[calc(theme(spacing.16)_-_1px)] sm:top-[calc(theme(spacing.20)_-_1px)] bg-slate-100/80 backdrop-blur-sm py-1.5 px-2 rounded-md z-10 shadow-sm border-b border-slate-200">{formatDateHeader(date)}</h3>
                        <div className="space-y-3 sm:space-y-4">{mealsInDate.map(meal => <MealCard key={meal.id} meal={meal} listType="upcoming" />)}</div>
                        </div>
                    ))}
                    </motion.div>
                ) : ( <EmptyStateContent tab={activeTab} router={router}/> )
            ) : ( currentList.length > 0 ? ( <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 sm:space-y-4">{currentList.map((meal) => ( <MealCard key={meal.id} meal={meal} listType={activeTab} /> ))}</motion.div>)
                : ( <EmptyStateContent tab={activeTab} router={router}/> )
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {showMobileNav && <MobileNavigation />}
    </div>
  );
}

const EmptyStateContent = ({tab, router} : {tab: ActiveTabType, router: any}) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration:0.3 }} className="text-center py-10 sm:py-14 bg-white rounded-2xl shadow-lg border border-slate-200/60 max-w-xl mx-auto mt-0">
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 sm:mb-5 shadow-inner">
            {tab === 'favorites' ? <FiHeart size={28} className="text-slate-400" /> : tab === 'upcoming' ? <LucideCalendar size={28} className="text-slate-400" /> : <FiList size={28} className="text-slate-400" />}
        </div>
        <h3 className="text-slate-700 font-semibold text-md sm:text-lg mb-1.5">
            {tab === 'favorites' ? 'Ainda sem favoritos' : tab === 'upcoming' ? 'Nada planeado por agora' : 'Nenhuma refeição aqui'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mb-5 max-w-xs mx-auto">
            {tab === 'favorites' ? 'Adicione as suas refeições preferidas para acesso rápido!' : 'Que tal adicionar algumas delícias ao seu plano?'}
        </p>
        <motion.button whileHover={{scale:1.03, y:-1}} whileTap={{scale:0.98}} onClick={() => router.push('/meal-plan/add')} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all inline-flex items-center">
            <FiPlus className="mr-1.5 text-md" /> {tab === 'favorites' ? 'Explorar Refeições' : 'Planejar Refeição'}
        </motion.button>
    </motion.div>
);