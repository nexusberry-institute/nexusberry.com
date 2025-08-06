/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar'), require('@tailwindcss/typography')],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      // padding: {
      //   '2xl': '2rem',
      //   DEFAULT: '0rem',
      //   lg: '2rem',
      //   md: '1rem',
      //   sm: '0px',
      //   xl: '2rem',
      // },
      // screens: {
      //   '2xl': '86rem',
      //   xl: '80rem',
      //   lg: '64rem',
      //   md: '48rem',
      //   sm: '40rem',
      // },
    },
    extend: {
      screens: {
        xs: '480px',
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-ltr': 'slide-ltr 1s ease-out forwards',
        'slide-rtl': 'slide-rtl 1s ease-out forwards',
        'slide-btt': 'slide-btt 0.8s ease-out forwards',
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'stream-rtl': 'stream-rtl 20s linear infinite',
        'scroll': 'scroll 20s linear infinite',
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary-500))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary-500))',
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
          700: 'hsl(var(--secondary-700))',
          800: 'hsl(var(--secondary-800))',
          900: 'hsl(var(--secondary-900))',
          950: 'hsl(var(--secondary-950))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        openSans: ['var(--font-open-sans)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-ltr': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-rtl': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-btt': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'stream-rtl': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

// import tailwindcssAnimate from 'tailwindcss-animate'
// import typography from '@tailwindcss/typography'

// /** @type {import('tailwindcss').Config} */
// const config = {
//   content: [
//     './pages/**/*.{ts,tsx}',
//     './components/**/*.{ts,tsx}',
//     './app/**/*.{ts,tsx}',
//     './src/**/*.{ts,tsx}',
//   ],
//   darkMode: ['selector', '[data-theme="dark"]'],
//   plugins: [tailwindcssAnimate, typography],
//   prefix: '',
//   safelist: [
//     'lg:col-span-4',
//     'lg:col-span-6',
//     'lg:col-span-8',
//     'lg:col-span-12',
//     'border-border',
//     'bg-card',
//     'border-error',
//     'bg-error/30',
//     'border-success',
//     'bg-success/30',
//     'border-warning',
//     'bg-warning/30',
//   ],
//   theme: {
//     container: {
//       center: true,
//       padding: {
//         '2xl': '2rem',
//         DEFAULT: '1rem',
//         lg: '2rem',
//         md: '2rem',
//         sm: '1rem',
//         xl: '2rem',
//       },
//       screens: {
//         '2xl': '86rem',
//         lg: '64rem',
//         md: '48rem',
//         sm: '40rem',
//         xl: '80rem',
//       },
//     },
//     extend: {
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       colors: {
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         background: 'hsl(var(--background))',
//         border: 'hsla(var(--border))',
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         foreground: 'hsl(var(--foreground))',
//         input: 'hsl(var(--input))',
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         primary: {
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))',
//         },
//         ring: 'hsl(var(--ring))',
//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))',
//         },
//         success: 'hsl(var(--success))',
//         error: 'hsl(var(--error))',
//         warning: 'hsl(var(--warning))',
//       },
//       fontFamily: {
//         mono: ['var(--font-geist-mono)'],
//         sans: ['var(--font-geist-sans)'],
//       },
//       keyframes: {
//         'accordion-down': {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' },
//         },
//       },
//       typography: () => ({
//         DEFAULT: {
//           css: [
//             {
//               '--tw-prose-body': 'var(--text)',
//               '--tw-prose-headings': 'var(--text)',
//               h1: {
//                 fontWeight: 'normal',
//                 marginBottom: '0.25em',
//               },
//             },
//           ],
//         },
//         base: {
//           css: [
//             {
//               h1: {
//                 fontSize: '2.5rem',
//               },
//               h2: {
//                 fontSize: '1.25rem',
//                 fontWeight: 600,
//               },
//             },
//           ],
//         },
//         md: {
//           css: [
//             {
//               h1: {
//                 fontSize: '3.5rem',
//               },
//               h2: {
//                 fontSize: '1.5rem',
//               },
//             },
//           ],
//         },
//       }),
//     },
//   },
// }

// export default config
