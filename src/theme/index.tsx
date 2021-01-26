import WebFont from 'webfontloader'
export { default as lightTheme } from './light'
export { default as darkTheme } from './dark'

WebFont.load({
  google: {
    families: ['Noto+Sans:400,500,600,700,800,900', 'sans-serif']
  }
})
