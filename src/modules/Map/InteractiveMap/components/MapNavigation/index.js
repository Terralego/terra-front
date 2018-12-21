import React from 'react';
import MapNavigation from './MapNavigation';
import { connectTerraFrontProvider } from '../../../../TerraFrontProvider';

export * from './MapNavigation';
export default connectTerraFrontProvider({
  renderMapNavigation: 'modules.Visualizer.widgets.Map.renderMapNavigation',
})(
  ({
    renderMapNavigation: RenderMapNavigation = MapNavigation,
    ...props
  }) => <RenderMapNavigation defaultRender={MapNavigation} {...props} />,
);
