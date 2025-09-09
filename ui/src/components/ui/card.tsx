import React from 'react';
import { cn } from '../../utils/cn';
import { tokens } from '../../design-system/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: 'white',
          border: 'none',
          boxShadow: tokens.boxShadow.lg
        };
      case 'outlined':
        return {
          backgroundColor: 'white',
          borderColor: tokens.colors.gray[200],
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: 'none'
        };
      default:
        return {
          backgroundColor: 'white',
          borderColor: tokens.colors.gray[200],
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: tokens.boxShadow.sm
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: tokens.spacing[3] };
      case 'lg':
        return { padding: tokens.spacing[6] };
      default:
        return { padding: tokens.spacing[4] };
    }
  };

  const variantStyles = getVariantStyles();
  const paddingStyles = getPaddingStyles();

  return (
    <div
      className={cn('rounded-lg', className)}
      style={{
        ...variantStyles,
        ...paddingStyles,
        borderRadius: tokens.borderRadius.lg
      }}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn('border-b', className)}
      style={{
        paddingBottom: tokens.spacing[4],
        marginBottom: tokens.spacing[4],
        borderColor: tokens.colors.gray[200],
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid'
      }}
    >
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = 'h3',
}) => {
  return (
    <Component
      className={cn('font-semibold', className)}
      style={{
        fontSize: tokens.typography.fontSize.lg,
        fontWeight: tokens.typography.fontWeight.semibold,
        color: tokens.colors.gray[900],
        lineHeight: tokens.typography.lineHeight.tight
      }}
    >
      {children}
    </Component>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p
      className={cn('text-gray-600', className)}
      style={{
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.gray[600],
        lineHeight: tokens.typography.lineHeight.normal,
        marginTop: tokens.spacing[1]
      }}
    >
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn('border-t pt-4', className)}
      style={{
        paddingTop: tokens.spacing[4],
        marginTop: tokens.spacing[4],
        borderColor: tokens.colors.gray[200],
        borderTopWidth: '1px',
        borderTopStyle: 'solid'
      }}
    >
      {children}
    </div>
  );
};