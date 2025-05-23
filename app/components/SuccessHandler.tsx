'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) return;

      await fetch('/api/stripe/verify', {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });

      const email = localStorage.getItem('nutri-email');
      const password = localStorage.getItem('nutri-password');

      if (email && password) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          router.push('/dashboard');
        } catch {
          router.push('/');
        }
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">¡Pago Exitoso!</h1>
      <p>Tu cuenta está siendo activada...</p>
    </div>
  );
}
