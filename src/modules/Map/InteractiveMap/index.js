import { connectVisualizerProvider } from '../../Visualizer/services/context';
import WidgetMap from './WidgetMap';

export * from './WidgetMap';
export default connectVisualizerProvider('setDetails')(WidgetMap);
