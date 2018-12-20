import React from 'react';

export class HistoryLink extends React.Component {
  elRef = React.createRef()

  componentDidMount () {
    const { href, history: { push } = {} } = this.props;
    const isAbsolute = href.match(/^(https?:)?\/\//);

    if (isAbsolute || !push) return;

    this.elRef.current.addEventListener('click', e => {
      e.preventDefault();
      push(href);
    });
  }

  render () {
    const { href, children } = this.props;
    const { elRef } = this;

    return <a ref={elRef} href={href}>{children}</a>;
  }
}

export default HistoryLink;
