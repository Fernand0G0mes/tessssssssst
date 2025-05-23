'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, appleProvider } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

type LoginModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const LoginModal = ({ isOpen, closeModal }: LoginModalProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<'google' | 'apple' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      closeModal();
    } catch (error) {
      setError('Correo o contraseña incorrectos');
      console.error('Error al iniciar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'apple') => {
    setProviderLoading(provider);
    setError('');

    try {
      const providerInstance = provider === 'google' ? googleProvider : appleProvider;
      await signInWithPopup(auth, providerInstance);
      router.push('/dashboard');
      closeModal();
    } catch (error) {
      setError(`Error al iniciar con ${provider === 'google' ? 'Google' : 'Apple'}`);
      console.error(`Error con ${provider} Auth:`, error);
    } finally {
      setProviderLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundImage: 'url(/BACK_Login.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.7)'
        }}
      />
      
      <div
        className="bg-white rounded-[25px] w-full max-w-[330px] min-h-[200px] p-8 shadow-lg relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Fechar modal"
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={closeModal}
        >
          &times;
        </button>

        <h2 id="modal-title" className="text-2xl font-semibold mb-4 text-center">
          ¡Tu plan está listo!
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-4">
          <button 
            type="button"
            className="w-full bg-[#4285F4] text-white py-2 rounded-lg flex justify-center items-center hover:bg-[#3367D6] transition-colors"
            onClick={() => handleProviderLogin('google')}
            disabled={!!providerLoading}
          >
            <FcGoogle className="mr-2 text-lg bg-white rounded-full" />
            {providerLoading === 'google' ? 'Cargando...' : 'INICIAR CON GOOGLE'}
          </button>

          <button 
            type="button"
            className="w-full bg-black text-white py-2 rounded-lg flex justify-center items-center hover:bg-gray-800 transition-colors"
            onClick={() => handleProviderLogin('apple')}
            disabled={!!providerLoading}
          >
            <FaApple className="mr-2 text-lg" />
            {providerLoading === 'apple' ? 'Cargando...' : 'INICIAR CON APPLE'}
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">o</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#06e96c]"
                placeholder="Tu correo electrónico"
                disabled={loading || !!providerLoading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#06e96c]"
                placeholder="Tu contraseña"
                disabled={loading || !!providerLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#06e96c] text-white py-2 rounded-[20px] hover:bg-[#05d161] transition-colors flex justify-center items-center"
            disabled={loading || !!providerLoading}
          >
            {loading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <button 
            className="text-[#06e96c] hover:underline font-medium"
            onClick={() => {
              closeModal();
              router.push('/signup');
            }}
            disabled={loading || !!providerLoading}
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;