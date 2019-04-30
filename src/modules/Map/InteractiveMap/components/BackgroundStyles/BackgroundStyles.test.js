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

it('should toggle selector', () => {
  const instance = new BackgroundStyles({});
  instance.setState = jest.fn();
  instance.state = {
    showRadioGroup: false,
  };
  instance.toggleSelector();
  expect(instance.setState).toHaveBeenCalledWith({
    showRadioGroup: true,
  });
  instance.setState.mockClear();

  instance.state = {
    showRadioGroup: true,
  };
  instance.toggleSelector();
  expect(instance.setState).toHaveBeenCalledWith({
    showRadioGroup: false,
  });
});

it('should change value', () => {
  const onChange = jest.fn();
  const instance = new BackgroundStyles({ onChange });
  instance.onChange({ target: { value: 'foo' } });
  expect(onChange).toHaveBeenCalledWith('foo');
});
