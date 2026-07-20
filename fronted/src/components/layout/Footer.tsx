'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2024 BancoPeru. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-primary-600 transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-primary-600 transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-primary-600 transition-colors">
              Ayuda
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
