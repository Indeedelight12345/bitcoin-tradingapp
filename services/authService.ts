import { SIMULATED_USERNAME, SIMULATED_PASSWORD } from '../constants';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';

export const authService = {
  login: async (username: string, password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === SIMULATED_USERNAME && password === SIMULATED_PASSWORD) {
          const mockToken = `mock-jwt-token-for-${username}-${Date.now()}`;
          localStorage.setItem(TOKEN_KEY, mockToken);
          localStorage.setItem(USER_KEY, username);
          resolve(mockToken);
        } else {
          reject(new Error('Invalid username or password.'));
        }
      }, 1000); // Simulate network delay
    });
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: (): string | null => {
    return localStorage.getItem(USER_KEY);
  },
};