import React from 'react';
import renderer from 'react-test-renderer';
import BackgroundStyles from '.';

it('should render correctly', () => {
  const style = [{ label: 'Onizuka', url: 'Sensei' }];
  const tree = renderer.create(<BackgroundStyles selected="Sensei" styles={style} />).toJSON();
  expect(tree).toMatchSnapshot();
});
