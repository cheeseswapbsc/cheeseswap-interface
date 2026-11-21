import base from './base'

export default {
  ...base,
  colors: {
    ...base.colors,
    shadow1: 'rgba(0, 0, 0, 0.5)',
    text1: '#F5F5F5',
    text2: '#C3C5CB',
    text3: '#8A8FA3',
    text4: '#5E6373',

    // backgrounds / pump.fun style near-black surfaces
    bg0: '#0E0E16',
    bg1: '#15161B',
    bg2: '#1B1D27',
    bg3: '#23262F',
    bg4: '#2A2A3E',
    bg5: '#353849',
    bg6: 'linear-gradient(135deg, rgba(123, 255, 105, 0.07) 0%, rgba(95, 203, 135, 0.07) 100%)',

    //specialty colors
    modalBG: 'rgba(14, 14, 22, 0.78)',
    advancedBG: 'rgba(21, 22, 27, 0.92)',

    //primary colors (pump.fun neon green)
    primary1: '#7BFF69',
    primary2: '#A4FF97',
    primary3: '#5FCB87',
    primary4: '#3E9B63',
    primary5: '#1E3D2B',
    primary6: 'rgba(123, 255, 105, 0.14)',

    // color text
    primaryText1: '#83FFAE',
    buttonText: '#0E0E16',

    // secondary colors
    secondary1: '#5FCB87',
    secondary2: '#84EFAB',
    secondary3: '#B5F5C8'
  }
}
