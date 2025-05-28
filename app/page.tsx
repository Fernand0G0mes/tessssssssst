"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Importar Framer Motion
import LoginModal from "./components/LoginModal"; // Certifique-se que o caminho está correto
import FaqAccordion from "@/app/components/FaqAccordion"; // Certifique-se que o caminho está correto
import TestimonialsCarousel from "@/components/TestimonialsCarousel"; // Certifique-se que o caminho está correto
import CardVantagens from "@/components/FeatureCard"; // Certifique-se que o caminho está correto

// Ícones (mantendo os que já tinha, podemos usar mais se necessário)
import { FaLeaf, FaRobot, FaCalendarCheck } from 'react-icons/fa';
import { FiArrowRight, FiCheck } from "react-icons/fi"; // Linha corrigida

// Definição de tipos (se necessário para props de componentes importados, caso contrário pode remover)
// interface UserData { /* ... */ }
// interface Meal { /* ... */ }
// interface Achievement { /* ... */ }


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const goToNutritionForm = () => {
    router.push("/comenzar"); // Ajuste o caminho se necessário
  };

  // Variantes para animações com Framer Motion
  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "circOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen antialiased"> {/* Adicionado antialiased para suavizar fontes */}
      <main className="flex-grow bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/30">
        {/* Secção Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 py-16 md:py-24 max-w-7xl mx-auto min-h-[calc(100vh-80px)] lg:min-h-fit" // Ajuste de altura para Hero
        >
          {/* Container do texto (esquerda) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 lg:pr-10 xl:pr-16">
            <motion.img
              variants={fadeInFromBottom}
              src="/LogoNutrana.svg" // Certifique-se que este logo está em public/
              alt="Logo Nutrana"
              className="w-[300px] md:w-[400px] h-auto mb-1 md:mb-1 self-center lg:self-start" // Tamanho do logo ajustado
            />

            <motion.h1
              variants={fadeInFromBottom}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-emerald-600 leading-tight"
            >
              COME MEJOR,
            </motion.h1>
            <motion.h2
              variants={fadeInFromBottom}
              className="text-3xl md:text-4xl lg:text-5xl font-medium text-slate-700 mb-6 md:mb-8" // Cor ajustada
            >
              Obtén Resultados
            </motion.h2>

            <motion.p
              variants={fadeInFromBottom}
              className="mb-8 md:mb-10 text-slate-600 max-w-md text-base md:text-lg leading-relaxed" // Cor e leading ajustados
            >
              Plan nutricional inteligente y personalizado en <strong>solo 2 minutos</strong>.
              Descubre tu plan ideal basado en tu cuerpo, metas y estilo de vida.
            </motion.p>

            <motion.div variants={fadeInFromBottom} className="flex flex-col items-center lg:items-start w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 20px -5px rgba(22, 163, 74, 0.3)" }} // Cor esmeralda para sombra
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl hover:bg-emerald-600 mb-4 font-semibold text-lg transition-all shadow-lg w-full sm:w-auto flex items-center justify-center group"
                onClick={goToNutritionForm}
              >
                Comenzar Ahora <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <button
                className="text-sm text-amber-700 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
                onClick={openModal}
                aria-haspopup="dialog"
              >
                ¿Ya tienes una cuenta? <strong className="hover:text-emerald-600">Inicia sesión</strong>
              </button>
            </motion.div>
          </div>

          {/* Container da imagem (direita) */}
          <motion.div
            variants={fadeInFromBottom}
            className="relative w-full lg:w-1/2 mt-12 lg:mt-0 px-4"
          >
            <div className="relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto aspect-[10/9]"> {/* Aspect ratio ajustado */}
              {/* Imagem placeholder se as suas não carregarem */}
              {/* <div className="absolute inset-0 w-full h-full bg-slate-200 rounded-3xl flex items-center justify-center text-slate-400">Imagem Modelo Aqui</div> */}
              <img
                src="/Model_Fruit_BW.png" // Certifique-se que está em public/
                alt="Modelo com frutas em preto e branco"
                className="absolute inset-0 w-full h-full object-contain " // Removido aspect-square do card da imagem
              />
              <img
                src="/Model_Fruit_COLOR.png" // Certifique-se que está em public/
                alt="Modelo com frutas a cores"
                className="absolute inset-0 w-full h-full object-contain opacity-0 animate-fade-in" // Mantenha sua animação se funcionar
              />
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Secção "Así de Fácil" (3 Passos) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.h2 variants={fadeInFromBottom} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800">
            Empezar es <span className="text-emerald-500">Así de Fácil</span>
          </motion.h2>
          <motion.p variants={fadeInFromBottom} className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            En solo 2 minutos, tu plan nutricional inteligente estará listo y adaptado a ti.
          </motion.p>

          <div className="mt-12 md:mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[
              { icon: <FaLeaf size={32} />, step: "1.", title: "Comparte Sobre Ti", description: "Unas preguntas rápidas sobre tus metas, estilo de vida y preferencias.", timing: "(solo 2 minutos)" },
              { icon: <FaRobot size={32} />, step: "2.", title: "Plan Inteligente", description: "Recibe tu plan personalizado, adaptado y listo cada mañana en la app." },
              { icon: <FaCalendarCheck size={32} />, step: "3.", title: "Evolución Continua", description: "Nosotros ajustamos, tú solo disfruta sintiéndote cada día mejor." }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInFromBottom}
                className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center" // Alinhamento central
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-amber-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg flex items-center justify-center">
                  {item.icon}
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-emerald-600 mb-2">
                  <span className="text-slate-700">{item.step}</span> {item.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm text-center flex-grow">{item.description}</p>
                {item.timing && <div className="text-xs font-medium text-amber-600">{item.timing}</div>}
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20 group-hover:opacity-50 transition-opacity"></div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInFromBottom} className="mt-12 md:mt-16">
            <motion.button
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.35)" }}
              whileTap={{ scale: 0.98 }}
              onClick={goToNutritionForm}
              className="group relative overflow-hidden px-8 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform text-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ¡Quiero mi plan ya!
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>





<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"> {/* Fundo mais neutro */}
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={staggerContainer}
    className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
  >
    {/* Container da Imagem e Forma Abstrata (Direita em Desktop) */}
    <motion.div
      variants={fadeInFromBottom}
      className="flex-1 lg:order-2 relative flex items-center justify-center"
    >
      {/* Forma Abstrata de Fundo */}
      <div className="absolute w-[28rem] h-[28rem] sm:w-[32rem] sm:h-[32rem] lg:w-[36rem] lg:h-[36rem] bg-emerald-400/10 rounded-full blur-3xl opacity-70 animate-pulse-slow"></div> {/* Era emerald-50/20. Ajustado para emerald-400/10 e blur maior */}
      
      {/* Imagem do Prato (PNG Transparente) */}
      <img 
        src="/pratofrango1.png" // Certifique-se que está em public/ e é um PNG com fundo transparente
        alt="Prato saudável com frango grelhado e vegetais" 
        className="relative z-10 w-full h-auto max-w-md md:max-w-lg xl:max-w-xl mx-auto transform transition-transform duration-500 ease-out group-hover:scale-105" // Removido rounded e shadow, adicionado transform
      />
    </motion.div>

    {/* Container do Texto (Esquerda em Desktop) */}
    <motion.div
      variants={fadeInFromBottom}
      className="flex-1 text-center lg:text-left lg:order-1 relative z-20" // z-20 para garantir que o texto fica sobre a forma caso haja sobreposição em telas menores
    >
      <h2 className="font-extrabold mb-6 leading-tight">
        <span className="block text-3xl sm:text-4xl lg:text-5xl text-slate-800">
          NUTRICIÓN QUE
        </span>
        <span className="block text-4xl sm:text-5xl lg:text-6xl text-emerald-500"> {/* Cor de destaque ajustada para emerald */}
          SE ADAPTA
        </span>
        <span className="block text-3xl sm:text-4xl lg:text-5xl text-slate-800">
          A TU VIDA
        </span>
      </h2>
      <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
        Cada plato en tu plan está cuidadosamente diseñado para combinar con tus gustos, 
        rutina y necesidades nutricionales. No más comidas aburridas o dietas genéricas.
      </p>
      <motion.button
        whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 20px -5px rgba(22, 163, 74, 0.3)" }} // Sombra esmeralda no hover
        whileTap={{ scale: 0.98 }}
        onClick={goToNutritionForm} // Esta função deve estar definida no seu componente
        className="px-8 py-3.5 text-white font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 shadow-lg group"
      >
        Descubre tu Plan Ideal <FiArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  </motion.div>
  
  {/* Adicionando uma animação CSS para o pulse-slow se não tiver no seu tailwind.config.js */}
  <style jsx global>{`
    @keyframes pulse-bg {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.05); }
    }
    .animate-pulse-slow {
      animation: pulse-bg 8s infinite ease-in-out;
    }
  `}</style>
</section>




      {/* Secção de Planos (Aplicar nova paleta e estilos - Exemplo para um card) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-100 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            <motion.h2 variants={fadeInFromBottom} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800">
                Elige Tu Plan <span className="text-emerald-500">Nutrana</span>
            </motion.h2>
            <motion.p variants={fadeInFromBottom} className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
                La nutrición inteligente que mereces, al precio que te sorprenderá. Sin permanencia.
            </motion.p>

            {/* Mantenha a sua estrutura de grid para os planos, mas aplique estilos como este exemplo: */}
            <div className="mt-12 md:mt-16 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                 {/* Exemplo de Card de Plano Mensal (adapte os outros) */}
                <motion.div
                    variants={fadeInFromBottom}
                    className="group relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col" // flex-col para alinhar botão ao fundo
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-amber-300/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 text-center mb-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg flex items-center justify-center">
                            <FaLeaf size={28} /> {/* Ícone de exemplo */}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Mensual</h3>
                        <p className="text-4xl font-extrabold text-emerald-600">5€<span className="text-base font-medium text-slate-500">/mes</span></p>
                        <p className="text-sm text-slate-500 mt-1">Flexibilidad total</p>
                    </div>
                    
                    <ul className="text-sm text-left space-y-3 text-slate-600 mb-8 flex-grow"> {/* flex-grow para empurrar botão */}
                        {["Plan Diario 100% Personalizado IA", "Adaptación Diaria (Ciclo, Sueño, etc.)", "+50k Recetas y Lista Compra Inteligente", "Análisis Semanal de Progreso", "Sin Permanencia (Cancela fácil)"].map(feature => (
                            <li key={feature} className="flex items-start">
                                <FiCheck className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16}/>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{scale:0.98}}
                        className="w-full mt-auto py-3 text-emerald-600 font-semibold rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 group-hover:shadow-lg"
                    >
                        Elegir Mensual
                    </motion.button>
                </motion.div>

                {/* Adapte os cards Semestral e Anual com estilos semelhantes, destacando o mais popular/melhor valor */}
                {/* Card Semestral (Destaque) - exemplo de como poderia ser */}
                <motion.div
                    variants={fadeInFromBottom}
                    className="group relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white border-2 border-emerald-500 shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                     <span className="absolute top-5 right-5 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">POPULAR</span>
                     {/* Conteúdo do card semestral aqui, similar ao mensal mas com os dados corretos e botão de destaque */}
                     <div className="relative z-10 text-center mb-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg flex items-center justify-center">
                            <FaRobot size={28} /> {/* Ícone de exemplo */}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Semestral</h3>
                        <p className="text-4xl font-extrabold text-emerald-600">25€</p>
                        <p className="text-sm text-emerald-700 font-medium mt-1">(~4.17€/mes) Ahorra 17%</p>
                    </div>
                     <ul className="text-sm text-left space-y-3 text-slate-600 mb-8 flex-grow">
                        {["Todo lo del Plan Mensual", "Soporte Prioritario por Email", "Acceso Comunidad (Próximamente)", "Pago único cada 6 meses", "Sin Permanencia"].map((feature, idx) => (
                            <li key={feature} className="flex items-start">
                                <FiCheck className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16}/>
                                <span dangerouslySetInnerHTML={{ __html: feature.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-semibold text-emerald-700">$1</strong>') }} />
                            </li>
                        ))}
                    </ul>
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{scale:0.98}}
                        className="w-full mt-auto py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Elegir Semestral
                    </motion.button>
                </motion.div>

                 {/* Card Anual (adapte) */}
                 <motion.div variants={fadeInFromBottom} className="group relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                    {/* Conteúdo do card anual aqui */}
                    <span className="absolute top-5 right-5 bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">MEJOR VALOR</span>
                    <div className="relative z-10 text-center mb-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg flex items-center justify-center">
                            <FaCalendarCheck size={28} /> {/* Ícone de exemplo */}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Anual</h3>
                        <p className="text-4xl font-extrabold text-emerald-600">45€</p>
                         <p className="text-sm text-emerald-700 font-medium mt-1">(3.75€/mes) ¡Ahorra 25%!</p>
                    </div>
                     <ul className="text-sm text-left space-y-3 text-slate-600 mb-8 flex-grow">
                        {["Todo lo del Plan Semestral", "Acceso Anticipado a Nuevas Funciones", "Análisis de Tendencias Avanzado", "Pago único anual", "Sin Permanencia"].map((feature, idx) => (
                            <li key={feature} className="flex items-start">
                                <FiCheck className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16}/>
                                 <span dangerouslySetInnerHTML={{ __html: feature.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-semibold text-emerald-700">$1</strong>') }} />
                            </li>
                        ))}
                    </ul>
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{scale:0.98}}
                         className="w-full mt-auto py-3 text-emerald-600 font-semibold rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 group-hover:shadow-lg"
                    >
                        Elegir Anual
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
      </section>

      {/* Outras Secções (CardVantagens, TestimonialsCarousel, FaqAccordion) */}
      {/* Aplique estilos semelhantes a estas secções para manter a consistência */}
      <div className="bg-white"><CardVantagens /></div>
      <div className="bg-slate-50"><TestimonialsCarousel /></div>
      <div className="bg-white"><FaqAccordion /></div>

      {/* Rodapé (Aplicar nova paleta) */}
      <footer className="bg-slate-800 text-slate-300 py-12 md:py-16 w-full">
        <div className="w-full mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <img src="/logo_BRANCA.svg" alt="Logo Nutrana Branca" className="h-12 md:h-14 mb-3" />
              <p className="text-sm text-slate-400">Come mejor, obtén resultados.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-emerald-400">Sigue Nuestras Redes</h3>
              <div className="flex space-x-4 justify-center md:justify-start">
                {/* Ícones de redes sociais (placeholders) */}
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg></a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg></a>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-3 text-emerald-400">Contacto</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li><a href="mailto:contato@nutrana.com" className="hover:text-emerald-400 transition">contato@nutrana.com</a></li>
                {/* Adicione mais links/informações se necessário */}
                <li>Rua Nutrição Inteligente, 123</li>
                <li>São Paulo, SP - Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-10 pt-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Nutrana. Todos os direitos reservados.</p>
            <p className="mt-1">
                <a href="/termos" className="hover:text-emerald-400 transition">Termos de Serviço</a> | <a href="/privacidade" className="hover:text-emerald-400 transition">Política de Privacidade</a>
            </p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}