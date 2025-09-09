/**
 * Design System Tokens
 * Централизованная система дизайн-токенов для консистентности UI
 */

export const tokens = {
  // Цветовая палитра
  colors: {
    // Основные цвета
    primary: {
      50: 'hsl(214, 95%, 93%)',
      100: 'hsl(214, 95%, 87%)',
      200: 'hsl(214, 95%, 75%)',
      300: 'hsl(214, 95%, 63%)',
      400: 'hsl(214, 95%, 51%)',
      500: 'hsl(214, 95%, 39%)', // Основной цвет
      600: 'hsl(214, 95%, 27%)',
      700: 'hsl(214, 95%, 15%)',
      800: 'hsl(214, 95%, 7%)',
      900: 'hsl(214, 95%, 3%)',
    },
    
    // Семантические цвета
    success: {
      50: 'hsl(142, 76%, 93%)',
      100: 'hsl(142, 76%, 87%)',
      500: 'hsl(142, 76%, 36%)',
      600: 'hsl(142, 76%, 24%)',
    },
    
    warning: {
      50: 'hsl(48, 96%, 93%)',
      100: 'hsl(48, 96%, 87%)',
      500: 'hsl(48, 96%, 36%)',
      600: 'hsl(48, 96%, 24%)',
    },
    
    error: {
      50: 'hsl(0, 84%, 93%)',
      100: 'hsl(0, 84%, 87%)',
      500: 'hsl(0, 84%, 60%)',
      600: 'hsl(0, 84%, 30%)',
    },
    
    // Нейтральные цвета
    gray: {
      50: 'hsl(210, 40%, 98%)',
      100: 'hsl(210, 40%, 96%)',
      200: 'hsl(214, 32%, 91%)',
      300: 'hsl(213, 27%, 84%)',
      400: 'hsl(215, 20%, 65%)',
      500: 'hsl(215, 16%, 47%)',
      600: 'hsl(215, 19%, 35%)',
      700: 'hsl(215, 25%, 27%)',
      800: 'hsl(217, 33%, 17%)',
      900: 'hsl(222, 84%, 5%)',
    },
  },

  // Типографика
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Отступы и размеры
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Радиусы скругления
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Тени
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Анимации
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-index слои
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Типы для TypeScript
export type ColorScale = keyof typeof tokens.colors.primary;
export type SpacingScale = keyof typeof tokens.spacing;
export type FontSizeScale = keyof typeof tokens.typography.fontSize;
export type FontWeightScale = keyof typeof tokens.typography.fontWeight;
