import { strToHash } from '../core'

// black
// surface: '#2B2734',
// onSurface: '#E6E1E5'

// https://m3.material.io/styles/color/the-color-system/tokens#7fd4440e-986d-443f-8b3a-4933bff16646
let NANO_THEME = {
  colors: {
    primary: '#0b57d0',
    onPrimary: '#000000',

    primaryContainer: '#0b57d0',
    onPrimaryContainer: '#000000',

    secondary: '#c2e7ff',
    onSecondary: '#ffffff',

    secondaryContainer: '#c2e7ff',
    onSecondaryContainer: '#000000',

    surface: '#f1f5fb',
    onSurface: '#000000',

    surfaceVariant: '#f1f5fb',
    onSurfaceVariant: '#000000',

    background: '#FFFFFF',
    onBackground: '#000000',

    outline: '#00ffff',
    shadow: '#000000',

    white: 'white',
    black: 'black'
  }
}

export const setTheme = (theme: typeof NANO_THEME) => (NANO_THEME = theme)
export const getTheme = () => NANO_THEME

export const boxShadow = `
  -webkit-box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
  -moz-box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
  box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
`

export const userSelect = `
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
`

export const rippleEffect = (rippleClr: string, hoverClr: string) => {
  const rippleClass = `ripple-${strToHash(rippleClr + hoverClr)}`

  const styles = `  
  .${rippleClass} {
    background-position: center;
    transition: background 0.8s;
  }
  
  .${rippleClass}:hover {
    background: ${hoverClr} radial-gradient(circle, transparent 1%, ${hoverClr} 1%) center/15000%;
  }

  .${rippleClass}:focus {
    background: ${hoverClr} radial-gradient(circle, transparent 1%, ${hoverClr} 1%) center/15000%;
  }
  
  .${rippleClass}:active {
    background-color: ${rippleClr};
    background-size: 100%;
    transition: background 0s;
  }`

  return {
    styles,
    class: rippleClass
  }
}

export const zIndex = {
  button: 'unset;',
  banner: '50;',
  bar: '100;',
  navigation: '100;',
  fab: '200;',
  sheet: '300;',
  menu: '400;',
  snackbar: '500;',
  dialog: '600;'
}
