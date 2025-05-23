"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FiHome, 
  FiPieChart, 
  FiActivity, 
  FiAward, 
  FiUser,
  FiCalendar,
  FiMenu,
  FiX,
  FiHelpCircle
} from "react-icons/fi";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const navItems = [
    { path: '/dashboard', icon: <FiHome className="text-lg" />, label: 'Início' },
    { path: '/meal-plan', icon: <FiCalendar className="text-lg" />, label: 'Refeições' },
    { path: '/progress', icon: <FiActivity className="text-lg" />, label: 'Progresso' },
    { path: '/activities', icon: <FiPieChart className="text-lg" />, label: 'Atividades' },
    { path: '/achievements', icon: <FiAward className="text-lg" />, label: 'Conquistas' },
    { path: '/profile', icon: <FiUser className="text-lg" />, label: 'Perfil' },
  ];

  if (!isMobile) return null;

  return (
    <>
      {/* Botão do menu flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-white text-gray-800 rotate-90'
              : 'bg-gradient-to-br from-green-500 to-teal-400 text-white'
          }`}
          aria-label="Menu"
        >
          {isOpen ? (
            <FiX className="text-2xl" />
          ) : (
            <FiMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Apenas o Menu - SEM OVERLAY */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-72 bg-white rounded-2xl shadow-xl overflow-hidden animate-scale-in border border-gray-200"
          onClick={(e) => e.stopPropagation()} // Impede que clicks dentro do menu fechem ele
        >
          <div className="p-2 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigateTo(item.path)}
                className="w-full flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors text-gray-800 group"
              >
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600 group-hover:bg-green-200 transition-colors">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <button 
              onClick={() => navigateTo('/support')}
              className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <FiHelpCircle className="mr-2" />
              Ajuda e Suporte
            </button>
          </div>
        </div>
      )}




      {/* Handler para fechar o menu ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: 'auto' }} // Garante que captura os clicks
        />
      )}
    </>
  );
}