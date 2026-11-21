import base from './base'

export default {
  ...base,
  colors: {
    ...base.colors,
    shadow1: 'rgba(0, 0, 0, 0.5)',
    text1: '#F5F5F5',
    text2: '#B3B3B3',
    text3: '#858585',
    text4: '#666666',

    // backgrounds / greys with modern glassmorphism
    bg0: '#131313',
    bg1: '#1B1B1B',
    bg2: '#242424',
    bg3: '#303030',
    bg4: '#3C3C3C',
    bg5: '#484848',
    bg6: 'linear-gradient(135deg, rgba(102, 126, 234, 0.07) 0%, rgba(118, 75, 162, 0.07) 100%)',

    //specialty colors
    modalBG: 'rgba(2, 4, 10, 0.78)',
    advancedBG: 'rgba(12, 16, 27, 0.92)',

    //primary colors
    primary1: '#FC72FF',
    primary2: '#FF99FF',
    primary3: '#E85AE8',
    primary4: '#B53BB7',
    primary5: '#6E2F70',
    primary6: 'rgba(252, 114, 255, 0.14)',

    // color text
    primaryText1: '#FFFFFF',
    buttonText: '#FFFFFF',

    // secondary colors
    secondary1: '#10B981',
    secondary2: '#34D399',
    secondary3: '#6EE7B7'
  }
}
