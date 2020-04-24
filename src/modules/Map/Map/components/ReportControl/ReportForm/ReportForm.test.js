import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ReportForm from '.';

it('should render correctly', () => {
  const tree = renderer.create(
    <ReportForm translate={m => m} coordinates={{}} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should return data on submit', () => {
  const submitMock = jest.fn();
  const coordinates = { lng: 42.42, lat: 31.31 };
  const wrapper = mount( // shallow trigger an error
    <ReportForm
      url="test/url"
      coordinates={coordinates}
      onSubmit={submitMock}
      onCancel={jest.fn()}
      translate={jest.fn()}
    />,
  );

  wrapper.simulate('submit');
  expect(submitMock).toHaveBeenCalledWith({
    lng: coordinates.lng.toString(),
    lat: coordinates.lat.toString(),
    url: 'test/url',
    comment: '',
    reportType: 'wrong_info', // default value set in component
  });
});
