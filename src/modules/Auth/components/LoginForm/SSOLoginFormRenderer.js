
import React from 'react';
import { Button, AnchorButton } from '@blueprintjs/core';

import LoginFormRender from './LoginFormRenderer';

export default function SSOLoginFormRenderer ({
  ssoLink,
  ssoButtonText,
  defaultButtonText,
  translate,
  ...props
}) {
  const [internalAuth, setInternalAuth] = React.useState(false);
  const ssoUrl = new URL(ssoLink, window.location);

  return (
    <div className="login-form">
      <AnchorButton
        text={ssoButtonText || translate('auth.loginform.renderer.sso')}
        href={ssoUrl.href}
        intent="success"
        large
      />
      <span className="login-form__separator bp3-text-large bp3-text-muted">
        {translate('auth.loginform.renderer.separator')}
      </span>

      {internalAuth
        ? <LoginFormRender {...props} translate={translate} />
        : (
          <Button type="button" onClick={() => setInternalAuth(true)}>
            {defaultButtonText || translate('auth.loginform.renderer.internal')}
          </Button>
        )}
    </div>
  );
}
