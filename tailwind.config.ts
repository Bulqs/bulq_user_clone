import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
    
  ],
  theme: {
    extend: {
      keyframes: {
        roundedTransition: {
          '0%, 100%': {
            borderRadius: '100%',
            width: '5%',
            height: '5%',
          },
          '50%': {
            borderRadius: '0%',
            width: '100%',
            height: '100%',
          },
        },
      },
      animation: {
        roundedTransition: 'roundedTransition 4s ease-in-out infinite',
      },
      objectFit: ['responsive', 'hover', 'focus'],
      colors: {
        appWhite: '#FFF',
        appBlack: '#000',
        appBanner: '#28A99E',
        appNav: '#008088',
        appTitleBgColor: '#114949',
        appRed: 'red',
        appYellow: '#eef21c',
        appLightBlack: '#1C1C1C',
        appBlue: '#000033',
        applightBlue: '#B4FFF9',
      },
      boxShadow: {
        'custom': '10px 10px 30px rgba(0, 0, 0, 0.3)', // Custom shadow
      },
      screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
    },
  },
  plugins: [],
}
export default config