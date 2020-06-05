import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import {
  Tab,
  Tabs,
  Overlay,
  Classes,
  Button,
} from '@blueprintjs/core';
import { LoginForm, SignupForm } from '../../modules/Auth';
import withDeviceSize from '../../hoc/withDeviceSize';

import NavBarItemDesktop from '../NavBarItemDesktop';
import NavBarItemTablet from '../NavBarItemTablet';

export const LoginButton = ({
  authenticated,
  isMobileSized,
  isPhoneSized,
  logoutAction,
  t,
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
    logoutAction();
  }, [logoutAction]);

  const setOpen = useCallback(() => setIsOpen(true), []);
  const setClose = useCallback(() => setIsOpen(false), []);
  const onBeforeSubmitting = useCallback(() => setIsNewlyAuthenticated(true), []);
  const onAfterSubmitting = useCallback(() => setIsNewlyAuthenticated(false), []);
  const onCreate = useCallback(() => setHasCreated(true), []);

  return (
    <>
      <NavBarItem {...props} onClick={setOpen} />
      <Overlay
        className={classNames(
          Classes.OVERLAY_SCROLL_CONTAINER,
          Classes.DARK,
          'modal-signin',
        )}
        isOpen={isOpen}
        onClose={setClose}
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
              title={t('auth.loginform.title')}
              panel={(
                <LoginForm
                  onBeforeSubmitting={onBeforeSubmitting}
                  onAfterSubmitting={onAfterSubmitting}
                  translate={t}
                />
              )}
            />
            <Tab
              id="signup"
              title={t('auth.signupform.title')}
              panel={hasCreated
                ? <p>{t('auth.signupform.done')}</p>
                : (
                  <SignupForm
                    translate={t}
                    showPassword={false}
                    onCreate={onCreate}
                  />
                )}
            />
          </Tabs>
          )}
          {wantLogout && (
          <div
            id="logout"
          >
            <p>{t('auth.logout.confirm.label')}</p>
            <div className="modal-signin__form-buttons">
              <Button
                text={t('auth.logout.cancel.button_label')}
                onClick={setClose}
                minimal
              />
              <Button
                text={t('auth.logout.confirm.button_label')}
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

export default withDeviceSize()(LoginButton);
