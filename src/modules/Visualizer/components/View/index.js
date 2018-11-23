import View from './View';
import { connectVisualizerProvider } from '../../services/context';

export default connectVisualizerProvider('details', 'setDetails')(View);
