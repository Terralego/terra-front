import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Tab,
  Tabs,
  Overlay,
  Classes,
  Button,
} from '@blueprintjs/core';
import { LoginForm, SignupForm } from '../../modules/Auth';
import translateMock from '../../utils/translate';

import NavBarItemDesktop from '../NavBarItemDesktop';
import NavBarItemTablet from '../NavBarItemTablet';
import LoginFormRenderer from '../../modules/Auth/components/LoginForm/LoginFormRenderer';

export const LoginButton = ({
  authenticated,
  isMobileSized,
  isPhoneSized,
  logoutAction,
  translate,
  allowUserRegistration,
  render = LoginFormRenderer,
  ssoLink,
  defaultButtonText,
  ssoButtonText,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCreated, setHasCreated] = useState(false);
  const [isNewlyAuthenticated, setIsNewlyAuthenticated] = useState(false);

  const wantLogout = isOpen && authenticated && !isNewlyAuthenticated;
  const NavBarItem = isMobileSized ? NavBarItemTablet : NavBarItemDesktop;

  useEffect(() => {
    if (authenticated) {
      setIsOpen(false);
    }
  }, [authenticated]);

  const confirmLogout = useCallback(() => {
    setIsOpen(false);
    logoutAction(ssoLink);
  }, [logoutAction, ssoLink]);

  const toggleOverlay = () => setIsOpen(boolean => !boolean);

  return (
    <>
      <NavBarItem {...props} onClick={toggleOverlay} />
      <Overlay
        className={classNames(
          Classes.OVERLAY_SCROLL_CONTAINER,
          Classes.DARK,
          'modal-signin',
        )}
        isOpen={isOpen}
        onClose={toggleOverlay}
      >
        <div
          className={classNames(
            Classes.CARD,
            Classes.ELEVATION_4,
            'modal-signin__form',
          )}
        >
          {isOpen && !authenticated
          && (
          <Tabs id="login">
            <Tab
              id="signin"
              title={translate('auth.loginform.title')}
              panel={(
                <LoginForm
                  onBeforeSubmitting={() => setIsNewlyAuthenticated(true)}
                  onAfterSubmitting={() => setIsNewlyAuthenticated(false)}
                  translate={translate}
                  render={render}
                  ssoLink={ssoLink}
                  ssoButtonText={ssoButtonText}
                  defaultButtonText={defaultButtonText}
                />
              )}
            />
            {allowUserRegistration &&
              (
                <Tab
                  id="signup"
                  title={translate('auth.signupform.title')}
                  panel={hasCreated
                    ? <p>{translate('auth.signupform.done')}</p>
                    : (
                      <SignupForm
                        translate={translate}
                        showPassword={false}
                        onCreate={() => setHasCreated(true)}
                      />
                    )}
                />
              )}
          </Tabs>
          )}
          {wantLogout && (
          <div
            id="logout"
          >
            <p>{translate('auth.logout.confirm.label')}</p>
            <div className="modal-signin__form-buttons">
              <Button
                text={translate('auth.logout.cancel.button_label')}
                onClick={toggleOverlay}
                minimal
              />
              <Button
                text={translate('auth.logout.confirm.button_label')}
                onClick={confirmLogout}
                intent="primary"
              />
            </div>
          </div>
          )}
        </div>
      </Overlay>
    </>
  );
};

LoginButton.propTypes = {
  authenticated: PropTypes.bool,
  isMobileSized: PropTypes.bool,
  isPhoneSized: PropTypes.bool,
  logoutAction: PropTypes.func,
  translate: PropTypes.func,
  ssoLink: PropTypes.string,
  defaultButtonText: PropTypes.string,
  ssoButtonText: PropTypes.string,
};

LoginButton.defaultProps = {
  authenticated: false,
  isMobileSized: false,
  isPhoneSized: false,
  ssoLink: undefined,
  defaultButtonText: undefined,
  ssoButtonText: undefined,
  logoutAction () {},
  translate: translateMock({
    'auth.loginform.title': 'Sign in',
    'auth.signupform.title': 'Create an account',
    'auth.signupform.done': 'Successfully created',
    'auth.logout.cancel.button_label': 'Cancel',
    'auth.logout.confirm.button_label': 'Confirm',
    'auth.logout.confirm.label': 'Confirm logout',
    'auth.loginform.email.helper': 'Type your email',
    'auth.loginform.email.helper_invalid': 'Invalid email',
    'auth.loginform.email.label': 'Email',
    'auth.loginform.email.info': 'required',
    'auth.loginform.email.placeholder': 'Email',
    'auth.loginform.password.helper': 'Type your password',
    'auth.loginform.password.helper_invalid': 'Invalid password',
    'auth.loginform.password.label': 'Password',
    'auth.loginform.password.info': 'required',
    'auth.loginform.password.placeholder': 'Password',
    'auth.loginform.submit': 'Signin',
    'auth.loginform.error_generic': 'Invalid credentials',
    'auth.signupform.email.label': 'Email',
    'auth.signupform.email.info': 'required',
    'auth.signupform.email.placeholder': 'Email',
    'auth.signupform.email.help': 'Type your email',
    'auth.signupform.submit': 'signup',
  }),
};

export default LoginButton;
