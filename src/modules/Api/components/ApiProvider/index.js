import Api from '../..';

export const ApiProvider = ({ host, children }) => {
  Api.host = host;
  return children;
};

export default ApiProvider;
