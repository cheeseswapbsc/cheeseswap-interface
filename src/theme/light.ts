import base from './base'

export default {
  ...base,
  colors: {
    ...base.colors,
    shadow1: 'rgba(0, 0, 0, 0.1)',
    text1: '#15161B',
    text2: '#565B6B',
    text3: '#8B909A',
    text4: '#B4B7BE',

    // backgrounds / pump.fun style light surfaces
    bg0: '#F5F7F6',
    bg1: '#FFFFFF',
    bg2: '#EFF3F0',
    bg3: '#E3EAE5',
    bg4: '#D5DED8',
    bg5: '#C6D1C9',
    bg6: 'linear-gradient(135deg, rgba(95, 203, 135, 0.06) 0%, rgba(123, 255, 105, 0.06) 100%)',

    modalBG: 'rgba(21, 22, 27, 0.4)',
    advancedBG: 'rgba(255, 255, 255, 0.7)',

    //primary colors (pump.fun green, saturated for light backgrounds)
    primary1: '#31C36B',
    primary2: '#5FCB87',
    primary3: '#28A85A',
    primary4: '#C9F0D8',
    primary5: '#E8F8EE',
    primary6: 'rgba(49, 195, 107, 0.12)',

    // color text
    primaryText1: '#157A3E',
    buttonText: '#0E0E16',

    // secondary colors
    secondary1: '#10B981',
    secondary2: '#34D399',
    secondary3: '#6EE7B7'
  }
}
