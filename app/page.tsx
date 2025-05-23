"use client";

import { useState } from "react";
import { auth, googleProvider } from '@/lib/firebase/config';
import { useRouter } from "next/navigation";
import LoginModal from "./components/LoginModal";
import FaqAccordion from "@/app/components/FaqAccordion";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CardVantagens from "@/components/FeatureCard";
import { UserData, Meal, Achievement } from "@/types";
import { FaSyncAlt, FaMoon, FaRobot, FaPills, FaTachometerAlt, FaLeaf } from 'react-icons/fa';
import { GiMedicinePills } from 'react-icons/gi'; // Para o ícone de vitaminas


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const goToNutritionForm = () => {
    router.push("/comenzar");
  };
  return (




    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-b from-[#ffffff] to-[#ffe8cd]">
        {/* Conteúdo principal agora em flex row */}
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 py-10 max-w-7xl mx-auto">
          {/* Container do texto (esquerda) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 max-w-md">
            {/* Logo */}
            <img
              src="/LogoNutrana.svg"
              alt="Logo de Nutrana"
              className="w-[300px] md:w-[500px] h-auto mb-2"
            />

            {/* Títulos */}
            <div className="flex flex-col gap-y-0">
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#06e96c] -mb-1 md:-mb-2">
                COME MEJOR,
              </h1>
              <h2 className="text-x md:text-5xl font-medium text-[#019e47] mb-10">
                Obtén Resultados
              </h2>

              {/* Subtítulo */}
              <p className="mb-8 text-[#0a3a2a]/90 max-w-md font-medium text-sm md:text-base">
                Plan nutricional personalizado en <strong>2 minutos</strong>.<br />
                Descubre tu plan alimenticio ideal basado en
                <br /> tu cuerpo, metas y estilo de vida.
              </p>

              {/* Botão principal */}
              <button
                className="bg-white text-[#0a3a2a] px-6 py-3 rounded-xl hover:bg-[#ecff83] mb-4 font-semibold transition-all"
                onClick={goToNutritionForm}
              >
                Comenzar Ahora
              </button>
            </div>

            {/* Link de login */}
            <button
              className="text-sm text-[#9c7800]/80 hover:underline font-normal bg-transparent border-none p-0 cursor-pointer mb-2"
              onClick={openModal}
              aria-haspopup="dialog"
            >
              ¿Ya tienes una cuenta? <strong>Inicia sesión</strong>
            </button>
          </div>
          {/* Container da imagem (direita) */}
          <div className="relative w-full lg:w-1/2 mt-8 lg:mt-0 px-4">
            <div className="relative max-w-[330px] md:max-w-[400px] lg:max-w-[700px] mx-auto aspect-square">
              <img 
                src="/Model_Fruit_BW.png" 
                alt="Fruit Model Black and White" 
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img 
                src="/Model_Fruit_COLOR.png" 
                alt="Fruit Model Color" 
                className="absolute inset-0 w-full h-full object-contain opacity-0 animate-fade-in"
              />
            </div>
          </div>
        </div>
      </main>
{/* FIM DA PARTE INICIAL;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; */}





{/* DIV DOS 3;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;) */}
<div className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-center">
<h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-(--verde-escuro)">
    Empezar es <span className="text-(--verde-claro)">Así de Fácil</span> <span className="text-(--verde-escuro)">¡De Verdad!</span>
  </h2>
  <p className="mt-4 text-gray-600 text-base sm:text-lg">
    En solo 2 minutos, tu plan nutricional inteligente estará listo.
  </p>

  <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {/* Paso 1 - Caixa Moderna */}
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-b from-[#ffffff] to-[#ffe8cd] border border-[#e5e7eb]/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
      {/* Efeito de brilho */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9c780010_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Ícone circular moderno */}
      <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-(--amarelo-claro) to-(--amarelo-escuro) shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-(--verde-claro) mb-2">
        <span className="text-(--verde-escuro)">1.</span> Comparte Sobre Ti
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        Unas preguntas rápidas sobre tus metas, estilo de vida y ciclo.
      </p>
      <div className="text-xs font-medium text-[#9c7800]">(solo 2 minutos)</div>
      
      {/* Linha decorativa */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#9c7800] to-transparent opacity-30 group-hover:opacity-70 transition-opacity"></div>
    </div>

    {/* Paso 2 - Caixa Moderna */}
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-b from-[#ffffff] to-[#ffe8cd] border border-[#e5e7eb]/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9c780010_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-(--amarelo-claro) to-(--amarelo-escuro) shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-(--verde-claro) mb-2">
        <span className="text-(--verde-escuro)">2.</span> Plan Inteligente
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        Recibe tu plan personalizado, adaptado y listo cada mañana en la app.
      </p>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#9c7800] to-transparent opacity-30 group-hover:opacity-70 transition-opacity"></div>
    </div>

    {/* Paso 3 - Caixa Moderna */}
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-b from-[#ffffff] to-[#ffe8cd] border border-[#e5e7eb]/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9c780010_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-(--amarelo-claro) to-(--amarelo-escuro) shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-(--verde-claro) mb-2">
        <span className="text-(--verde-escuro)">3.</span> Evolución Continua
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
      Nosotros ajustamos, tú solo disfruta sintiéndote cada día mejor.
      </p>


      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#9c7800] to-transparent opacity-30 group-hover:opacity-70 transition-opacity"></div>
    </div>
  </div>

  {/* Botão Ultra Moderno */}
  <div className="mt-12">
    <button className="group relative overflow-hidden px-10 py-4 text-white font-bold rounded-xl bg-gradient-to-b from-(--verde-claro) to-(--verde-escuro) shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <span className="relative z-10 flex items-center justify-center gap-2">
        ¡Quiero mi plan ya!
        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
        </svg>
      </span>
      {/* Efeito de hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-[#1a5a4a] to-[#0a3a2a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      {/* Efeito de brilho */}
      <span className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#ffffff20_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    </button>
  </div>
</div>
{/* DIV DOS 3 PASSOS ACIMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;) */}










{/* DIV DE TRANSICAO - PRATO SAUDAVEL */}
<div className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f9f5e9]">
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
    {/* Imagem do prato */}
<div className="flex-1">
  <img 
    src="/pratofrango1.png" 
    alt="Prato saudável com frango grelhado e vegetais" 
    className="w-full h-auto max-w-[900px] mx-auto"
  />
</div>
    
    {/* Texto explicativo */}
    <div className="flex-1 text-center lg:text-left">
  <h2 className="font-black mb-4 leading-tight">
    <span className="block text-3xl sm:text-5xl text-[var(--verde-escuro)]">
      NUTRICIÓN QUE
    </span>
    <span className="block text-4xl sm:text-6xl text-[var(--amarelo-escuro)]">
      SE ADAPTA
    </span>
    <span className="block text-3xl sm:text-5xl text-[var(--verde-escuro)]">
      A TU VIDA!
    </span>
  </h2>
  <p className="text-lg text-gray-700 mb-6">
    Cada plato en tu plan está cuidadosamente diseñado para combinar con tus gustos, 
    rutina y necesidades nutricionales. No más comidas aburridas o dietas genéricas.
  </p>
</div>

  </div>
</div>


















{/* DIV PLANOS ABAIXOOOOOOOOOO;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;) */}
<div className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--verde-claro)] text-center">
  <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-[var(--branco)]">
    Elige Tu Plan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--amarelo-claro)] to-[var(--amarelo-claro)]">Nutrana</span>
  </h2>
  <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
    La nutrición inteligente que mereces, al precio que te sorprenderá. Sin permanencia.
  </p>

  <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {/* Mensual - Caixa Moderna */}
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-[#f8f4e5] border border-[#e5e7eb]/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--amarelo-escuro)/10_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">Mensual</h3>
      <p className="text-4xl font-extrabold text-[var(--verde-escuro)]">5€<span className="text-base font-medium text-gray-500">/mes</span></p>
      <p className="text-sm text-gray-500 mt-1 mb-6">Flexibilidad total</p>
      
      <ul className="text-sm text-left space-y-3 text-gray-700 mb-8">
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Plan Diario 100% Personalizado IA</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Adaptación Diaria (Ciclo, Sueño, etc.)</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>+50k Recetas y Lista Compra Inteligente</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Análisis Semanal de Progreso</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Sin Permanencia (Cancela fácil)</span>
        </li>
      </ul>
      
      <button className="w-full py-3.5 text-[var(--verde-escuro)] font-semibold rounded-xl bg-white border border-[var(--verde-escuro)]/20 hover:border-[var(--amarelo-escuro)] hover:text-[var(--amarelo-escuro)] transition-all duration-300 group-hover:shadow-md">
        Elegir Mensual
      </button>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[var(--amarelo-escuro)] to-transparent opacity-30 group-hover:opacity-70 transition-opacity"></div>
    </div>

    {/* Semestral - Caixa Destaque */}
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-[#f5f0e1] border-2 border-[var(--amarelo-escuro)]/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <span className="absolute top-4 right-4 bg-gradient-to-r from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        POPULAR
      </span>
      
      <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">Semestral</h3>
      <p className="text-4xl font-extrabold text-[var(--verde-escuro)]">25€</p>
      <p className="text-sm text-[var(--amarelo-escuro)] font-medium mt-1 mb-6">(~4.17€/mes) Ahorra un 17%</p>
      
      <ul className="text-sm text-left space-y-3 text-gray-700 mb-8">
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Todo lo del Plan Mensual</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">🎁</span>
          <span><strong>Soporte Prioritario por Email</strong></span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">💬</span>
          <span><strong>Acceso Comunidad</strong> (Próximamente)</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Pago único cada 6 meses</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Sin Permanencia</span>
        </li>
      </ul>
      
      <button className="w-full py-3.5 text-(--verde-escuro) font-bold rounded-xl bg-gradient-to-r from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] hover:from-[var(--amarelo-claro)] hover:to-[var(--amarelo-escuro)] transition-all duration-300 shadow-md hover:shadow-lg">
        Elegir Semestral
      </button>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[var(--amarelo-escuro)] to-transparent opacity-70"></div>
    </div>

    {/* Anual - Caixa Premium */}
    <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-[#f5f0e1] border-2 border-[var(--amarelo-claro)]/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <span className="absolute top-4 right-4 bg-gradient-to-r from-[var(--verde-escuro)] to-[var(--amarelo-escuro)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        MEJOR VALOR
      </span>
      
      <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--verde-escuro)] to-[var(--amarelo-escuro)] shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">Anual</h3>
      <p className="text-4xl font-extrabold text-[var(--verde-escuro)]">45€</p>
      <p className="text-sm text-[var(--amarelo-claro)] font-medium mt-1 mb-6">¡Ahorra un 25%! (3.75€/mes)</p>
      
      <ul className="text-sm text-left space-y-3 text-gray-700 mb-8">
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Todo lo del Plan Semestral</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">🚀</span>
          <span><strong>Acceso Anticipado a Nuevas Funciones</strong></span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">📊</span>
          <span><strong>Análisis de Tendencias Avanzado</strong></span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Pago único anual</span>
        </li>
        <li className="flex items-start">
          <span className="text-[var(--amarelo-escuro)] mr-2">✓</span>
          <span>Sin Permanencia</span>
        </li>
      </ul>
      
      <button className="w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-[var(--verde-escuro)] to-[var(--amarelo-escuro)] hover:from-[var(--amarelo-escuro)] hover:to-[var(--verde-escuro)] transition-all duration-300 shadow-md hover:shadow-lg">
        Plan Actual
      </button>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[var(--amarelo-escuro)] to-transparent opacity-70"></div>
    </div>
  </div>
</div>
{/* PLANOS MENSAIS;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;) */}












{/* Carrossel de depoimentos */}
<CardVantagens />



{/* Carrossel de depoimentos */}
<TestimonialsCarousel />







<FaqAccordion />






      {/* Rodapé (mantido exatamente igual;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;) */}
      <footer className="bg-[#0a3a2a] text-white py-8 w-full">
        <div className="w-full mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
            <div className="mb-6 md:mb-0 flex flex-col items-center justify-center">
              <div className="flex justify-center items-center w-full">
                <img 
                  src="/logo_BRANCA.svg" 
                  alt="Logo Nutrana" 
                  className="h-auto max-h-16 w-auto max-w-[100px]"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p className="text-gray-300 mt-2 text-center">Come mejor, <br />Obtén Resultados</p>
            </div>

            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-3 text-[#06e96c]">Siga-nos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-[#06e96c] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-[#06e96c] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-[#06e96c] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#06e96c]">Contato</h3>
              <ul className="text-gray-300 space-y-1">
                <li>contato@nutrana.com</li>
                <li>(11) 1234-5678</li>
                <li>Rua Nutrição, 123 - São Paulo/SP</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 max-w-7xl mx-auto">
            <p>&copy; {new Date().getFullYear()} NUTRANA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Login */}
      <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}