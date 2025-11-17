import { createGlobalStyle } from 'styled-components'

export const FixedGlobalStyle = createGlobalStyle`
    html, input, textarea, button {
      font-family: 'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      letter-spacing: -0.018em;
      font-display: swap;
    }
    @supports (font-variation-settings: normal) {
      html, input, textarea, button {
        font-family: 'Inter var', 'Noto Sans', sans-serif;
      }
    }

    html,
    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }

    * {
      box-sizing: border-box;
    }

    button {
      user-select: none;
    }

    html {
      font-family: 'Inter', 'Noto Sans', sans-serif;
      font-size: 16px;
      font-variant: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      text-rendering: optimizeLegibility;
    }

    /* Smooth scroll behavior */
    @media (prefers-reduced-motion: no-preference) {
      html {
        scroll-behavior: smooth;
      }
    }
`

export const ThemedGlobalStyle = createGlobalStyle`
    /* Custom scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.bg2};
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.primary1};
      border-radius: 10px;
      transition: background 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.primary2};
    }

    html {
      color: ${({ theme }) => theme.colors.text1};
      background-color: ${({ theme }) => theme.colors.bg0};
      background-image: 
        radial-gradient(at 0% 0%, rgba(102, 126, 234, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(118, 75, 162, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(102, 126, 234, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(118, 75, 162, 0.1) 0px, transparent 50%);
    }

    body {
      min-height: 100vh;
      background-position: 0 0;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }

    /* Modern focus styles */
    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary1};
      outline-offset: 2px;
    }

    /* Smooth transitions for theme changes */
    body,
    body * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
`
