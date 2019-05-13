import LayerFetchValues from './LayerFetchValues';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export default connectLayersTree('fetchPropertyValues', 'fetchPropertyRange')(LayerFetchValues);
