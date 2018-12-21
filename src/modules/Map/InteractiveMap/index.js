import { connectVisualizerProvider } from ".";
import InteractiveMap from './InteractiveMap';

export * from './InteractiveMap';
export default connectVisualizerProvider('setDetails')(InteractiveMap);
