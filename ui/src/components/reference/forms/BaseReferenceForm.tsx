import React from 'react';
import { Card, CardFooter, CardSubTitle, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ReferenceEntity, ReferenceFormProps } from '@/types/reference-system';

interface BaseReferenceFormProps<T extends ReferenceEntity> extends ReferenceFormProps<T> {
  title: string;
  description: string;
  children: React.ReactNode;
  submitButtonText?: string;
  cancelButtonText?: string;
}

/**
 * Базовая форма для справочников с Composition Pattern
 * Следует принципу Single Responsibility - отвечает только за структуру формы
 * Следует принципу Open/Closed - легко расширяется новым содержимым
 */
export const BaseReferenceForm = <T extends ReferenceEntity>({
  entity,
  onSubmit,
  onCancel,
  isLoading = false,
  title,
  description,
  children,
  submitButtonText,
  cancelButtonText = 'Отмена',
}: BaseReferenceFormProps<T>) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Логика отправки будет в дочерних компонентах
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardTitle>{title}</CardTitle>
      <CardSubTitle>{description}</CardSubTitle>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {children}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelButtonText}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : (submitButtonText || (entity ? 'Обновить' : 'Создать'))}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};
