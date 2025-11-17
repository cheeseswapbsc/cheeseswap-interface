import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // shadows
  shadow1: Color
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color


  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color

  modalBG: Color
  advancedBG: Color

  //primary colors (purple/blue)
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color
  primary6: Color

  primaryText1: Color
  buttonText: Color

  // secondary colors (green)
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // greens
  green1: Color
  green2: Color
  green3: Color
  
  // reds
  red1: Color
  red2: Color
  red3: Color
  
  // yellows
  yellow1: Color
  yellow2: Color
  yellow3: Color
  
  // purples
  purple1: Color
  purple2: Color
  purple3: Color
  
  // blues
  blue1: Color
  blue2: Color
  blue3: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

export interface Gradients {
  primary: string
  success: string
  danger: string
  gold: string
  cosmic: string
  sunset: string
}

export interface Spacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
}

export interface BorderRadius {
  sm: string
  md: string
  lg: string
  xl: string
  round: string
}

export interface Shadows {
  sm: string
  md: string
  lg: string
  xl: string
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors
    grids: Grids
    gradient: string
    gradients: Gradients
    spacing: Spacing
    borderRadius: BorderRadius
    shadows: Shadows
    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
