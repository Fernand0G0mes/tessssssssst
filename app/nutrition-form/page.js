"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { 
  FaArrowDown, 
  FaArrowUp, 
  FaBalanceScale, 
  FaBolt,
  FaCouch,
  FaWalking,
  FaRunning,
  FaDumbbell,
  FaFire,
  FaCheck,
  FaUser,
  FaRuler,
  FaBed
} from 'react-icons/fa';
import Confetti from 'react-confetti';

// 1. Objective Cards Component
function ObjectiveCards({ selectedItem, setSelectedItem, setCurrentStep }) {
  const objectives = [
    {
      title: "Perder peso",
      description: "Queimar gordura e definir meu corpo",
      icon: <FaArrowDown className="text-2xl" />,
      color: "from-[#4CAF50] to-[#8BC34A]",
      bgColor: "bg-green-50"
    },
    {
      title: "Ganhar massa",
      description: "Aumentar músculo e força",
      icon: <FaArrowUp className="text-2xl" />,
      color: "from-[#2196F3] to-[#03A9F4]",
      bgColor: "bg-blue-50"
    },
    {
      title: "Manter saúde",
      description: "Equilibrar minha alimentação",
      icon: <FaBalanceScale className="text-2xl" />,
      color: "from-[#FFC107] to-[#FFEB3B]",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Melhorar rendimento",
      description: "Otimizar para esportes",
      icon: <FaBolt className="text-2xl" />,
      color: "from-[#FF5722] to-[#FF9800]",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {objectives.map((obj) => (
        <button
          key={obj.title}
          className={`p-5 rounded-xl text-left transition-all transform hover:scale-[1.02] ${selectedItem === obj.title ? 
            `bg-gradient-to-br ${obj.color} text-white shadow-lg` : 
            `${obj.bgColor} border border-gray-100 hover:border-transparent shadow-sm`}`}
          onClick={() => {
            setSelectedItem(obj.title);
            setTimeout(() => setCurrentStep(2), 300);
          }}
        >
          <div className={`mb-3 ${selectedItem === obj.title ? 'text-white' : 'text-gray-700'}`}>
            {obj.icon}
          </div>
          <h3 className={`font-bold text-lg mb-1 ${selectedItem === obj.title ? 'text-white' : 'text-gray-800'}`}>
            {obj.title}
          </h3>
          <p className={`text-sm ${selectedItem === obj.title ? 'text-white/90' : 'text-gray-600'}`}>
            {obj.description}
          </p>
          <div className={`mt-3 h-1 w-10 rounded-full ${selectedItem === obj.title ? 'bg-white/50' : 'bg-gray-300'}`}></div>
        </button>
      ))}
    </div>
  );
}

// 2. Activity Level Cards Component
function ActivityLevelCards({ selectedItem, setSelectedItem, setCurrentStep }) {
  const activityLevels = [
    {
      title: "Sedentario",
      description: "Poco o ningún ejercicio. Trabajo de oficina.",
      icon: <FaCouch className="text-2xl" />
    },
    {
      title: "Ligero",
      description: "Ejercicio 1-3 días/semana. Actividades ligeras.",
      icon: <FaWalking className="text-2xl" />
    },
    {
      title: "Moderado",
      description: "Ejercicio 3-5 días/semana. Activo en el trabajo.",
      icon: <FaRunning className="text-2xl" />
    },
    {
      title: "Activo",
      description: "Ejercicio 6-7 días/semana. Entrenamiento regular.",
      icon: <FaDumbbell className="text-2xl" />
    },
    {
      title: "Muy activo",
      description: "Ejercicio intenso diario. Trabajo físico exigente.",
      icon: <FaFire className="text-2xl" />
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {activityLevels.map((level) => (
        <button
          key={level.title}
          className={`p-4 border-2 rounded-xl text-left transition-all flex items-start ${selectedItem === level.title ? 'border-[#06e96c] bg-[#06e96c]/10' : 'border-gray-200 hover:border-[#06e96c]/50'}`}
          onClick={() => {
            setSelectedItem(level.title);
            setTimeout(() => setCurrentStep(3), 300);
          }}
        >
          <div className={`mr-4 ${selectedItem === level.title ? 'text-[#06e96c]' : 'text-gray-600'}`}>
            {level.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{level.title}</h3>
            <p className="text-sm text-gray-600">{level.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// 3. Main Nutrition Form Component
export default function NutritionForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    objective: '',
    activityLevel: '',
    name: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    sleepHours: ''
  });
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (currentStep === 4) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateCalories = ({ gender, age, weight, height, activityLevel }) => {
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      "Sedentario": 1.2,
      "Ligero": 1.375,
      "Moderado": 1.55,
      "Activo": 1.725,
      "Muy activo": 1.9
    };

    return bmr * (activityMultipliers[activityLevel] || 1.2);
  };

  const generatePlan = () => {
    // Validação básica
    if (!formData.name || !formData.weight || !formData.height) {
      alert('Por favor complete todos los campos');
      return;
    }

    const calories = calculateCalories({
      gender: formData.gender,
      age: parseFloat(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activityLevel: formData.activityLevel
    });

    let proteinRatio, carbRatio, fatRatio;
    if (formData.objective === "Perder peso") {
      proteinRatio = 0.3;
      carbRatio = 0.4;
      fatRatio = 0.25;
    } else if (formData.objective === "Ganhar massa") {
      proteinRatio = 0.35;
      carbRatio = 0.45;
      fatRatio = 0.2;
    } else {
      proteinRatio = 0.3;
      carbRatio = 0.5;
      fatRatio = 0.2;
    }

    const resultsData = {
      ...formData,
      nutritionalPlan: {
        calories: Math.round(calories),
        protein: Math.round(calories * proteinRatio / 4),
        carbs: Math.round(calories * carbRatio / 4),
        fat: Math.round(calories * fatRatio / 9),
        meals: formData.activityLevel === "Muy activo" ? 6 : 5
      },
      createdAt: new Date().toISOString()
    };

    // Salvar no localStorage
    localStorage.setItem('nutri-form', JSON.stringify(resultsData));

    // Atualizar estado local
    setResults({
      calories: Math.round(calories),
      protein: Math.round(calories * proteinRatio / 4),
      carbs: Math.round(calories * carbRatio / 4),
      fat: Math.round(calories * fatRatio / 9),
      meals: formData.activityLevel === "Muy activo" ? 6 : 5
    });

    setCurrentStep(4);
  };

  const handleContinueToPlans = () => {
    router.push('/selecao-plano');
  };

  const stepContents = [
    // Step 1 - Objective
    <>
      <h2 className="text-xl text-center mb-6 text-gray-700">¿Qué objetivo quieres alcanzar?</h2>
      <ObjectiveCards 
        selectedItem={formData.objective}
        setSelectedItem={(obj) => setFormData(prev => ({ ...prev, objective: obj }))}
        setCurrentStep={setCurrentStep}
      />
    </>,

    // Step 2 - Activity Level
    <>
      <h2 className="text-xl text-center mb-6 text-gray-700">¿Cómo es tu ritmo de actividad diaria?</h2>
      <ActivityLevelCards 
        selectedItem={formData.activityLevel}
        setSelectedItem={(level) => setFormData(prev => ({ ...prev, activityLevel: level }))}
        setCurrentStep={setCurrentStep}
      />
    </>,

    // Step 3 - Personal Info
    <>
      <h2 className="text-xl text-center mb-6 text-gray-700">Cuéntanos más sobre ti</h2>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <FaUser className="text-[#06e96c] mr-2" />
            <h3 className="font-bold text-lg text-[#06e96c]">Información Personal</h3>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input 
              type="text" 
              name="name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#06e96c]"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Edad</label>
              <input 
                type="number" 
                name="age"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#06e96c]"
                placeholder="Tu edad"
                min="12"
                max="120"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Género</label>
              <select 
                name="gender"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#06e96c]"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <FaRuler className="text-[#06e96c] mr-2" />
            <h3 className="font-bold text-lg text-[#06e96c]">Medidas Corporales</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Peso (kg)</label>
              <input 
                type="number" 
                name="weight"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#06e96c]"
                placeholder="Ej: 68.5"
                min="30"
                max="300"
                step="0.1"
                value={formData.weight}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Altura (cm)</label>
              <input 
                type="number" 
                name="height"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#06e96c]"
                placeholder="Ej: 175"
                min="100"
                max="250"
                value={formData.height}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <FaBed className="text-[#06e96c] mr-2" />
            <h3 className="font-bold text-lg text-[#06e96c]">Estilo de Vida</h3>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Horas de sueño por noche</label>
            <input 
              type="number" 
              name="sleepHours"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#06e96c]"
              placeholder="Ej: 7"
              min="4"
              max="12"
              value={formData.sleepHours}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generatePlan}
          className="w-full bg-gradient-to-r from-[#06e96c] to-[#04c158] text-white py-3 rounded-xl hover:opacity-90 transition-all mt-4 shadow-md"
        >
          Crear Mi Plan
        </button>
      </div>
    </>
  ];

  const stepTitles = [
    "Tu objetivo",
    "Tu actividad",
    "Tus datos",
    "¡Plan listo!"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#ffe8cd] p-6 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={['#06e96c', '#9c7800', '#FF5722', '#2196F3', '#FFC107']}
        />
      )}
      
      <div className="relative z-10">
        <div className="max-w-2xl mx-auto mb-8">
          {currentStep <= 3 && (
            <div className="flex justify-center items-center space-x-2 mb-6">
              <button
                onClick={handleBack}
                className="flex items-center text-[#06e96c] mr-2"
              >
                <span className="text-3xl font-bold">◀</span>
              </button>
              
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => currentStep <= 3 && step <= currentStep && setCurrentStep(step)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step <= currentStep ? 'bg-[#06e96c] text-white' : 'bg-gray-200 text-gray-600'
                    } ${step <= currentStep ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
                    disabled={step > currentStep}
                  >
                    {step}
                  </button>
                  {step < 3 && (
                    <div
                      className={`w-8 h-1 ${
                        step < currentStep ? 'bg-[#06e96c]' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg bg-opacity-90">
          <h1 className="text-3xl font-bold text-[#9c7800] mb-6 text-center">
            {stepTitles[currentStep - 1]}
          </h1>

          {currentStep < 4 ? (
            <div className="space-y-6">
              {stepContents[currentStep - 1]}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-[#06e96c] rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <FaCheck className="text-white text-4xl" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[#9c7800]">¡Tu plan nutricional está listo!</h2>
              <p className="text-gray-600">Basado en tus respuestas, hemos creado un plan perfecto para ti.</p>
              
              <div className="bg-[#f8f8f8] p-6 rounded-lg text-left space-y-4">
                <h3 className="font-bold text-lg text-[#9c7800] border-b pb-2">Resumen de tu plan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Calorías diarias</p>
                    <p className="text-xl font-bold">{results?.calories || '2,200'} kcal</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mt-4 mb-2">Macronutrientes diarios:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Proteínas</p>
                      <p className="text-lg font-bold">{results?.protein || '165'}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Carbohidratos</p>
                      <p className="text-lg font-bold">{results?.carbs || '220'}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Grasas</p>
                      <p className="text-lg font-bold">{results?.fat || '73'}g</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p><span className="font-semibold">Comidas recomendadas:</span> {results?.meals || '5'} al día</p>
                </div>
              </div>

              <button
                onClick={handleContinueToPlans}
                className="w-full bg-gradient-to-r from-[#06e96c] to-[#04c158] text-white py-3 rounded-xl hover:opacity-90 transition-all mt-6 shadow-md"
              >
                Ver Planos Disponibles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}