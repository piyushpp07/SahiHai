export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  preferences: {
      language: string;
      theme: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
