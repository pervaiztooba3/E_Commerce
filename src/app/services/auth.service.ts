import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Address } from '../models/user.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_STORAGE_KEY = 'ecommerce_user';
  private readonly USERS_DB_KEY = 'ecommerce_users_db';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private demoUsers: User[] = [
    {
      id: 'usr-customer-1',
      name: 'John Doe',
      email: 'user@shop.com',
      role: 'user',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      savedAddresses: [
        {
          id: 'addr-1',
          fullName: 'John Doe',
          phone: '+1 (555) 234-5678',
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          postalCode: '97477',
          isDefault: true
        }
      ]
    },
    {
      id: 'usr-admin-1',
      name: 'Admin Manager',
      email: 'admin@shop.com',
      role: 'admin',
      phone: '+1 (555) 999-0000',
      address: '100 Executive Parkway',
      city: 'Tech City',
      postalCode: '90001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    }
  ];

  constructor(private notification: NotificationService) {
    this.initUsersDatabase();
    this.loadCurrentUser();
  }

  private initUsersDatabase() {
    const stored = localStorage.getItem(this.USERS_DB_KEY);
    if (!stored) {
      localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(this.demoUsers));
    }
  }

  private getUsersDb(): User[] {
    const stored = localStorage.getItem(this.USERS_DB_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error reading users db', e);
      }
    }
    return this.demoUsers;
  }

  private saveUsersDb(users: User[]) {
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
  }

  private loadCurrentUser() {
    const stored = localStorage.getItem(this.USER_STORAGE_KEY);
    if (stored) {
      try {
        const user: User = JSON.parse(stored);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse active user', e);
      }
    } else {
      // Default auto-login as customer for smooth user testing
      this.currentUserSubject.next(this.demoUsers[0]);
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(this.demoUsers[0]));
    }
  }

  login(email: string, pass: string): boolean {
    const users = this.getUsersDb();
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (found) {
      // Simple mock password check: accept password123 or admin123 or any length > 3
      if (pass.length >= 4) {
        this.currentUserSubject.next(found);
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(found));
        this.notification.success(`Welcome back, ${found.name}!`, 'Logged In');
        return true;
      }
    }

    this.notification.error('Invalid email or password. Try user@shop.com / password123', 'Login Failed');
    return false;
  }

  register(name: string, email: string, pass: string): boolean {
    const users = this.getUsersDb();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      this.notification.error('An account with this email already exists.', 'Registration Failed');
      return false;
    }

    const newUser: User = {
      id: 'usr-' + Date.now().toString(36),
      name,
      email: normalizedEmail,
      role: 'user',
      savedAddresses: []
    };

    const updated = [...users, newUser];
    this.saveUsersDb(updated);

    this.currentUserSubject.next(newUser);
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(newUser));
    this.notification.success('Account created successfully!', 'Welcome');
    return true;
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.notification.info('You have been logged out.', 'Signed Out');
  }

  updateProfile(profileData: Partial<User>): void {
    const current = this.currentUserSubject.value;
    if (!current) return;

    const updatedUser: User = {
      ...current,
      ...profileData
    };

    this.currentUserSubject.next(updatedUser);
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));

    // Update DB as well
    const users = this.getUsersDb();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsersDb(users);
    }

    this.notification.success('Profile updated successfully.', 'Profile Saved');
  }

  addSavedAddress(addressData: Omit<Address, 'id'>): void {
    const current = this.currentUserSubject.value;
    if (!current) return;

    const newAddress: Address = {
      ...addressData,
      id: 'addr-' + Date.now().toString(36)
    };

    const existing = current.savedAddresses || [];
    const updatedAddresses = [...existing, newAddress];

    this.updateProfile({ savedAddresses: updatedAddresses });
  }

  deleteSavedAddress(addressId: string): void {
    const current = this.currentUserSubject.value;
    if (!current || !current.savedAddresses) return;

    const updatedAddresses = current.savedAddresses.filter(a => a.id !== addressId);
    this.updateProfile({ savedAddresses: updatedAddresses });
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === 'admin' : false;
  }
}
