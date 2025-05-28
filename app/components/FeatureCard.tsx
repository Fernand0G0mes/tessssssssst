"use client";

import { useState } from "react";
import { FaSyncAlt, FaMoon, FaPills, FaRobot, FaTachometerAlt, FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// Ícones do Feather Icons, incluindo os para o acordeão e botão "Saber Mais"
import { FiChevronRight, FiArrowRight, FiChevronDown, FiChevronUp } from "react-icons/fi"; 

// Definição da interface para as vantagens (features)
interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Componente para cada item do Acordeão (usado na visualização mobile)
interface AccordionItemProps {
  feature: Feature;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

function AccordionItem({ feature, isOpen, onClick, index }: AccordionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
      layout // Anima mudanças de altura/layout
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/70 mb-3"
    >
      <motion.button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C853] focus-visible:ring-offset-1"
        aria-expanded={isOpen}
        whileHover={{ backgroundColor: 'rgba(240, 248, 245, 0.7)' }} // Um verde muito claro no hover (emerald-50)
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          {/* Cores do ícone alinhadas com a paleta Verde Nutrana */}
          <span className={`p-2.5 rounded-lg transition-colors duration-300 text-lg
                          ${isOpen ? 'bg-[#00C853] text-white shadow-sm' : 'bg-emerald-50 text-[#00C853]'}`}>
            {feature.icon}
          </span>
          <span className={`font-semibold text-sm sm:text-base transition-colors duration-300
                          ${isOpen ? 'text-[#00C853]' : 'text-[#1A2E27]'}`}> {/* Título ativo em Verde Nutrana */}
            {feature.title}
          </span>
        </div>
        {/* Setas com cores alinhadas */}
        {isOpen ? 
          <FiChevronUp className="w-5 h-5 text-[#00C853] transform transition-transform duration-300" /> :
          <FiChevronDown className="w-5 h-5 text-slate-500 transform transition-transform duration-300" />
        }
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", marginTop: "0px", paddingBottom: "1.25rem" },
              collapsed: { opacity: 0, height: 0, marginTop: "0px", paddingBottom: "0px" }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="px-4 sm:px-5 overflow-hidden"
          >
            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-200/80 pt-3">
              {feature.description}
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Componente principal da Secção de Vantagens
export default function FeatureSectionInteractive() {

  const features: Feature[] = [
    { id: "sync", icon: <FaSyncAlt size={20}/>, title: "Sincronización Menstrual", description: "Tu plan nutricional se adapta inteligentemente a cada fase de tu ciclo menstrual, optimizando tu energía y bienestar hormonal de forma única." },
    { id: "sleep", icon: <FaMoon size={20}/>, title: "Adaptación al Descanso", description: "Nutrana considera la calidad de tu sueño y ajusta tus recomendaciones para mejorar tu recuperación y vitalidad durante el día." },
    { id: "ai", icon: <FaRobot size={20}/>, title: "IA Personalizada Evolutiva", description: "Nuestra inteligencia artificial aprende de tus progresos y feedback, refinando continuamente tu plan para resultados cada vez mejores." },
    { id: "performance", icon: <FaTachometerAlt size={20}/>, title: "Rendimiento Físico Optimizado", description: "Nutrición de precisión para tus entrenamientos, diseñada para maximizar tu energía, potenciar la fuerza y acelerar la recuperación muscular." },
    { id: "micros", icon: <FaPills size={20}/>, title: "Equilibrio de Micronutrientes", description: "Aseguramos que recibas el balance perfecto de vitaminas y minerales cruciales, completamente adaptado a tus necesidades individuales." },
    { id: "simplicity", icon: <FaLeaf size={20}/>, title: "Simplicidad Absoluta en tu Rutina", description: "Olvídate de complicadas planificaciones. Todo está automatizado para que solo te concentres en disfrutar y alcanzar tus metas." }
  ];

  const [activeIndexDesktop, setActiveIndexDesktop] = useState(0);
  const [openAccordionIndexMobile, setOpenAccordionIndexMobile] = useState<number | null>(0); 

  const activeFeatureDesktop = features[activeIndexDesktop];

  // Variantes de animação
  const sectionVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.1 } } };
  const titleVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "circOut" } } };
  const phoneImageVariants = { hidden: { opacity: 0, scale: 0.85, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, delay: 0.3, type: "spring", stiffness: 120, damping: 15 } } };
  const featureSelectorVariants = { hidden: { opacity: 0, x: -20 }, visible: (i:number) => ({ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.5 + i * 0.1, ease: "circOut" } }) };
  const featureDetailVariantsDesktop = { initial: { opacity: 0, y: 15, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "circOut" } }, exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.25, ease: "circIn" } } };

  // const router = useRouter(); // Descomente se o botão "Saber Más" precisar de navegação

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white flex flex-col items-center justify-center antialiased py-16 md:py-24">
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={sectionVariants}
        className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div variants={titleVariants} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A2E27] mb-3 sm:mb-4">
            Ventajas <span className="text-[#00C853]">Exclusivas Nutrana</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
            Descubre cómo nuestra tecnología y personalización te llevan a otro nivel de bienestar.
          </p>
        </motion.div>

        {/* Layout para Desktop */}
        <div className="hidden lg:flex lg:flex-row items-start justify-center gap-8 md:gap-12 lg:gap-10 xl:gap-16">
          <div className="w-full lg:w-[35%] xl:w-[30%] space-y-3 lg:sticky lg:top-28 self-start">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id} custom={index} variants={featureSelectorVariants}
                onClick={() => setActiveIndexDesktop(index)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ease-in-out flex items-center space-x-3 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 ${activeIndexDesktop === index ? 'bg-white shadow-xl scale-105 border-l-4 border-[#00C853]' : 'bg-white/70 hover:bg-white hover:shadow-lg'}`}
                whileHover={{ scale: activeIndexDesktop === index ? 1.05 : 1.02, shadow: activeIndexDesktop === index ? "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" : "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`p-2.5 rounded-lg transition-colors duration-300 ${activeIndexDesktop === index ? 'bg-[#00C853] text-white shadow-sm' : 'bg-slate-200 text-[#00C853]'}`}>{feature.icon}</span>
                <span className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${activeIndexDesktop === index ? 'text-[#1A2E27]' : 'text-slate-600'}`}>{feature.title}</span>
                {activeIndexDesktop === index && <FiChevronRight className="ml-auto text-[#00C853] text-lg" />}
              </motion.button>
            ))}
          </div>
          <div className="w-full max-w-[240px] sm:max-w-[260px] mx-auto lg:w-[30%] xl:w-[33%] flex justify-center items-start lg:sticky lg:top-28 self-start order-first lg:order-none mb-8 lg:mb-0">
            <motion.img key="phone-image-desktop" src="/cel.png" alt="Nutrana App" variants={phoneImageVariants} className="filter drop-shadow-2xl pointer-events-none select-none"/>
          </div>
          <div className="w-full lg:w-[35%] xl:w-[37%] lg:sticky lg:top-28 self-start">
            <AnimatePresence mode="wait">
              <motion.div key={activeFeatureDesktop.id} variants={featureDetailVariantsDesktop} initial="initial" animate="animate" exit="exit" className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/60">
                <div className="flex items-center mb-4">
                   <span className="p-3 rounded-xl bg-[#00C853] text-white mr-4 shadow-sm">{activeFeatureDesktop.icon}</span>
                   <h3 className="text-xl lg:text-2xl font-bold text-[#1A2E27] leading-tight">{activeFeatureDesktop.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{activeFeatureDesktop.description}</p>
                <motion.button whileHover={{scale: 1.03, x:2}} whileTap={{scale:0.97}} className="mt-6 inline-flex items-center text-sm font-semibold text-[#f7b801] hover:text-yellow-500 group" /* onClick={() => router.push('/mais-detalhes/' + activeFeatureDesktop.id)} */ >
                    Saber Más <FiArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1"/>
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Layout para Mobile (Acordeão) */}
        <div className="lg:hidden w-full max-w-lg mx-auto mt-10">
            <motion.div variants={phoneImageVariants} className="mx-auto mb-8 max-w-[220px]">
                <img src="/cel.png" alt="Nutrana App" className="filter drop-shadow-xl pointer-events-none select-none"/>
            </motion.div>
            <div className="space-y-3">
            {features.map((feature, index) => (
                <AccordionItem 
                    key={feature.id}
                    feature={feature}
                    isOpen={openAccordionIndexMobile === index}
                    onClick={() => setOpenAccordionIndexMobile(openAccordionIndexMobile === index ? null : index)}
                    index={index}
                />
            ))}
            </div>
        </div>
      </motion.section>
    </div>
  );
}