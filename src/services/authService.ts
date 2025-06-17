import { User } from '../types';
import { nanoid } from 'nanoid';

interface LoginResponse {
  user: User;
  token: string;
}

// Simple JWT simulation for demo purposes
const createToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ ...user, exp: Date.now() + 24 * 60 * 60 * 1000 }));
  const signature = btoa(`signature_${user.id}`);
  return `${header}.${payload}.${signature}`;
};

const decodeToken = (token: string): User | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
};

// Simulated user storage
const getUsers = (): User[] => {
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored) : [];
};

const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you'd verify password hash
    if (password.length < 6) {
      throw new Error('Invalid credentials');
    }
    
    const token = createToken(user);
    return { user, token };
  },

  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const user: User = {
      id: nanoid(),
      email,
      name,
    };
    
    saveUser(user);
    const token = createToken(user);
    return { user, token };
  },

  validateToken(token: string): User | null {
    return decodeToken(token);
  },
};