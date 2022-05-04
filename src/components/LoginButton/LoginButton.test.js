import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import LoginButton from './LoginButton';

it('should render', () => {
  const { baseElement } = render(<LoginButton data-testid="login-button" />);
  fireEvent.click(baseElement.querySelector('[data-testid]'));
  expect(baseElement).toMatchSnapshot();
});


it('should render custom renderer when clicked', () => {
  const customRenderedText = 'Custom Renderer';
  const CustomRenderer = () => (<h1>{customRenderedText}</h1>);

  const { baseElement } = render(
    <LoginButton data-testid="login-button" render={CustomRenderer} />,
  );
  fireEvent.click(baseElement.querySelector('[data-testid]'));
  expect(screen.getByText(customRenderedText)).toBeDefined();
  expect(baseElement).toMatchSnapshot();
});
