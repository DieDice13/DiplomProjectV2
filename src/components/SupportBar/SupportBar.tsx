import React from 'react';
import { Phone } from 'lucide-react';

const SupportBar: React.FC = () => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 max-md:hidden">
      <nav
        aria-label="Верхняя навигация поддержки"
        className="max-w-7xl mx-auto flex flex-wrap justify-end items-center gap-4 sm:gap-6 px-4 py-2 text-sm text-black"
      >
        <a href="/delivery" className="hover:text-[var(--site-selector-hover)] transition-colors">
          Доставка и оплата
        </a>
        <a href="/pickup" className="hover:text-[var(--site-selector-hover)] transition-colors">
          Пункты выдачи
        </a>
        <a href="/support" className="hover:text-[var(--site-selector-hover)] transition-colors">
          Поддержка
        </a>
        <a
          href="tel:+77001234567"
          className="flex items-center gap-1 font-medium hover:text-[var(--site-selector-hover)] transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          <span>+7 (700) 123-45-67</span>
        </a>
      </nav>
    </div>
  );
};

export default SupportBar;
