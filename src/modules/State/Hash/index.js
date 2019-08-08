import StateProvider from '../StateProvider';
import { withHashState } from './withHashState';

export default withHashState({ updateHash: true, listenHash: true })(StateProvider);
