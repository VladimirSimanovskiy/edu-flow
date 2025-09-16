import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';

export const UserMenu: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {

      await logout();
      setIsOpen(false);

  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'TEACHER':
        return 'Учитель';
      case 'STUDENT':
        return 'Ученик';
      default:
        return role;
    }
  };

  const getUserDisplayName = () => {
    if (user.teacher) {
      return `${user.teacher.firstName} ${user.teacher.lastName}`;
    }
    if (user.student) {
      return `${user.student.firstName} ${user.student.lastName}`;
    }
    return user.email;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getUserDisplayName().charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block text-sm whitespace-nowrap">{getUserDisplayName()}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border">
            <div className="py-1">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-sm text-gray-500">
                  {getRoleDisplayName(user.role)}
                </p>
                <p className="text-xs text-gray-400">
                  {user.email}
                </p>
              </div>
              
              <div className="px-4 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full"
                >
                  {isLoggingOut ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Выход...
                    </>
                  ) : (
                    'Выйти'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
