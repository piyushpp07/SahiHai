export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  preferredLanguage?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
