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

it('should reset data', () => {
  const data = {};
  const instance = new Table({ data });
  instance.resetData = jest.fn();
  instance.componentDidUpdate({ data: {} });
  expect(instance.resetData).toHaveBeenCalledWith(data);
});

it('should filter props', () => {
  const instance = new Table({});
  instance.setState = jest.fn();

  instance.propsFiltered([{
    value: 'foo',
    display: true,
  }, {
    value: 'bar',
    display: false,
  }]);
  expect(instance.setState).toHaveBeenCalledWith({
    columnsFiltered: [{
      value: 'foo',
      display: true,
    }],
    dataFiltered: [],
  });

  instance.setState.mockClear();

  instance.propsFiltered([{
    value: 'foo',
    display: true,
  }, {
    value: 'bar',
    display: false,
  }], [['datafoo', 'databar']]);
  expect(instance.setState).toHaveBeenCalledWith({
    columnsFiltered: [{
      value: 'foo',
      display: true,
    }],
    dataFiltered: [['datafoo']],
  });
});
