import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError () {
    return { hasError: true };
  }

  render () {
    const { hasError } = this.state;
    const { children, errorMsg = 'Error' } = this.props;

    if (hasError) {
      return <h1>{errorMsg}</h1>;
    }

    return children;
  }
}
