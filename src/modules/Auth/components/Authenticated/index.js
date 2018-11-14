import React from 'react';

import context from '../../services/context';

export class Authenticated extends React.Component {
  static contextType = context;

  render () {
    const { children } = this.props;

    return children(this.context);
  }
}

export default Authenticated;
