import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AuthPage } from './auth-page';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
	const { user, isLoadingUser } = useAuth();

	// Show loading spinner while checking authentication
	if (isLoadingUser) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	// If no user, show auth page
	if (!user) {
		return <AuthPage />;
	}

	// If role is required and user doesn't have it, show access denied
	if (requiredRole && user.role !== requiredRole) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
					<p className="text-gray-600">У вас нет прав для доступа к этой странице.</p>
					<p className="text-sm text-gray-500 mt-2">Требуемая роль: {requiredRole}</p>
				</div>
			</div>
		);
	}

	// User is authenticated and has required role (if any)
	return <>{children}</>;
};
