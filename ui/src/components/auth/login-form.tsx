import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
	onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login, isLoggingIn, loginError } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			return;
		}

		try {
			await login({ email, password });
			onSuccess?.();
		} catch (error) {
			// Error is handled by the hook
		}
	};

	return (
		<div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
			<div className="space-y-6">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
					<p className="mt-2 text-sm text-gray-600">
						Войдите в свой аккаунт для доступа к расписанию
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Введите ваш email"
							autoComplete="username"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Пароль
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Введите ваш пароль"
							autoComplete="current-password"
							required
						/>
					</div>

					{loginError && <div className="text-red-600 text-sm">{loginError.message}</div>}

					<button
						type="submit"
						className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
						disabled={isLoggingIn || !email || !password}
					>
						{isLoggingIn ? 'Вход...' : 'Войти'}
					</button>
				</form>
			</div>
		</div>
	);
};
