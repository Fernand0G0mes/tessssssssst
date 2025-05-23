import { Suspense } from 'react';
import SuccessHandler from '@/components/SuccessHandler';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20">Cargando...</div>}>
      <SuccessHandler />
    </Suspense>
  );
}
