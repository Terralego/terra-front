import LayerFetchValues from './LayerFetchValues';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export default connectLayersTree('fetchPropertiesValues')(LayerFetchValues);
