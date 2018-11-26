import View from './View';
import { connectTerraFrontProvider } from '../../../TerraFrontProvider';
import { connectVisualizerProvider } from '../../services/context';

export default connectTerraFrontProvider({
  '*': 'modules.Visualizer.components.View',
})(connectVisualizerProvider('details', 'setDetails')(View));
