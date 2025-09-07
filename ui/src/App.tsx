import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { TeacherSchedule } from './pages/TeacherSchedule';
import { ClassSchedule } from './pages/ClassSchedule';
import { Button } from './components/ui/Button';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  Школьное расписание
                </Link>
                <div className="flex items-center gap-4">
                  <Link to="/teachers">
                    <Button variant="ghost">Учителя</Button>
                  </Link>
                  <Link to="/classes">
                    <Button variant="ghost">Классы</Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teachers" element={<TeacherSchedule />} />
              <Route path="/classes" element={<ClassSchedule />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
