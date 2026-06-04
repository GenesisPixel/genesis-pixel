/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        white: 'var(--app-color-white)',
        blue: {
          100: 'var(--app-color-blue100)',
          200: 'var(--app-color-blue200)',
          300: 'var(--app-color-blue300)',
          400: 'var(--app-color-blue400)',
          500: 'var(--app-color-blue500)',
          600: 'var(--app-color-blue600)',
          700: 'var(--app-color-blue700)',
          800: 'var(--app-color-blue800)',
        },
        grey: {
          200: 'var(--app-color-grey200)',
          300: 'var(--app-color-grey300)',
          400: 'var(--app-color-grey400)',
          500: 'var(--app-color-grey500)',
          600: 'var(--app-color-grey600)',
          700: 'var(--app-color-grey700)',
          800: 'var(--app-color-grey800)',
        },
        charcoal: {
          200: 'var(--app-color-charcoal200)',
          300: 'var(--app-color-charcoal300)',
          400: 'var(--app-color-charcoal400)',
          500: 'var(--app-color-charcoal500)',
          600: 'var(--app-color-charcoal600)',
          700: 'var(--app-color-charcoal700)',
          800: 'var(--app-color-charcoal800)',
        },
        yellow: {
          100: 'var(--app-color-yellow100)',
          200: 'var(--app-color-yellow200)',
          300: 'var(--app-color-yellow300)',
          400: 'var(--app-color-yellow400)',
          500: 'var(--app-color-yellow500)',
          600: 'var(--app-color-yellow600)',
          900: 'var(--app-color-yellow900)',
        },
        green: {
          200: 'var(--app-color-green200)',
          500: 'var(--app-color-green500)',
          600: 'var(--app-color-green600)',
          700: 'var(--app-color-green700)',
          750: 'var(--app-color-green750)',
          800: 'var(--app-color-green800)',
        },
        indigo: {
          200: 'var(--app-color-indigo200)',
        },
        purple: {
          100: 'var(--app-color-purple100)',
          200: 'var(--app-color-purple200)',
        },
        lavender: {
          200: 'var(--app-color-lavender200)',
        },
      },
      borderRadius: {
        base: 'var(--radius-base)',
        'doodler-menu': 'var(--doodler-radius-menu)',
        'doodler-md': 'var(--doodler-radius-md)',
        'doodler-lg': 'var(--doodler-radius-lg)',
      },
      boxShadow: {
        menu: 'var(--shadow-menu)',
      },
      transitionTimingFunction: {
        curve: 'var(--curve)',
      },
      transitionDuration: {
        curve: 'var(--curve-timing)',
      },
      fontFamily: {
        gt: 'var(--font-gt)',
        acorn: 'var(--font-acorn)',
      },
    },
  },
  plugins: [],
};
