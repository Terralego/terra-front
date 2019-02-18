import React from 'react';
import renderer from 'react-test-renderer';

import FeatureProperties from './FeatureProperties';
import fetchFeatures from './fetchFeatures';
import log from '../services/log';

jest.mock('./fetchFeatures', () => jest.fn(url => {
  if (url === 'some/url/1') {
    return {
      bar: 'bar',
    };
  }
  throw new Error('not found');
}));

jest.mock('../services/log', () => jest.fn());

beforeEach(() => fetchFeatures.mockClear());

it('should render static properties', async done => {
  const tree = renderer.create((
    <FeatureProperties
      properties={{ id: '1', foo: 'foo' }}
    >
      {properties => (
        <p>
          {properties.loading}
          {properties.bar}
          {properties.foo}
        </p>
      )}
    </FeatureProperties>
  ));
  await true;

  expect(tree.toJSON()).toMatchSnapshot();
  expect(fetchFeatures).not.toHaveBeenCalled();
  done();
});

it('should render fetched properties', async done => {
  const tree = renderer.create((
    <FeatureProperties
      url="some/url/{{id}}"
      id="id"
      properties={{ id: '1', foo: 'foo' }}
    >
      {properties => (
        <p>
          {properties.loading}
          {properties.bar}
          {properties.foo}
        </p>
      )}
    </FeatureProperties>
  ));

  await true;

  expect(tree.toJSON()).toMatchSnapshot();
  expect(fetchFeatures).toHaveBeenCalledWith('some/url/1');
  done();
});

it('should fail to get an id value', async done => {
  const tree = renderer.create((
    <FeatureProperties
      url="some/url/{{id}}"
      id="fail"
      properties={{ id: '1', foo: 'foo' }}
    >
      {properties => (
        <p>
          {properties.loading}
          {properties.bar}
          {properties.foo}
        </p>
      )}
    </FeatureProperties>
  ));

  await true;

  expect(tree.toJSON()).toMatchSnapshot();
  expect(fetchFeatures).not.toHaveBeenCalled();
  expect(log).toHaveBeenCalled();
  done();
});

it('should fail to fetch properties', async done => {
  const tree = renderer.create((
    <FeatureProperties
      url="some/url/{{id}}"
      id="id"
      properties={{ id: '2', foo: 'foo' }}
    >
      {properties => (
        <p>
          {properties.loading}
          {properties.bar}
          {properties.foo}
        </p>
      )}
    </FeatureProperties>
  ));

  await true;

  expect(tree.toJSON()).toMatchSnapshot();
  expect(fetchFeatures).toHaveBeenCalledWith('some/url/2');
  expect(log).toHaveBeenCalled();
  done();
});
it('should set properties in state', async done => {
  const instance = new FeatureProperties({
    url: 'some/url/{{id}}',
    id: 'id',
    properties: { id: '1', foo: 'foo' },
  });
  instance.setState = jest.fn();
  await instance.fetchProperties();
  expect(instance.setState).toHaveBeenCalledWith({
    properties: {
      id: '1',
      foo: 'foo',
      loading: true,
    },
  });
  expect(instance.setState).toHaveBeenCalledWith({
    properties: {
      id: '1',
      foo: 'foo',
      bar: 'bar',
      loading: false,
    },
  });

  done();
});
