import { strToHash } from '../core'

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

  
  .${rippleClass}:active {
    background-color: ${rippleClr};
    background-size: 100%;
    transition: background 0s;
  }`

  return {
    styles,
    class: rippleClass,
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
  dialog: '600;',
}
