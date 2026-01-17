export interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  pan?: string;
  tier: 'free' | 'premium';
  preferences: {
    language: string;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
}
