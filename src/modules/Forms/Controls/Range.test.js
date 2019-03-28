import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Range from './Range';

jest.mock('@blueprintjs/core', () => ({
  RangeSlider: () => <p>Range</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <Range
      label="My range"
      values={[1, 4]}
      onChange={() => null}
      min={0}
      max={10}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Range
      label="Change Values of my range"
      onChange={onChange}
      values={[10, 30]}
      min={0}
      max={100}
    />
  ));
  wrapper.find('RangeSlider').props().onChange([20, 40]);
  expect(onChange).toHaveBeenCalled();
});

it('should throw an error when values are incorrect', () => {
  const ERROR_MESSAGE =  'Range control: There must be two values and the first must be less than the second';
  expect(() => new Range({ value: [10] }).render()).toThrow(ERROR_MESSAGE);
  expect(() => new Range({ value: [30, 10] }).render()).toThrow(ERROR_MESSAGE);
});

it('should blur', () => {
  const instance = new Range({});
  instance.handleManualChange = jest.fn();
  instance.setState = jest.fn();
  instance.onBlur();
  expect(instance.handleManualChange).toHaveBeenCalled();
  expect(instance.setState).toHaveBeenCalledWith({ newMin: undefined, newMax: undefined });
});

it('should handle manual change', () => {
  const onChange = jest.fn();
  const instance = new Range({ onChange, min: 0, max: 100 });
  instance.state = { newMin: '42' };
  instance.handleManualChange();
  expect(onChange).toHaveBeenCalledWith([42, 100]);
  onChange.mockClear();

  instance.state = { newMax: '42' };
  instance.handleManualChange();
  expect(onChange).toHaveBeenCalledWith([0, 42]);
  onChange.mockClear();
});

it('should manually select all', () => {
  const instance = new Range();
  const mockedSelection = {
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
  };
  const mockedRange = {
    selectNodeContents: jest.fn(),
  };
  global.getSelection = jest.fn(() => mockedSelection);
  document.createRange = jest.fn(() => mockedRange);
  const mockedTarget = {};
  instance.selectAll({ target: mockedTarget });

  expect(global.getSelection).toHaveBeenCalled();
  expect(document.createRange).toHaveBeenCalled();
  expect(mockedRange.selectNodeContents).toHaveBeenCalledWith(mockedTarget);
  expect(mockedSelection.removeAllRanges).toHaveBeenCalled();
  expect(mockedSelection.addRange).toHaveBeenCalledWith(mockedRange);
});

describe('Label rendering', () => {
  const instance = new Range({ min: 0, max: 100 });
  it('should render display labels', () => {
    const label = instance.labelRenderer(10);
    expect(label).toBe(10);
  });

  it('should render min label as editbale', () => {
    const label = instance.labelRenderer(0);
    expect(label.type.name).toBe('ContentEditable');
    expect(label.props.html).toBe('0');
  });

  it('should render max label as editbale', () => {
    const label = instance.labelRenderer(100);
    expect(label.type.name).toBe('ContentEditable');
    expect(label.props.html).toBe('100');
  });

  it('should render typed value', () => {
    instance.state = {
      newMin: 4,
    };
    const label = instance.labelRenderer(0);
    expect(label.type.name).toBe('ContentEditable');
    expect(label.props.html).toBe('4');
  });

  it('should edit label', () => {
    instance.setState = jest.fn();
    instance.onLabelEdit({ minChanged: true })({ target: { value: '4' } });
    expect(instance.setState).toHaveBeenCalledWith({ newMin: 4 });

    instance.setState = jest.fn();
    instance.onLabelEdit({ maxChanged: true })({ target: { value: '4' } });
    expect(instance.setState).toHaveBeenCalledWith({ newMax: 4 });

    instance.setState = jest.fn();
    instance.onLabelEdit({ maxChanged: true })({ target: { value: 'A' } });
    expect(instance.setState).toHaveBeenCalledWith({ newMax: 0 });
  });
});
