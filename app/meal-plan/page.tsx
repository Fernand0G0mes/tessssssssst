'use client';
import MobileNavigation from '@/components/MobileNavigation';
import { useRouter } from 'next/navigation';
import { 
  FiChevronLeft,
  FiPlus,
  FiClock,
  FiEdit,
  FiCheck,
  FiX
} from "react-icons/fi"; // Mantendo os ícones de ação e navegação da Feather Icons

import { 
  Coffee,         // Para café da manhã
  UtensilsCrossed, // Para almoço
  ForkKnife,      // CORRIGIDO: Era ForkAndKnife, agora ForkKnife para jantar
  Apple,          // Para lanche
  Dumbbell,       // Ícone padrão/genérico (ex: se o tipo de refeição não for mapeado)
  Calendar        // Para o estado vazio de "Próximas Refeições"
} from 'lucide-react'; // Importando ícones da Lucide React

type Meal = {
  id: number;
  type: string;
  name: string;
  time: string;
  calories: number;
  registered: boolean;
  ingredients: string[];
};

export default function MealPlanPage() {
  const router = useRouter();

  // Dados mockados
  const mealsData = {
    today: [
      {
        id: 1,
        type: "breakfast",
        name: "Vitamina de Banana com Aveia",
        time: "08:30",
        calories: 320,
        registered: true,
        ingredients: ["Banana", "Aveia", "Leite", "Mel"]
      },
      {
        id: 2,
        type: "lunch",
        name: "Salada de Quinoa com Frango Grelhado",
        time: "12:30",
        calories: 450,
        registered: false,
        ingredients: ["Quinoa", "Frango", "Tomate", "Pepino", "Abacate"]
      },
      {
        id: 3,
        type: "snack",
        name: "Iogurte Natural com Granola",
        time: "16:00",
        calories: 180,
        registered: true,
        ingredients: ["Iogurte natural", "Granola", "Mel"]
      },
      {
        id: 4,
        type: "dinner",
        name: "Sopa de Legumes com Gengibre",
        time: "20:00",
        calories: 280,
        registered: false,
        ingredients: ["Abóbora", "Cenoura", "Batata", "Gengibre", "Coentro"]
      }
    ] as Meal[],
    upcoming: [
      {
        id: 5,
        type: "breakfast",
        name: "Omelete de Espinafre com Queijo Feta",
        time: "08:00",
        calories: 290,
        registered: false,
        ingredients: ["Ovos", "Espinafre", "Queijo Feta", "Tomate Cereja"]
      },
      {
        id: 6,
        type: "lunch",
        name: "Wrap de Grão de Bico e Vegetais",
        time: "13:00",
        calories: 380,
        registered: false,
        ingredients: ["Grão de Bico", "Tortilla Integral", "Alface", "Cenoura"]
      }
    ] as Meal[]
  };

  // Função para renderizar os ícones modernos de acordo com o tipo de refeição
  const renderMealIcon = (mealType: string) => {
    const icons = {
      'breakfast': <Coffee size={28} />, // Ícone de café
      'lunch': <UtensilsCrossed size={28} />, // Ícone de talheres cruzados
      'dinner': <ForkKnife size={28} />, // Ícone de garfo e faca (CORRIGIDO)
      'snack': <Apple size={28} /> // Ícone de maçã
    };
    // Retorna o ícone específico ou um ícone padrão se não houver correspondência
    return icons[mealType as keyof typeof icons] || <Dumbbell size={28} />; 
  };

  const getMealTypeName = (type: string) => {
    const names = {
      'breakfast': 'Café da Manhã',
      'lunch': 'Almoço',
      'dinner': 'Jantar',
      'snack': 'Lanche'
    };
    return names[type as keyof typeof names] || 'Refeição';
  };

  const handleRegisterMeal = (mealId: number) => {
    console.log(`Meal ${mealId} registered`);
    // Em uma aplicação real, você atualizaria o estado ou chamaria uma API aqui
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col items-center px-4 pb-20 font-sans">
      {/* Cabeçalho Moderno */}
      <div className="w-full max-w-3xl flex justify-between items-center py-5 md:py-6 sticky top-0 bg-white/90 backdrop-blur-md z-10 rounded-b-xl shadow-sm px-4 md:px-6">
        <button 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 flex items-center transition-all duration-200 ease-in-out -ml-2 p-2 rounded-lg"
        >
          <FiChevronLeft className="mr-1 text-xl" />
          <span className="text-sm font-medium hidden sm:inline">Voltar</span>
        </button>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Plano Nutricional</h1>
        <button 
          onClick={() => router.push('/add-meal')}
          className="bg-gradient-to-br from-lime-500 to-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          aria-label="Adicionar nova refeição"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      {/* Abas */}
      <div className="w-full max-w-3xl mb-8 mt-6">
        <div className="flex border-b-2 border-gray-100">
          <button className="flex-1 py-3 px-4 text-center font-semibold text-base border-b-3 border-lime-500 text-lime-600 transition-colors duration-200 ease-in-out">
            Hoje
          </button>
          <button className="flex-1 py-3 px-4 text-center font-medium text-base text-gray-500 hover:text-gray-700 transition-colors duration-200 ease-in-out">
            Próximos Dias
          </button>
          <button className="flex-1 py-3 px-4 text-center font-medium text-base text-gray-500 hover:text-gray-700 transition-colors duration-200 ease-in-out">
            Favoritos
          </button>
        </div>
      </div>

      {/* Seção de Refeições de Hoje */}
      <div className="w-full max-w-3xl space-y-5 mb-8">
        <h2 className="text-xl font-bold text-gray-800 px-2 mb-4">Refeições de Hoje</h2>
        
        {mealsData.today.map((meal) => (
          <div 
            key={meal.id} 
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              {/* Renderiza o ícone da refeição com o estilo Lucide */}
              <div className="bg-lime-100 text-lime-600 rounded-xl p-3 flex items-center justify-center min-w-[56px] min-h-[56px] shadow-sm">
                {renderMealIcon(meal.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">{getMealTypeName(meal.type)}</span>
                    <h3 className="font-extrabold text-gray-800 text-lg mt-1 leading-tight">{meal.name}</h3>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                    meal.registered 
                      ? 'bg-lime-500 text-white shadow-sm' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {meal.calories} kcal
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiClock className="mr-2 text-base" />
                    <span>{meal.time}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {meal.ingredients.slice(0, 3).map((ingredient, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {meal.ingredients.length > 3 && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full font-medium">
                        +{meal.ingredients.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end gap-3">
              {meal.registered ? (
                <button 
                  className="flex items-center text-sm font-semibold text-lime-700 bg-lime-100 px-5 py-2.5 rounded-lg opacity-90 cursor-not-allowed transition-colors duration-200 ease-in-out"
                  disabled
                >
                  <FiCheck className="mr-2 text-base" /> Registrado
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => console.log(`Edit meal ${meal.id}`)}
                    className="flex items-center text-sm font-semibold text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                  >
                    <FiEdit className="mr-2 text-base" /> Editar
                  </button>
                  <button 
                    onClick={() => handleRegisterMeal(meal.id)}
                    className="flex items-center text-sm font-semibold text-white bg-gradient-to-r from-lime-500 to-green-500 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FiCheck className="mr-2 text-base" /> Registrar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Próximas Refeições */}
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-bold text-gray-800 px-2 mb-5">Próximas Refeições</h2>
        
        {mealsData.upcoming.length > 0 ? (
          <div className="space-y-5">
            {mealsData.upcoming.map((meal) => (
              <div 
                key={meal.id} 
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  {/* Renderiza o ícone da refeição com o estilo Lucide */}
                  <div className="bg-blue-100 text-blue-600 rounded-xl p-3 flex items-center justify-center min-w-[56px] min-h-[56px] shadow-sm">
                    {renderMealIcon(meal.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">{getMealTypeName(meal.type)}</span>
                        <h3 className="font-extrabold text-gray-800 text-lg mt-1 leading-tight">{meal.name}</h3>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 px-3 py-1.5 rounded-full bg-gray-100 whitespace-nowrap">
                        {meal.calories} kcal
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FiClock className="mr-2 text-base" />
                        <span>{meal.time}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {meal.ingredients.slice(0, 3).map((ingredient, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {meal.ingredients.length > 3 && (
                          <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full font-medium">
                            +{meal.ingredients.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end gap-3">
                  <button 
                    onClick={() => console.log(`Cancel meal ${meal.id}`)}
                    className="flex items-center text-sm font-semibold text-red-600 border border-red-300 px-5 py-2.5 rounded-lg hover:bg-red-50 transition-colors duration-200 ease-in-out"
                  >
                    <FiX className="mr-2 text-base" /> Cancelar
                  </button>
                  <button 
                    onClick={() => router.push(`/edit-meal/${meal.id}`)}
                    className="flex items-center text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FiEdit className="mr-2 text-base" /> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-xl mx-auto">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              {/* Usando ícone da Lucide aqui também */}
              <Calendar size={36} className="text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-2">Nenhuma refeição planejada</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Parece que você não tem refeições agendadas para os próximos dias.
              Que tal adicionar algumas?
            </p>
            <button 
              onClick={() => router.push('/add-meal')}
              className="bg-gradient-to-r from-lime-500 to-green-500 text-white px-7 py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out inline-flex items-center transform hover:scale-105"
            >
              <FiPlus className="mr-2 text-lg" /> Planejar Refeição
            </button>
          </div>
        )}
      </div>

      {/* Menu Mobile */}
      <MobileNavigation />
    </div>
  );
}