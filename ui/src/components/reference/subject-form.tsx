import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { Subject, SubjectFormData } from '../../types/reference';

// Схема валидации
const subjectFormSchema = z.object({
  name: z.string().min(1, 'Название предмета обязательно').max(100, 'Название слишком длинное'),
  code: z.string().min(1, 'Код предмета обязателен').max(10, 'Код слишком длинный'),
  description: z.string().max(500, 'Описание слишком длинное').optional().or(z.literal('')),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (data: SubjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subject,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: subject?.name || '',
      code: subject?.code || '',
      description: subject?.description || '',
    },
  });

  const handleFormSubmit = (data: SubjectFormValues) => {
    onSubmit({
      name: data.name,
      code: data.code,
      description: data.description || undefined,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {subject ? 'Редактировать предмет' : 'Добавить предмет'}
        </CardTitle>
        <CardDescription>
          {subject
            ? 'Внесите изменения в информацию о предмете'
            : 'Заполните информацию о новом предмете'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Название предмета */}
            <div className="space-y-2">
              <Label htmlFor="name">Название предмета *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Введите название предмета"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Код предмета */}
            <div className="space-y-2">
              <Label htmlFor="code">Код предмета *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Введите код предмета"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Введите описание предмета"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : subject ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
