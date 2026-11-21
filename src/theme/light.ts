import base from './base'

export default {
  ...base,
  colors: {
    ...base.colors,
    shadow1: 'rgba(0, 0, 0, 0.1)',
    text1: '#222222',
    text2: '#6B7280',
    text3: '#8B909A',
    text4: '#B4B7BE',

    // backgrounds / greys with modern glassmorphism
    bg0: '#FAFAFA',
    bg1: '#FFFFFF',
    bg2: '#F5F5F5',
    bg3: '#EDEDED',
    bg4: '#E2E2E2',
    bg5: '#D6D6D6',
    bg6: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    
    modalBG: 'rgba(0, 0, 0, 0.4)',
    advancedBG: 'rgba(255, 255, 255, 0.7)',

    //primary colors
    primary1: '#FC72FF',
    primary2: '#FF99FF',
    primary3: '#E85AE8',
    primary4: '#FFD6FF',
    primary5: '#FFE8FF',
    primary6: 'rgba(252, 114, 255, 0.12)',

    // color text
    primaryText1: '#FFFFFF',
    buttonText: '#FFFFFF',

    // secondary colors
    secondary1: '#10B981',
    secondary2: '#34D399',
    secondary3: '#6EE7B7'
  }
}
