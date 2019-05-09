import React from 'react';
import { Switch, Classes }  from '@blueprintjs/core'

const containerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  zIndex: 9999,
}

class ThemeSwitcher extends React.Component {
  state = {
    dark: true,
  }

  componentDidMount () {
    this.updateTheme();
  }

  componentDidUpdate ({}, { dark: prevDark }) {
    const { dark } = this.state;

    if (dark !== prevDark) {
      this.updateTheme();
    }
  }

  updateTheme () {
    const { dark } = this.state;
    const {classList } = document.body;
    classList[dark ? 'add' : 'remove'](Classes.DARK);
  }

  setTheme = ({ target: { checked: dark } }) => this.setState({ dark });

  render () {
    const { children } = this.props;
    const { dark } = this.state;

    return (
      <>
        <label style={containerStyle}>
          <Switch
            onChange={this.setTheme}
            innerLabel="Dark theme"
            checked={dark}
          />
        </label>
        
        {children}
      </>
    )
  }
}

export default storyFn => (
  <ThemeSwitcher>{storyFn()}</ThemeSwitcher>
)
