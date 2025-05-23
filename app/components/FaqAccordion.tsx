'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: "¿Cómo funciona Nutrana?",
    answer: "Nutrana crea un plan personalizado basado en tus objetivos, cuerpo y estilo de vida. Solo necesitas completar un formulario rápido y listo."
  },
  {
    question: "¿Nutrana es gratis o necesito una suscripción?",
    answer: "Puedes iniciar gratis. Para acceder a funciones avanzadas y planes premium, puedes elegir uno de nuestros planes de suscripción."
  },
  {
    question: "¿Cómo activar Nutrana Premium?",
    answer: "Desde tu cuenta, accede a la sección 'Planes' y selecciona el plan que mejor se adapte a ti. El proceso es rápido y seguro."
  },
  {
    question: "¿Cómo calcula Nutrana mis calorías y macronutrientes?",
    answer: "Utilizamos fórmulas avaladas por expertos, combinadas con IA, para determinar tus necesidades diarias según tu objetivo, peso, edad y actividad."
  },
  {
    question: "¿La información nutricional está verificada?",
    answer: "Sí. Trabajamos con nutricionistas y fuentes científicas confiables para validar todos los datos que usamos en tu plan."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left flex justify-between items-center font-medium text-gray-800 text-lg hover:text-[var(--verde-claro)] transition"
              >
                {item.question}
                <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="mt-2 text-gray-600 text-sm">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          ¿Tienes más consultas? Contáctanos en <a href="mailto:soporte@nutrana.com" className="text-blue-500 hover:underline">soporte@nutrana.com</a>
        </p>
      </div>
    </section>
  );
}