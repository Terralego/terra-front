import React from 'react';
import { connectTerraFrontProvider } from '../../TerraFrontProvider';
import InteractiveMap from './InteractiveMap';

export * from './InteractiveMap';
export default connectTerraFrontProvider({
  renderInteractiveMap: 'modules.Map.components.renderInteractiveMap',
})(
  ({
    renderInteractiveMap: RenderInteractiveMap = InteractiveMap,
    ...props
  }) => <RenderInteractiveMap defaultRender={InteractiveMap} {...props} />,
);
