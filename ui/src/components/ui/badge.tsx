import React from 'react';
import { cn } from '../../utils/cn';
import { tokens } from '../../design-system/tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: tokens.colors.gray[100],
          color: tokens.colors.gray[800],
          borderColor: tokens.colors.gray[200]
        };
      case 'success':
        return {
          backgroundColor: tokens.colors.success[100],
          color: tokens.colors.success[800],
          borderColor: tokens.colors.success[200]
        };
      case 'warning':
        return {
          backgroundColor: tokens.colors.warning[100],
          color: tokens.colors.warning[800],
          borderColor: tokens.colors.warning[200]
        };
      case 'error':
        return {
          backgroundColor: tokens.colors.error[100],
          color: tokens.colors.error[800],
          borderColor: tokens.colors.error[200]
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: tokens.colors.gray[700],
          borderColor: tokens.colors.gray[300]
        };
      default:
        return {
          backgroundColor: tokens.colors.primary[100],
          color: tokens.colors.primary[800],
          borderColor: tokens.colors.primary[200]
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
          fontSize: tokens.typography.fontSize.xs,
          borderRadius: tokens.borderRadius.sm
        };
      case 'lg':
        return {
          padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
          fontSize: tokens.typography.fontSize.sm,
          borderRadius: tokens.borderRadius.md
        };
      default:
        return {
          padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
          fontSize: tokens.typography.fontSize.xs,
          borderRadius: tokens.borderRadius.base
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border',
        className
      )}
      style={{
        ...variantStyles,
        ...sizeStyles,
        fontWeight: tokens.typography.fontWeight.medium,
        borderWidth: '1px',
        borderStyle: 'solid',
        transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`
      }}
    >
      {children}
    </span>
  );
};