import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import syncMove from '@mapbox/mapbox-gl-sync-move';

import SyncMaps from './SyncMaps';
import SyncedMap from './SyncedMap';

jest.mock('@mapbox/mapbox-gl-sync-move', () => jest.fn());

class Map extends React.Component {
  static propTypes = {
    onMapInit: PropTypes.func,
  }

  static defaultProps = {
    onMapInit () {},
  }

  componentDidMount () {
    const { onMapInit } = this.props;
    onMapInit({ map: true });
  }

  render () {
    return null;
  }
}

it('should render correctly', () => {
  const tree = renderer.create((
    <SyncMaps>
      <SyncedMap>
        <Map />
      </SyncedMap>
      <SyncedMap>
        <Map />
      </SyncedMap>
    </SyncMaps>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should add a map to sync', () => {
  mount((
    <SyncMaps>
      <SyncedMap>
        <Map />
      </SyncedMap>
      <SyncedMap>
        <Map />
      </SyncedMap>
    </SyncMaps>
  ));

  expect(syncMove).toHaveBeenCalledWith({ map: true }, { map: true });
});

it('should not sync a single map', () => {
  const NotAMap = () => null;
  mount((
    <SyncMaps>
      <SyncedMap>
        <Map />
      </SyncedMap>
      <SyncedMap>
        <NotAMap />
      </SyncedMap>
    </SyncMaps>
  ));

  expect(syncMove).not.toHaveBeenCalledWith();
});
