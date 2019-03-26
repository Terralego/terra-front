import React from 'react';
import renderer, { act } from 'react-test-renderer';
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
  expect(() => Range({ value: [10] })).toThrow(ERROR_MESSAGE);
  expect(() => Range({ value: [30, 10] })).toThrow(ERROR_MESSAGE);
});

it('should manually change value', () => {
  const onChange = jest.fn();
  let component;
  act(() => {
    component = renderer.create(<Range onChange={onChange} />);
  });

  const RangeSlider = component.root.find(({ type }) => type.name === 'RangeSlider');
  const { labelRenderer } = RangeSlider.props;

  expect(labelRenderer('64')).toBe('64');

  let labelEl;
  act(() => {
    labelEl = labelRenderer('0');
  });
  act(() => labelEl.props.onChange({ target: { value: '42' } }));
  act(() => labelEl.props.onBlur());
  expect(onChange).toHaveBeenCalledWith([42, 100]);

  act(() => {
    labelEl = labelRenderer('100');
  });
  act(() => labelEl.props.onChange({ target: { value: '67' } }));
  act(() => labelEl.props.onBlur());
  expect(onChange).toHaveBeenCalledWith([0, 67]);
});

it('should manually update value', () => {
  const onChange = jest.fn();
  let component;
  act(() => {
    component = renderer.create(<Range onChange={onChange} />);
  });
  const RangeSlider = component.root.find(({ type }) => type.name === 'RangeSlider');

  const { labelRenderer } = RangeSlider.props;
  let labelEl;
  act(() => {
    labelEl = labelRenderer('0');
  });

  act(() => labelEl.props.onChange({ target: { value: '4' } }));
  act(() => {
    labelEl = RangeSlider.props.labelRenderer('0');
  });
  expect(labelEl.props.html).toBe('4');
});
it('should ignore non numeric values', () => {
  const onChange = jest.fn();
  let component;
  act(() => {
    component = renderer.create(<Range onChange={onChange} />);
  });
  const RangeSlider = component.root.find(({ type }) => type.name === 'RangeSlider');

  const { labelRenderer } = RangeSlider.props;
  let labelEl;
  act(() => {
    labelEl = labelRenderer('0');
  });

  act(() => labelEl.props.onChange({ target: { value: 'a' } }));
  act(() => {
    labelEl = RangeSlider.props.labelRenderer('0');
  });
  expect(labelEl.props.html).toBe('0');
});

it('should manually select all', () => {
  const onChange = jest.fn();
  let component;
  act(() => {
    component = renderer.create(<Range onChange={onChange} />);
  });
  const RangeSlider = component.root.find(({ type }) => type.name === 'RangeSlider');
  const { labelRenderer } = RangeSlider.props;

  let labelEl;
  act(() => {
    labelEl = labelRenderer('0');
  });

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
  labelEl.props.onFocus({ target: mockedTarget });

  expect(global.getSelection).toHaveBeenCalled();
  expect(document.createRange).toHaveBeenCalled();
  expect(mockedRange.selectNodeContents).toHaveBeenCalledWith(mockedTarget);
  expect(mockedSelection.removeAllRanges).toHaveBeenCalled();
  expect(mockedSelection.addRange).toHaveBeenCalledWith(mockedRange);
});
