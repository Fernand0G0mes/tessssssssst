'use client';
import { useEffect, useRef, useState } from 'react';

const ModernTestimonialsCarousel = () => {
  const testimonials = [
    {
      id: 1,
      name: "Claudia R.",
      age: "28 años",
      text: "¡Increíble! Se adapta a mi ciclo y mis entrenos sin que yo haga nada. Y por este precio... ¡Es un regalo!",
      photo: "/clientes/claudia.jpg",
      result: "-12kg en 3 meses"
    },
    {
      id: 2,
      name: "Lucía G.",
      age: "34 años",
      text: "Odiaba registrar comidas. Con Nutrana mi plan está listo cada mañana. Me ha quitado un peso de encima y estoy aprendendo sobre mi cuerpo.",
      photo: "/clientes/lucia.jpg",
      result: "Controló su SOP"
    },
    {
      id: 3,
      name: "Sara M.",
      age: "26 años",
      text: "No sé cómo lo hace, pero siempre acierta con lo que necesito comer, sobre todo después de dormir mal. ¡Y sin pagar una fortuna!",
      photo: "/clientes/sara.jpg",
      result: "+30% energía"
    },
    {
      id: 4,
      name: "María J.",
      age: "31 años",
      text: "Por fin entendí cómo alimentarme según mi ciclo menstrual. ¡Nunca más esos antojos incontrolables!",
      photo: "/clientes/maria.jpg",
      result: "Regularizó su ciclo"
    },
    {
      id: 5,
      name: "Andrea T.",
      age: "29 años",
      text: "Como vegana, era difícil encontrar opções completas. Nutrana me mostró combinaciones que nunca había considerado.",
      photo: "/clientes/andrea.jpg",
      result: "Mejoró sus análisis"
    },
    {
      id: 6,
      name: "Elena V.",
      age: "40 años",
      text: "A mis 40, pensé que era imposible cambiar mi metabolismo. ¡Me equivoqué completamente!",
      photo: "/clientes/elena.jpg",
      result: "-8% grasa corporal"
    },
    {
      id: 7,
      name: "Daniela C.",
      age: "25 años",
      text: "Como estudiante con poco tempo, necesitaba algo práctico. ¡Mis comidas son rápidas, sanas y deliciosas!",
      photo: "/clientes/daniela.jpg",
      result: "Mejor concentración"
    },
    {
      id: 8,
      name: "Paula S.",
      age: "32 años",
      text: "Después del embarazo, recuperé mi energía y figura más rápido de lo esperado gracias a mi plan personalizado.",
      photo: "/clientes/paula.jpg",
      result: "Recuperación postparto"
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const speed = 0.5;

  useEffect(() => {
    if (!containerRef.current || isPaused) return;

    const container = containerRef.current;
    let animationId: number;
    let position = 0;

    const animate = () => {
      position += speed;
      if (position >= container.scrollWidth / 2) {
        position = 0;
      }
      container.scrollLeft = position;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f5fff5] to-[#e0f0e0] overflow-hidden">
      <div className="max-w-9xl mx-auto">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-center text-[var(--verde-escuro)] mb-4">
          <span className="text-[var(--amarelo-escuro)]">Tú estás en <br /> </span> Buenas Manos
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
        Descubre cómo transformamos la relación con la alimentación de más de 5.000 personas
        </p>

        <div
          ref={containerRef}
          className="flex overflow-x-hidden py-8 gap-8 cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-center pt-6">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[var(--verde-claro)] shadow-md"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-[var(--verde-escuro)] text-center">{testimonial.name}</h3>
                  <p className="text-sm text-[var(--amarelo-escuro)] text-center mb-2">{testimonial.age}</p>
                  <blockquote className="text-gray-700 text-sm italic mb-4 text-center">"{testimonial.text}"</blockquote>
                  <div className="mt-auto text-center">
                    <span className="inline-block px-4 py-2 rounded-full text-sm bg-[var(--verde-claro)]/10 text-[var(--verde-escuro)] border border-[var(--verde-escuro)]/20">
                      {testimonial.result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernTestimonialsCarousel;