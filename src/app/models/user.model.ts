export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  avatar?: string;
  savedAddresses?: Address[];
}
