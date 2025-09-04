import type { ReactNode } from 'react';

// FormField — универсальный обертка-компонент для полей формы.
// Используется для:
// 1) Отображения label с текстом поля
// 2) Пометки обязательного поля через required
// 3) Отображения ошибок валидации под полем
// 4) Оборачивания любого input/select/textarea (через children)
type FormFieldProps = {
  label: string; // Текст для label поля
  required?: boolean; // Если true — добавляет звездочку * рядом с label
  error?: string; // Сообщение об ошибке для отображения под полем
  children: ReactNode; // Вложенный элемент формы (input, select, textarea и т.д.)
};

const FormField = ({ label, required, error, children }: FormFieldProps) => {
  return (
    <div className="flex flex-col">
      {/* Label поля */}
      <label className="mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}{' '}
        {/* Красная звездочка для обязательных полей */}
      </label>

      {/* Само поле ввода (input, select и т.д.) */}
      {children}

      {/* Сообщение об ошибке */}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
