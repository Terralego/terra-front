import React from 'react';
import renderer from 'react-test-renderer';
import SSOLoginFormRenderer from './SSOLoginFormRenderer';

const translate = text => text;

it('should render correctly', () => {
  const tree = renderer.create(
    <SSOLoginFormRenderer translate={translate} ssoLink="sso/url/test" />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with authentication url and labels', () => {
  const tree = renderer.create(
    <SSOLoginFormRenderer
      translate={translate}
      ssoLink="login/url/test"
      defaultButtonText="default button"
      ssoButtonText="sso button"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when internal authentication chose', () => {
  const testRenderer = renderer.create(<SSOLoginFormRenderer translate={translate} />);
  const button = testRenderer.root.findByType('button');
  renderer.act(() => {
    button.props.onClick();
  });
  const tree = testRenderer.toJSON();
  expect(tree).toMatchSnapshot();
});
