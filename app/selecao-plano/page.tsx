'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelecaoPlano() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePayment = async () => {
    const questionarioData = JSON.parse(localStorage.getItem('nutri-form') || '{}');

    if (!questionarioData?.email) {
      alert('Por favor, completa el formulario primero.');
      return;
    }

    const response = await fetch('/api/stripe', {
      method: 'POST',
      body: JSON.stringify({ plan: selectedPlan, email: questionarioData.email }),
    });

    const { url } = await response.json();
    router.push(url);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--verde-claro)] text-center min-h-screen">
      <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-[var(--branco)]">
        Elige Tu Plan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--amarelo-claro)] to-[var(--amarelo-claro)]">Nutrana</span>
      </h2>
      <p className="mt-4 text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
        La nutrición inteligente que mereces, al precio que te sorprenderá. Sin permanencia.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Mensual */}
        <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-[#f8f4e5] border border-[#e5e7eb]/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
          <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] shadow-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">Mensual</h3>
          <p className="text-4xl font-extrabold text-[var(--verde-escuro)]">5€<span className="text-base font-medium text-gray-500">/mes</span></p>
          <p className="text-sm text-gray-500 mt-1 mb-6">Flexibilidad total</p>
          <ul className="text-sm text-left space-y-3 text-gray-700 mb-8">
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Plan Diario 100% Personalizado IA</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Adaptación Diaria (Ciclo, Sueño, etc.)</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>+50k Recetas y Lista Compra Inteligente</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Análisis Semanal de Progreso</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Sin Permanencia (Cancela fácil)</span></li>
          </ul>
          <button
            onClick={() => setSelectedPlan('mensual')}
            className="w-full py-3.5 text-[var(--verde-escuro)] font-semibold rounded-xl bg-white border border-[var(--verde-escuro)]/20 hover:border-[var(--amarelo-escuro)] hover:text-[var(--amarelo-escuro)] transition-all duration-300 group-hover:shadow-md"
          >
            Elegir Mensual
          </button>
        </div>

        {/* Semestral */}
        <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-[#f5f0e1] border-2 border-[var(--amarelo-escuro)]/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <span className="absolute top-4 right-4 bg-gradient-to-r from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">POPULAR</span>
          <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] shadow-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">Semestral</h3>
          <p className="text-4xl font-extrabold text-[var(--verde-escuro)]">25€</p>
          <p className="text-sm text-[var(--amarelo-escuro)] font-medium mt-1 mb-6">(~4.17€/mes) Ahorra un 17%</p>
          <ul className="text-sm text-left space-y-3 text-gray-700 mb-8">
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Todo lo del Plan Mensual</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">🎁</span><span><strong>Soporte Prioritario por Email</strong></span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">💬</span><span><strong>Acceso Comunidad</strong> (Próximamente)</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Pago único cada 6 meses</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Sin Permanencia</span></li>
          </ul>
          <button
            onClick={() => setSelectedPlan('semestral')}
            className="w-full py-3.5 text-white font-bold rounded-xl bg-gradient-to-r from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] hover:from-[var(--amarelo-claro)] hover:to-[var(--amarelo-escuro)] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Elegir Semestral
          </button>
        </div>

        {/* Anual */}
        <div className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-white to-[#f5f0e1] border-2 border-[var(--amarelo-claro)]/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <span className="absolute top-4 right-4 bg-gradient-to-r from-[var(--verde-escuro)] to-[var(--amarelo-escuro)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">MEJOR VALOR</span>
          <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--verde-escuro)] to-[var(--amarelo-escuro)] shadow-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">Anual</h3>
          <p className="text-4xl font-extrabold text-[var(--verde-escuro)]">45€</p>
          <p className="text-sm text-[var(--amarelo-claro)] font-medium mt-1 mb-6">¡Ahorra un 25%! (3.75€/mes)</p>
          <ul className="text-sm text-left space-y-3 text-gray-700 mb-8">
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Todo lo del Plan Semestral</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">🚀</span><span><strong>Acceso Anticipado a Nuevas Funciones</strong></span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">📊</span><span><strong>Análisis de Tendencias Avanzado</strong></span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Pago único anual</span></li>
            <li className="flex items-start"><span className="text-[var(--amarelo-escuro)] mr-2">✓</span><span>Sin Permanencia</span></li>
          </ul>
          <button
            onClick={() => setSelectedPlan('anual')}
            className="w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-[var(--verde-escuro)] to-[var(--amarelo-escuro)] hover:from-[var(--amarelo-escuro)] hover:to-[var(--verde-escuro)] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Plan Actual
          </button>
        </div>
      </div>

      {selectedPlan && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-[var(--amarelo-escuro)] to-[var(--amarelo-claro)] text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Continuar al Pago
          </button>
        </div>
      )}
    </div>
  );
}
