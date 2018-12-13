import React from 'react';
import LayersTree from './LayersTree';
import { connectTerraFrontProvider } from '../../../../../TerraFrontProvider';

export * from './LayersTree';
export default connectTerraFrontProvider({
  renderLayersTree: 'modules.Visualizer.widgets.Map.renderLayersTree',
})(
  ({
    renderLayersTree: RenderLayersTree = LayersTree,
    ...props
  }) => <RenderLayersTree defaultRender={LayersTree} {...props} />,
);
