import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Table from './Table';

jest.mock('./components/Table', () => jest.fn(() => <p>Mocked Table</p>));

const props = {
  columns: ['col1', { value: 'col2', sortable: false, display: false }],
  data: [
    ['col1-row1', 'col1-row2'],
    ['col2-row1', 'col2-row2'],
  ],
};

it('should render correctly', () => {
  const tree = renderer.create((
    <Table {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should init columns', () => {
  const wrapper = shallow(<Table {...props} />);
  expect(wrapper.state().columns).toEqual([
    { value: 'col1', sortable: true, display: true },
    { value: 'col2', sortable: false, display: false },
  ]);
});

it('should header change', () => {
  const event = {
    target: {
      checked: true,
    },
  };
  const wrapper = shallow(<Table {...props} />);
  const instance = wrapper.instance();
  instance.onHeaderChange({ event, index: 1 });
  expect(wrapper.state().columns).toEqual([
    { value: 'col1', sortable: true, display: true },
    { value: 'col2', sortable: false, display: true },
  ]);
});

it('should reset columns', () => {
  const wrapper = shallow(<Table columns={['foo']} data={[]} />);
  const instance = wrapper.instance();
  jest.spyOn(instance, 'resetColumns');
  const columns = ['bar', { label: 'Foo', value: 'foo', display: false }];
  wrapper.setProps({ columns });
  expect(instance.resetColumns).toHaveBeenCalledWith(columns);
  expect(wrapper.state().columns).toEqual([
    { value: 'bar', display: true, sortable: true },
    { label: 'Foo', value: 'foo', display: false },
  ]);
});

it('should get filtered columns', () => {
  const instance = new Table({});
  instance.state.columns = [{
    value: 'foo',
    display: false,
  }, {
    value: 'bar',
    display: true,
  }];
  expect(instance.filteredColumns).toEqual([{
    value: 'bar',
    display: true,
  }]);
});

it('should get filtered data', () => {
  const instance = new Table({ data: [
    ['foo1', 'bar1'],
    ['foo2', 'bar2'],
    ['foo3', 'bar3'],
  ] });
  instance.state.columns = [{
    value: 'foo',
    display: false,
  }, {
    value: 'bar',
    display: true,
  }];
  expect(instance.filteredData).toEqual([
    ['bar1'],
    ['bar2'],
    ['bar3'],
  ]);
});
