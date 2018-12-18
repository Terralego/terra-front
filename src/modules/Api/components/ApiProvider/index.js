import Api from '../../services/api';

export const ApiProvider = ({ host, children }) => {
  Api.host = host;
  return children;
};

export default ApiProvider;
