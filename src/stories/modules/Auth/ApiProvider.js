import Api from '../../../modules/Api';

export const ApiProvider = ({ host, children }) => {
  Api.host = host;
  return children;
};


export default ApiProvider;
