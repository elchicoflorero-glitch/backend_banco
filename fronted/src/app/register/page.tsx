'use client';

import { Suspense } from 'react';
import { RegisterForm } from './components/RegisterForm';

export default function Register() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
