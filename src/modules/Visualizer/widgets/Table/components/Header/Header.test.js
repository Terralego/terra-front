import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Header from './Header';

jest.mock('@blueprintjs/core', () => {
  const Navbar = jest.fn(() => null);
  Navbar.Group = jest.fn(() => null);
  Navbar.Heading = jest.fn(() => null);
  return {
    Button: jest.fn(() => null),
    Checkbox: function Checkbox () { return null; },
    Label: jest.fn(() => null),
    Popover: function Popover () { return null; },
    Position: {
      RIGHT_BOTTOM: 'RIGHT_BOTTOM',
    },
    Navbar,
  };
});

const props = {
  title: 'Title',
  columns: [
    {
      label: 'Name',
      sortable: true,
      editable: true,
      display: true,
    },
    {
      label: 'Date',
      sortable: true,
      editable: true,
      format: { type: 'date', value: 'DD/MM/YYYY' },
      display: false,
    },
    {
      label: 'Lorem',
      sortable: true,
      editable: true,
      display: true,
    },
  ],
};

describe('header snapshot', () => {
  it('should render correctly', () => {
    const tree = renderer.create((
      <Header columns={props.columns} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with title', () => {
    const tree = renderer.create((
      <Header columns={props.columns} title={props.title} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('should item onchange', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<Header columns={props.columns} onChange={onChange} />, {});
  const popover = wrapper.find('Popover');
  const Content = () => popover.props().content;
  const wrapperContent = shallow(<Content />);
  wrapperContent.find('Checkbox').get(0).props.onChange();
  expect(onChange).toHaveBeenCalled();
});

it('should item onchange', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<Header columns={props.columns} />, {});
  const popover = wrapper.find('Popover');
  const Content = () => popover.props().content;
  const wrapperContent = shallow(<Content />);
  wrapperContent.find('Checkbox').get(0).props.onChange();
  expect(onChange).not.toHaveBeenCalled();
});
