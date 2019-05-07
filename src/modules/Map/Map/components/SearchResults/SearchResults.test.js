import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import SearchResults from './SearchResults';

it('should render empty result', () => {
  const tree = renderer.create(
    <SearchResults />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render results', () => {
  const tree = renderer.create(
    <SearchResults
      results={[{
        group: 'empty',
        results: [],
      }, {
        group: 'foo',
        results: [{
          label: 'foo 1',
        }],
      }, {
        group: 'bar',
        total: 42,
        results: [{
          label: 'bar 1',
        }, {
          label: 'bar 2',
        }, {
          label: 'bar 3',
        }, {
          label: 'bar 4',
        }, {
          label: 'bar 5',
        }, {
          label: 'bar 6',
        }, {
          label: 'bar 7',
        }],
      }]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render results with selected item', () => {
  const selected = {
    label: 'bar 3',
  };
  const tree = renderer.create(
    <SearchResults
      results={[{
        group: 'bar',
        results: [{
          label: 'bar 1',
        }, {
          label: 'bar 2',
        }, selected, {
          label: 'bar 4',
        }, {
          label: 'bar 5',
        }, {
          label: 'bar 6',
        }, {
          label: 'bar 7',
        }],
      }]}
      selected={selected}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should click on result', () => {
  const result = {
    label: 'bar',
  };
  const onClick = jest.fn();
  const wrapper = shallow(
    <SearchResults
      results={[{
        group: 'foo',
        results: [result],
      }]}
      onClick={onClick}
    />,
  );
  wrapper.find('button').props().onClick(result);
  expect(onClick).toHaveBeenCalledWith(result);
});
