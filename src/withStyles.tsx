import * as Nano from './core'
import { Component } from './component'
import { Fragment } from './fragment'
import { Helmet } from './components/helmet'

export const withStyles: any = (styles: any) => (WrappedComponent: any) => {
  return class extends Component {
    render() {
      const { children, ...rest } = this.props

      return (
        <Fragment>
          <Helmet>
            <style>{styles}</style>
          </Helmet>

          {children && children.length > 0 ? (
            <WrappedComponent {...rest}>{children}</WrappedComponent>
          ) : (
            <WrappedComponent {...this.props} />
          )}
        </Fragment>
      )
    }
  }
}
