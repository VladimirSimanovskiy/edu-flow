/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // shadcn/ui цвета (через CSS переменные)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Дизайн-система цвета (прямые значения) - убираем дублирование primary
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
          DEFAULT: 'hsl(214, 95%, 39%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        'success': {
          50: 'hsl(142, 76%, 93%)',
          100: 'hsl(142, 76%, 87%)',
          200: 'hsl(142, 76%, 75%)',
          300: 'hsl(142, 76%, 63%)',
          500: 'hsl(142, 76%, 36%)',
          600: 'hsl(142, 76%, 24%)',
          700: 'hsl(142, 76%, 15%)',
          800: 'hsl(142, 76%, 7%)',
        },
        'warning': {
          50: 'hsl(48, 96%, 93%)',
          100: 'hsl(48, 96%, 87%)',
          200: 'hsl(48, 96%, 75%)',
          300: 'hsl(48, 96%, 63%)',
          500: 'hsl(48, 96%, 36%)',
          600: 'hsl(48, 96%, 24%)',
          700: 'hsl(48, 96%, 15%)',
          800: 'hsl(48, 96%, 7%)',
        },
        'error': {
          50: 'hsl(0, 84%, 93%)',
          100: 'hsl(0, 84%, 87%)',
          200: 'hsl(0, 84%, 75%)',
          300: 'hsl(0, 84%, 63%)',
          500: 'hsl(0, 84%, 60%)',
          600: 'hsl(0, 84%, 30%)',
          700: 'hsl(0, 84%, 15%)',
          800: 'hsl(0, 84%, 7%)',
        },
        'accent': {
          50: 'hsl(280, 100%, 95%)',
          100: 'hsl(280, 100%, 90%)',
          200: 'hsl(280, 100%, 80%)',
          300: 'hsl(280, 100%, 70%)',
          400: 'hsl(280, 100%, 60%)',
          500: 'hsl(280, 100%, 50%)',
          600: 'hsl(280, 100%, 40%)',
          700: 'hsl(280, 100%, 30%)',
          800: 'hsl(280, 100%, 20%)',
          900: 'hsl(280, 100%, 10%)',
        },
        'gray': {
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Дизайн-система радиусы
        'none': '0',
        'sm': '0.125rem',   // 2px
        'base': '0.25rem',  // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        'full': '9999px',
      },
      spacing: {
        // Дизайн-система отступы
        '0': '0',
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
      },
      fontSize: {
        // Дизайн-система размеры шрифтов
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
      },
      fontWeight: {
        // Дизайн-система веса шрифтов
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-gray-300': {
          '&::-webkit-scrollbar-thumb': {
            'background-color': 'hsl(213, 27%, 84%)', // gray-300
            'border-radius': '0.375rem',
          },
        },
        '.scrollbar-track-gray-100': {
          '&::-webkit-scrollbar-track': {
            'background-color': 'hsl(210, 40%, 96%)', // gray-100
          },
        },
        '.scrollbar-thumb-gray-300::-webkit-scrollbar': {
          'width': '6px',
          'height': '6px',
        },
        // Touch scroll utilities
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        '.overscroll-x-contain': {
          'overscroll-behavior-x': 'contain',
        },
      })
    }
  ],
}
