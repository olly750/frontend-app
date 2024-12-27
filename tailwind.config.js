const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontWeight: ['hover', 'focus'],
      opacity: ['disabled'],
      fontSize: {
        tiny: '11px',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      borderWidth: {
        6: '6px',
      },
      colors: {
        info: {
          400: '#E9EBFA',
        },
        current: 'currentColor',
        lightblue: '#F6FAFF',
        lightgreen: '#E7EFEE',
        secondary: '#FAFBFC',
        tertiary: '#F0F1F1',
        main: '#FFFFFF',
        error: {
          400: '#FDECEC',
          500: '#EE4040',
        },
        warning: {
          400: '#FEF5D3',
          500: '#FACD23',
        },
        success: {
          400: '#E9F6F2',
          500: '#3CD278',
          600: '#106938',
        },
        'txt-primary': '#050825',
        'txt-secondary': '#97A0A8',
        silver: '#DAE0E5',
      },
      boxShadow: {
        DEFAULT: '0px 28px 44px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  variants: {},
  plugins: [
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            primary: {
              600: '#2337CC',
              500: '#394bd1',
              400: '#4d5fd6',
              DEFAULT: '#394bd1',
            },
          },
        },
      },
      themes: [
        {
          name: 'NISS-theme',
          extend: {
            colors: {
              primary: {
                600: '#0d4b44',
                500: '#105E55',
                400: '#407E77',
                DEFAULT: '#105E55',
              },
            },
          },
        },
        {
          name: 'RNP-theme',
          extend: {
            colors: {
              primary: {
                600: '#010138',
                500: '#01013e',
                400: '#1a1a51',
                DEFAULT: '#01013e',
              },
            },
          },
        },
        {
          name: 'RCS-theme',
          extend: {
            colors: {
              primary: {
                600: '#857d63',
                500: '#948b6e',
                400: '#9f977d',
                DEFAULT: '#948b6e',
              },
            },
          },
        },
        {
          name: 'MILITARY-theme',
          extend: {
            colors: {
              primary: {
                600: '#084223',
                500: '#094927',
                400: '#225b3d',
                DEFAULT: '#094927',
              },
            },
          },
        },
      ],
    }),
  ],
};
