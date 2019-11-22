import React from 'react';
import renderer from 'react-test-renderer';
import MapNavigation from './MapNavigation';

jest.mock('uuid/v4', () => () => '42');

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <MapNavigation />
      <MapNavigation visible />
      <MapNavigation>
        <p>Foo</p>
      </MapNavigation>
      <MapNavigation
        renderHeader={<p>Foo</p>}
        title="bar"
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
