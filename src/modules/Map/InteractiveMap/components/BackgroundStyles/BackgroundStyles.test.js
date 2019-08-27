import React from 'react';
import renderer from 'react-test-renderer';
import BackgroundStyles from '.';

jest.mock('@blueprintjs/core', () => ({
  Radio () {
    return <span>Radio</span>;
  },
  RadioGroup ({ children }) {
    return <span className="RadioGroup">{children}</span>;
  },
  Button () {
    return <span>Button</span>;
  },
  Icon () {
    return <span>Icon</span>;
  },
  Popover ({ children }) {
    return <span className="Popover">{children}</span>;
  },
  Tooltip  ({ children }) {
    return <span className="Tooltip">{children}</span>;
  },
}));
it('should render correctly', () => {
  const style = [{ label: 'Onizuka', url: 'Sensei' }];
  const tree = renderer.create(
    <BackgroundStyles
      selected="Sensei"
      styles={style}
      onChange={() => {}}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change value', () => {
  const onChange = jest.fn();
  const instance = new BackgroundStyles({ onChange });
  instance.onChange({ target: { value: 'foo' } });
  expect(onChange).toHaveBeenCalledWith('foo');
});
