import { FaSyncAlt, FaMoon, FaPills, FaRobot, FaTachometerAlt, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-white py-22 px-4 sm:px-6 lg:px-19 max-w-7xl mx-auto">

        {/* Título */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center mb-5"
>
  <h2 className="text-6xl md:text-6xl font-black text-[var(--verde-claro)] mb-4">
    <span className="text-[var(--verde-escuro)]">Ventajas</span> Exclusivas
  </h2>
  <p className="text-gray-500 max-w-2xl mx-auto text-lg">
    Tecnología avanzada para tu bienestar nutricional
  </p>
</motion.div>

        {/* Layout com colunas */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Coluna das vantagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            {[
              {
                icon: <FaSyncAlt />,
                title: "Sincronización Menstrual",
                description: "Plan adaptado a cada fase de tu ciclo para óptimo bienestar hormonal."
              },
              {
                icon: <FaMoon />,
                title: "Adaptación al Descanso",
                description: "Ajustes automáticos según tus patrones de sueño para mejor rendimiento."
              },
              {
                icon: <FaRobot />,
                title: "IA Personalizada",
                description: "Aprendizaje continuo que perfecciona tu plan semana a semana."
              },
              {
                icon: <FaTachometerAlt />,
                title: "Rendimiento Óptimo",
                description: "Nutrición precisa para maximizar energía y recuperación."
              },
              {
                icon: <FaPills />,
                title: "Micronutrientes Esenciales",
                description: "Equilibrio perfecto de vitaminas y minerales adaptado a ti."
              },
              {
                icon: <FaLeaf />,
                title: "Simplicidad Absoluta",
                description: "Todo automatizado. Solo disfruta de tus resultados."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <ModernFeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>

          {/* Celular ao lado direito sem fundo especial */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-md"
          >
            <img 
              src="/cel.png" 
              alt="Celular com app de nutrição" 
              className="w-full h-auto pointer-events-none select-none"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ModernFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white border border-gray-200 rounded-xl p-6 transition-all duration-100 h-full flex flex-col shadow-sm hover:shadow-md"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--verde-claro)] flex items-center justify-center flex-shrink-0">
          <div className="text-xl text-white">
            {icon}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[var(--verde-escuro)] mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
