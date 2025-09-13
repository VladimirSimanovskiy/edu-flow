import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Home } from './pages/home';
import { Schedule } from './pages/schedule';
import { Button } from './components/ui/button';
import { ErrorBoundary } from './components/ui/error-boundary';
import { ProtectedRoute, UserMenu } from './components/auth';
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
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            EduFlow
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <Link to="/schedule">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Расписание
                </Button>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  Р
                </Button>
              </Link>
            )}
            
            {user ? (
              <UserMenu />
            ) : (
              <Button variant="outline" size="sm">
                <span className="hidden sm:inline">Войти</span>
                <span className="sm:hidden">В</span>
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
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/schedule" element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                } />
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
