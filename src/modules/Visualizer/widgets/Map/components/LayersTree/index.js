import LayersTree from './LayersTree';
import { connectTerraFrontProvider } from '../../../../../TerraFrontProvider';

export default connectTerraFrontProvider({
  render: 'modules.Visualizer.widgets.Map.renderLayersTree',
})(LayersTree);
