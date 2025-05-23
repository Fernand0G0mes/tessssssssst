'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiCheck, FiArrowRight } from 'react-icons/fi';

export default function ComenzarPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setProviderLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err) {
      setError('Error al registrarse con Google');
      console.error(err);
    } finally {
      setProviderLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/BACK_Login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Container principal com as duas caixas */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
        {/* Caixa 1: Chamada e benefícios */}
 <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col items-center justify-center text-center rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm h-full">
  <div className="mb-8">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 leading-tight tracking-tight break-words">
      <span className="block text-[var(--verde-escuro)]">TU PLAN</span>
      <span className="block text-[var(--verde-escuro)]">NUTRICIONAL</span>
      <span className="block text-[var(--verde-claro)]">personalizado</span>
    </h1>

    <p className="text-lg md:text-xl font-medium italic text-[var(--verde-escuro)]">
      Descubre el poder de una alimentación saludable
    </p>
  </div>

  <div className="space-y-4 max-w-md w-full">
    <div className="flex items-start gap-4 bg-[var(--verde-escuro)] p-4 rounded-lg shadow-md">
      <FiCheck className="text-2xl text-white mt-1 flex-shrink-0" />
      <div className="text-left">
        <h3 className="font-semibold text-lg text-white">Regístrate gratis</h3>
        <p className="text-white text-opacity-90">Sin tarjeta de crédito</p>
      </div>
    </div>
    <div className="flex items-start gap-4 bg-[var(--verde-escuro)] p-4 rounded-lg shadow-md">
      <FiCheck className="text-2xl text-white mt-1 flex-shrink-0" />
      <div className="text-left">
        <h3 className="font-semibold text-lg text-white">Plan personalizado</h3>
        <p className="text-white text-opacity-90">Para tus objetivos específicos</p>
      </div>
    </div>
    <div className="flex items-start gap-4 bg-[var(--verde-escuro)] p-4 rounded-lg shadow-md">
      <FiCheck className="text-2xl text-white mt-1 flex-shrink-0" />
      <div className="text-left">
        <h3 className="font-semibold text-lg text-white">+5,000 recetas</h3>
        <p className="text-white text-opacity-90">Variadas y deliciosas</p>
      </div>
    </div>
  </div>
</div>


        {/* Caixa 2: Formulário de registro */}
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-15 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              REGÍSTRATE GRATIS AHORA
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignup}
              disabled={providerLoading}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-4 shadow-sm"
            >
              <FcGoogle className="text-xl" />
              <span>{providerLoading ? 'Cargando...' : 'REGÍSTRATE CON GOOGLE'}</span>
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-3 text-gray-400 text-sm">o con tu email</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--amarelo-escuro)] hover:bg-[var(--amarelo-claro)] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Comenzar ahora</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-center mt-6 text-gray-500">
              Al registrarte, aceptas nuestros <a href="#" className="text-green-600 hover:underline">Términos</a> y <a href="#" className="text-green-600 hover:underline">Política de Privacidad</a>
            </p>

            <div className="mt-4 text-center">
              <button 
                onClick={() => router.push('/login')}
                className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}