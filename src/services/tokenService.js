class TokenService {
  constructor () {
    this.token = localStorage.getItem('token') || null;
  }
  setToken (token) {
    this.token = token;
    localStorage.setItem('token', token);
  }
  removeToken () {
    this.token = null;
    localStorage.removeItem('token');
  }
  getToken () {
    return this.token;
  }
  isAuthenticated () {
    return this.token !== null;
  }
}

export default new TokenService();
