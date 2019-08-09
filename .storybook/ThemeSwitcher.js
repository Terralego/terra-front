import React, { useState, useEffect } from 'react';
import { Switch, Classes }  from '@blueprintjs/core';

const containerStyle = {
  position: 'fixed',
  bottom: '.5em',
  left: '.5em',
  zIndex: 9999,
};

const ThemeSwitcher = ({ children, ...rest }) => {
  const [, forceUpdate] = useState();
  const bodyClassList = document.body.classList;

  useEffect(() => {
    bodyClassList.add(Classes.DARK);
    forceUpdate({});
  }, [bodyClassList]);

  const handleThemeSwitch = ({ target: { checked: dark } }) => {
    bodyClassList.toggle(Classes.DARK, dark);
    forceUpdate({});
  };

  return (
    <>
      <div style={containerStyle} {...rest}>
        <Switch
          onChange={handleThemeSwitch}
          innerLabel="Dark theme"
          checked={bodyClassList.contains(Classes.DARK)}
        />
      </div>

      {children}
    </>
  );
};

export default storyFn => (
  <ThemeSwitcher>{storyFn()}</ThemeSwitcher>
);
