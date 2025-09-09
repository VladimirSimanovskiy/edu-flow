import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Home } from './pages/home';
import { TeacherSchedule } from './pages/teacher-schedule';
import { ClassSchedule } from './pages/class-schedule';
import { Button } from './components/ui/button';
import { ErrorBoundary } from './components/ui/error-boundary';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
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
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm">
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teachers" element={<TeacherSchedule />} />
                <Route path="/classes" element={<ClassSchedule />} />
              </Routes>
            </main>
          </div>
        </Router>
        
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
