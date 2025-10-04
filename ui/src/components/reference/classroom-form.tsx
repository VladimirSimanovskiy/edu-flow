import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { Classroom, ClassroomFormData } from '../../types/reference';

// Схема валидации
const classroomFormSchema = z.object({
  number: z.number().int().positive('Номер кабинета должен быть положительным числом'),
  floor: z.number().int().min(1, 'Этаж должен быть не менее 1').max(10, 'Этаж должен быть не более 10'),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

interface ClassroomFormProps {
  classroom?: Classroom;
  onSubmit: (data: ClassroomFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClassroomForm: React.FC<ClassroomFormProps> = ({
  classroom,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      number: classroom?.number || 0,
      floor: classroom?.floor || 1,
    },
  });

  const handleFormSubmit = (data: ClassroomFormValues) => {
    onSubmit({
      number: data.number,
      floor: data.floor,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {classroom ? 'Редактировать кабинет' : 'Добавить кабинет'}
        </CardTitle>
        <CardDescription>
          {classroom
            ? 'Внесите изменения в информацию о кабинете'
            : 'Заполните информацию о новом кабинете'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Номер кабинета */}
            <div className="space-y-2">
              <Label htmlFor="number">Номер кабинета *</Label>
              <Input
                id="number"
                type="number"
                {...register('number', { valueAsNumber: true })}
                placeholder="Введите номер кабинета"
                className={errors.number ? 'border-red-500' : ''}
              />
              {errors.number && (
                <p className="text-sm text-red-500">{errors.number.message}</p>
              )}
            </div>

            {/* Этаж */}
            <div className="space-y-2">
              <Label htmlFor="floor">Этаж *</Label>
              <Input
                id="floor"
                type="number"
                {...register('floor', { valueAsNumber: true })}
                placeholder="Введите этаж"
                min="1"
                max="10"
                className={errors.floor ? 'border-red-500' : ''}
              />
              {errors.floor && (
                <p className="text-sm text-red-500">{errors.floor.message}</p>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : classroom ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
