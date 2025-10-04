import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Home } from './pages/Home';
import { Schedule } from './pages/schedule';
import { Teachers } from './pages/teachers';
import { Classrooms } from './pages/classrooms';
import { Subjects } from './pages/subjects';
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
					<Link
						to="/"
						className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap"
					>
						EduFlow
					</Link>

					<div className="flex items-center gap-2 sm:gap-4">
						{user && (
							<>
								<Link to="/schedule">
									<Button
										variant="ghost"
										size="sm"
										className="text-xs sm:text-sm whitespace-nowrap"
									>
										Расписание
									</Button>
								</Link>
								<Link to="/teachers">
									<Button
										variant="ghost"
										size="sm"
										className="text-xs sm:text-sm whitespace-nowrap"
									>
										Учителя
									</Button>
								</Link>
								<Link to="/classrooms">
									<Button
										variant="ghost"
										size="sm"
										className="text-xs sm:text-sm whitespace-nowrap"
									>
										Кабинеты
									</Button>
								</Link>
								<Link to="/subjects">
									<Button
										variant="ghost"
										size="sm"
										className="text-xs sm:text-sm whitespace-nowrap"
									>
										Предметы
									</Button>
								</Link>
							</>
						)}

						{user ? (
							<UserMenu />
						) : (
							<Button
								variant="outline"
								size="sm"
								className="text-xs sm:text-sm whitespace-nowrap"
							>
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
								<Route
									path="/"
									element={
										<ProtectedRoute>
											<Home />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/schedule"
									element={
										<ProtectedRoute>
											<Schedule />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/teachers"
									element={
										<ProtectedRoute>
											<Teachers />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/classrooms"
									element={
										<ProtectedRoute>
											<Classrooms />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/subjects"
									element={
										<ProtectedRoute>
											<Subjects />
										</ProtectedRoute>
									}
								/>
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
