/* eslint-disable */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// To set desktop device as default size
global.innerWidth = 1280;