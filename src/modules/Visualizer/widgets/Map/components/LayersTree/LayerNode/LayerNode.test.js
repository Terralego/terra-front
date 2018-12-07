import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import LayersNode from '.';

it('should render correctly', () => {
  const tree = renderer.create((
    <div>
      <LayersNode
        LayersTree={[]}
      />
      <LayersNode
        LayersTree={[]}
        isActive
      />
    </div>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should open options panel', () => {
  const wrapper = shallow(<LayersNode />);
  const instance = wrapper.instance();
  jest.spyOn(instance, 'setState');
  instance.handleOptionPanel();
  expect(instance.setState).toHaveBeenCalledWith({ isOptionsOpen: true });
  instance.setState.mockClear();
  instance.handleOptionPanel();
  expect(instance.setState).toHaveBeenCalledWith({ isOptionsOpen: false });
});

it('should render options layer', () => {
  const wrapper = shallow(<LayersNode isActive />);
  wrapper.setState({ isOptionsOpen: true });
  expect(wrapper.find('OptionsLayer').length).toBe(1);
})
;