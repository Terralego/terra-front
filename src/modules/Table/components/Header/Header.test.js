import React from 'react';
import renderer from 'react-test-renderer';

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
    Intent: {
      PRIMARY: 'primary',
    },
  };
});

const props = {
  title: 'Title',
  columns: [
    {
      value: 'Name',
      sortable: true,
      editable: true,
      display: true,
    },
    {
      value: 'Date',
      sortable: true,
      editable: true,
      format: { type: 'date', value: 'DD/MM/YYYY' },
      display: false,
    },
    {
      value: 'Lorem',
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
