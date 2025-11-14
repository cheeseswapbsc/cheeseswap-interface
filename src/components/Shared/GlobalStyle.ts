import { createGlobalStyle } from 'styled-components'

export const FixedGlobalStyle = createGlobalStyle`
    html, input, textarea, button {
      font-family: Noto Sans, 'Inter',sans-serif;
      letter-spacing: -0.018em;
      font-display: fallback;
    }
    @supports (font-variation-settings: normal) {
      html, input, textarea, button {
        font-family: Noto Sans, 'Inter',sans-serif;
      }
    }

    html,
    body {
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
    }

    button {
      user-select: none;
    }

    html {
      font-family: Noto Sans,'Inter', sans-serif;
      font-size: 14px;
      font-variant: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
`

export const ThemedGlobalStyle = createGlobalStyle`
    html {
      color: ${({ theme }) => theme.colors.text1};
      background-color:${({ theme }) => theme.colors.bg0};
      background-image: radial-gradient(50% 50% at 50% 50%,rgba(214, 66, 179, 0.1) 0%,rgb(214, 66, 179, 0.0) 100%);
    }

    body {
      min-height: 100vh;
      background-position: 0 -30vh;
      background-repeat: no-repeat;
    }
`
