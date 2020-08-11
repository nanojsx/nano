import { h } from './core.ts'
import { Component } from './component.ts'
import { Fragment } from './fragment.ts'
import { Helmet } from './components/helmet.ts'

export const withStyles: any = (styles: any) => (WrappedComponent: any) => {
  return class extends Component {
    render() {
      const { children, ...rest } = this.props

      const helmet = h(Helmet, null, h('style', null, styles))

      const component =
        children && children.length > 0
          ? h(WrappedComponent, { ...rest }, children)
          : h(WrappedComponent, { ...this.props })

      return h(Fragment, null, helmet, component)

      // same in JSX
      // return (
      //   <Fragment>
      //     <Helmet>
      //       <style>{styles}</style>
      //     </Helmet>

      //     {children && children.length > 0 ? (
      //       <WrappedComponent {...rest}>{children}</WrappedComponent>
      //     ) : (
      //       <WrappedComponent {...this.props} />
      //     )}
      //   </Fragment>
      // )
    }
  }
}
