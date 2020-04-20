import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ReportForm from './ReportForm';

it('should render correctly', () => {
  const tree = renderer.create(
    <ReportForm translate={m => m} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should return data on submit', () => {
  const submitMock = jest.fn();
  const wrapper = mount( // shallow trigger an error
    <ReportForm
      url="test/url"
      coordinates={{ lng: 42.42, lat: 31.31 }}
      onSubmit={submitMock}
      onCancel={jest.fn()}
      translate={jest.fn()}
    />,
  );

  wrapper.simulate('submit');
  expect(submitMock).toHaveBeenCalledWith({
    coordinates: { lng: 42.42, lat: 31.31 },
    url: 'test/url',
    comment: '',
    reportType: 'wrong_info', // default value set in component
  });
});
