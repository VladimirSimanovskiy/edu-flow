import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Школьное расписание
          </h1>
          <p className="text-xl text-gray-600">
            Управление расписанием учителей и классов
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Teacher Schedule Card */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Расписание учителей</CardTitle>
              <CardDescription>
                Просмотр расписания преподавателей по дням и неделям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/teachers">
                <Button className="w-full">
                  Открыть расписание
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Class Schedule Card */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Расписание классов</CardTitle>
              <CardDescription>
                Просмотр расписания учебных классов по дням и неделям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/classes">
                <Button className="w-full">
                  Открыть расписание
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Управление проектами</CardTitle>
              <CardDescription>
                Скоро: Канбан доска для управления школьными проектами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled>
                Скоро будет доступно
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
