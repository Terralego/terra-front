import React from 'react';
import renderer from 'react-test-renderer';
import Control from './Control';

it('should ensure translation works', () => {
  const translate = jest.fn(() => '');
  renderer.create((
    <Control
      component={({ translate: t }) => t()}
      translate={translate}
    />
  )).toJSON();
  expect(translate).toHaveBeenCalled();
});
