import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import WidgetTable from './WidgetTable';

jest.mock('./components/Table', () => jest.fn(() => <p>Mocked WidgetTable</p>));

const props = {
  columns: ['col1', { label: 'col2', sortable: false, display: false }],
  data: [
    ['col1-row1', 'col1-row2'],
    ['col2-row1', 'col2-row2'],
  ],
};

it('should render correctly', () => {
  const tree = renderer.create((
    <WidgetTable {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should init columns', () => {
  const wrapper = shallow(<WidgetTable {...props} />);
  expect(wrapper.state().columns).toEqual([
    { label: 'col1', sortable: true, display: true },
    { label: 'col2', sortable: false, display: false },
  ]);
});

it('should header change', () => {
  const event = {
    target: {
      checked: true,
    },
  };
  const wrapper = shallow(<WidgetTable {...props} />);
  const instance = wrapper.instance();
  instance.onHeaderChange({ event, index: 1 });
  expect(wrapper.state().columns).toEqual([
    { label: 'col1', sortable: true, display: true },
    { label: 'col2', sortable: false, display: true },
  ]);
});
